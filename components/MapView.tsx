import React, { useEffect, useMemo, useRef, useState } from "react";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

const DESTINATION = {
  latitude: -6.1754,
  longitude: 106.8272,
};

const DEFAULT_REGION_DELTA = {
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

type Coordinate = { latitude: number; longitude: number };

type KalmanState = {
  lat: number;
  lon: number;
  varianceLat: number;
  varianceLon: number;
};

const processNoise = 1e-5;
const measurementNoise = 1e-3;

function applyKalmanFilter(
  measurement: Coordinate,
  stateRef: React.MutableRefObject<KalmanState | null>,
): Coordinate {
  if (!stateRef.current) {
    stateRef.current = {
      lat: measurement.latitude,
      lon: measurement.longitude,
      varianceLat: 1,
      varianceLon: 1,
    };
    return measurement;
  }

  const updateAxis = (estimate: number, variance: number, value: number) => {
    const predictedVariance = variance + processNoise;
    const kalmanGain =
      predictedVariance / (predictedVariance + measurementNoise);
    const newEstimate = estimate + kalmanGain * (value - estimate);
    const newVariance = (1 - kalmanGain) * predictedVariance;
    return { estimate: newEstimate, variance: newVariance };
  };

  const updatedLat = updateAxis(
    stateRef.current.lat,
    stateRef.current.varianceLat,
    measurement.latitude,
  );
  const updatedLon = updateAxis(
    stateRef.current.lon,
    stateRef.current.varianceLon,
    measurement.longitude,
  );

  stateRef.current = {
    lat: updatedLat.estimate,
    lon: updatedLon.estimate,
    varianceLat: updatedLat.variance,
    varianceLon: updatedLon.variance,
  };

  return { latitude: stateRef.current.lat, longitude: stateRef.current.lon };
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const kalmanStateRef = useRef<KalmanState | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const isMountedRef = useRef(true);

  const [current, setCurrent] = useState<Coordinate>(DESTINATION);
  const [currentAddress, setCurrentAddress] = useState<string>(
    "Menunggu lokasi perangkat...",
  );
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [journeyStart, setJourneyStart] = useState<Date | null>(null);
  const [initialRegion, setInitialRegion] = useState<Coordinate | null>(null);
  const [isFetchingRoute, setIsFetchingRoute] = useState(false);

  const snapPoints = useMemo(() => ["38%", "72%"], []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);
      if (!granted) return;

      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const initialCoordinate = applyKalmanFilter(
        {
          latitude: initial.coords.latitude,
          longitude: initial.coords.longitude,
        },
        kalmanStateRef,
      );

      setCurrent(initialCoordinate);
      setJourneyStart(new Date());
      setInitialRegion(initialCoordinate);
      mapRef.current?.animateToRegion({
        ...initialCoordinate,
        ...DEFAULT_REGION_DELTA,
      });

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          const filtered = applyKalmanFilter(
            { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
            kalmanStateRef,
          );
          setCurrent(filtered);
          mapRef.current?.animateToRegion({
            ...filtered,
            ...DEFAULT_REGION_DELTA,
          });
        },
      );
    })();

    return () => watchRef.current?.remove();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;
    let cancelled = false;
    (async () => {
      try {
        const [geo] = await Location.reverseGeocodeAsync(current);
        if (cancelled || !geo) return;
        const street = geo.name || geo.street || "Lokasi tanpa nama";
        const detail = geo.district || geo.city || geo.subregion || "";
        setCurrentAddress(`${street}${detail ? ", " + detail : ""}`);
      } catch {
        if (!cancelled) setCurrentAddress(`Lat ${current.latitude.toFixed(4)}, Lon ${current.longitude.toFixed(4)}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [current.latitude, current.longitude, hasPermission]);

  useEffect(() => {
    if (!hasPermission || isFetchingRoute) return;
    setIsFetchingRoute(true);
    const controller = new AbortController();

    (async () => {
      try {
        const start = [current.longitude, current.latitude];
        const end = [DESTINATION.longitude, DESTINATION.latitude];
        const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        const coords: [number, number][] =
          json?.routes?.[0]?.geometry?.coordinates || [];
        if (!isMountedRef.current) return;
        setRouteCoords(
          coords.map(([lon, lat]) => ({ latitude: lat, longitude: lon })),
        );
      } catch (error) {
        if (!controller.signal.aborted && isMountedRef.current) {
          setRouteCoords([]);
        }
      } finally {
        if (isMountedRef.current) setIsFetchingRoute(false);
      }
    })();

    return () => controller.abort();
  }, [current.latitude, current.longitude, hasPermission]);

  const formattedStartTime = journeyStart
    ? new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(journeyStart)
    : "-";

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...(initialRegion || DESTINATION),
          ...DEFAULT_REGION_DELTA,
        }}
        showsUserLocation
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        <Marker coordinate={DESTINATION} title="Tujuan Demo" />
        <Marker coordinate={current} title="Posisi Kamu" pinColor="#1D4ED8" />

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="#2D8CFF"
          />
        )}
      </MapView>

      <BottomSheet snapPoints={snapPoints} enablePanDownToClose={false}>
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.routeRow}>
            <View>
              <Text style={styles.routeTitle}>Bandung → Jakarta</Text>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="navigate" size={16} color="#0F5132" />
              <Text style={styles.badgeText}>En Route</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#111827" />
              <Text style={styles.metaLabel}>{formattedDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="alarm-outline" size={16} color="#111827" />
              <Text style={styles.metaLabel}>{formattedStartTime} WIB</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posisi Kamu Saat Ini</Text>
            <Text style={styles.sectionValue}>{currentAddress}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Log</Text>
            <Text style={styles.sectionValue}>
              Perjalanan dimulai sejak {formattedStartTime} WIB
            </Text>
          </View>

          <View style={styles.vehicleCard}>
            <View style={styles.vehicleInfo}>
              <View style={styles.vehicleAvatar}>
                <Ionicons name="bus" size={24} color="#1F2937" />
              </View>
              <View>
                <Text style={styles.vehicleTitle}>Mitsubishi Fuso</Text>
                <Text style={styles.vehiclePlate}>AB 1234 CD</Text>
                <TouchableOpacity>
                  <Text style={styles.link}>Lihat Detail Kendaraan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={[styles.button, styles.primaryButton]}>
            <Text style={styles.primaryText}>Selesaikan Perjalanan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryText}>Masukkan Pengeluaran Perjalanan</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  map: { flex: 1 },
  sheetContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routeTitle: { fontWeight: "700", fontSize: 18, color: "#111827" },
  dateText: { color: "#6B7280", marginTop: 2 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1E7DD",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: { color: "#0F5132", fontWeight: "600", marginLeft: 6 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaLabel: { color: "#111827", fontSize: 14 },
  section: { gap: 4 },
  sectionTitle: { color: "#6B7280", fontSize: 12, textTransform: "uppercase" },
  sectionValue: { color: "#111827", fontSize: 14, fontWeight: "600" },
  vehicleCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
  },
  vehicleInfo: { flexDirection: "row", gap: 12, alignItems: "center" },
  vehicleAvatar: {
    width: 64,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  vehiclePlate: { color: "#6B7280", marginVertical: 2 },
  link: { color: "#2563EB", fontWeight: "600" },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButton: { backgroundColor: "#22C55E" },
  secondaryButton: { backgroundColor: "#E5E7EB" },
  primaryText: { color: "#FFFFFF", fontWeight: "700" },
  secondaryText: { color: "#111827", fontWeight: "700" },
});
