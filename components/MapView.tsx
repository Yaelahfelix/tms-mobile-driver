import React, { useEffect, useMemo, useRef, useState } from "react";
import Mapbox, {
  Camera,
  CameraRef,
  LineLayer,
  MapView as MapboxMap,
  PointAnnotation,
  ShapeSource,
  UserLocation,
} from "@rnmapbox/maps";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import type { FeatureCollection, LineString } from "geojson";

const DESTINATION = {
  latitude: -6.1754,
  longitude: 106.8272,
};

const DEFAULT_ZOOM_LEVEL = 14;

const routeLineStyle = {
  lineColor: "#2196F3",
  lineWidth: 4,
  lineCap: "round" as const,
  lineJoin: "round" as const,
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
  const cameraRef = useRef<CameraRef | null>(null);
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
  const [initialCenter, setInitialCenter] = useState<Coordinate | null>(null);
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
      setInitialCenter(initialCoordinate);
      cameraRef.current?.setCamera({
        centerCoordinate: [
          initialCoordinate.longitude,
          initialCoordinate.latitude,
        ],
        zoomLevel: DEFAULT_ZOOM_LEVEL,
        animationDuration: 800,
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
          cameraRef.current?.setCamera({
            centerCoordinate: [filtered.longitude, filtered.latitude],
            zoomLevel: DEFAULT_ZOOM_LEVEL,
            animationDuration: 800,
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
        if (!cancelled)
          setCurrentAddress(
            `Lat ${current.latitude.toFixed(4)}, Lon ${current.longitude.toFixed(4)}`,
          );
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

  const routeGeoJson: FeatureCollection<LineString> = useMemo(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: routeCoords.map((c) => [c.longitude, c.latitude]),
          },
          properties: {},
        },
      ],
    }),
    [routeCoords],
  );

  const formattedStartTime = journeyStart
    ? new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(journeyStart)
    : "--:--";

  return (
      <View style={styles.container}>
        <MapboxMap
          style={styles.map}
          styleURL={Mapbox.StyleURL.Street}
          compassEnabled={false}
        logoEnabled={false}
        scaleBarEnabled={false}
      >
        {initialCenter && (
          <Camera
            ref={cameraRef}
            centerCoordinate={[initialCenter.longitude, initialCenter.latitude]}
            zoomLevel={DEFAULT_ZOOM_LEVEL}
            animationDuration={0}
          />
        )}
        <UserLocation
          androidRenderMode="gps"
          showsUserHeadingIndicator
          animated
          minDisplacement={1}
        />
        {routeCoords.length > 0 && (
          <ShapeSource id="route" shape={routeGeoJson}>
            <LineLayer id="routeLine" style={routeLineStyle} />
          </ShapeSource>
        )}
        <PointAnnotation
          id="destination"
          coordinate={[DESTINATION.longitude, DESTINATION.latitude]}
        >
          <View style={styles.destinationMarker}>
            <Ionicons name="flag" size={16} color="white" />
          </View>
        </PointAnnotation>
      </MapboxMap>

      <BottomSheet index={0} snapPoints={snapPoints} enablePanDownToClose={false}>
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.sectionLabel}>Perjalanan dimulai</Text>
              <Text style={styles.sectionValue}>{formattedStartTime}</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Perjalanan Berlangsung</Text>
            </View>
          </View>

          <View style={styles.locationCard}>
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Posisi Saat Ini</Text>
              <Text style={styles.locationValue}>{currentAddress}</Text>
            </View>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="map" size={20} color="#1E88E5" />
              <Text style={styles.mapButtonText}>Buka Maps</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.destinationCard}>
            <View style={styles.destinationIconWrapper}>
              <Ionicons name="flag" size={20} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.destinationRow}>
                <Text style={styles.destinationLabel}>Tujuan</Text>
                <Text style={styles.destinationEta}>ETA 22 menit</Text>
              </View>
              <Text style={styles.destinationValue}>Monumen Nasional, Jakarta</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Jarak</Text>
              <Text style={styles.metaValue}>{routeCoords.length} titik</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Kecepatan rata-rata</Text>
              <Text style={styles.metaValue}>- km/h</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Estimasi tiba</Text>
              <Text style={styles.metaValue}>-</Text>
            </View>
          </View>

          <View style={styles.timeline}>
            <View style={styles.timelineRow}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineText}>Kendaraan: B 1234 AA (20 A)</Text>
            </View>
            <View style={styles.timelineRow}>
              <View style={[styles.timelineDot, styles.timelineDotActive]} />
              <Text style={styles.timelineText}>Sampai di hub penjemputan</Text>
            </View>
            <View style={styles.timelineRow}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineText}>Sedang dalam perjalanan</Text>
            </View>
            <View style={styles.timelineRow}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineText}>Tiba di tujuan</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
              <Text style={styles.actionText}>Batalkan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.completeButton]}>
              <Text style={[styles.actionText, { color: "#FFFFFF" }]}>Selesaikan</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },
  map: {
    flex: 1,
  },
  destinationMarker: {
    backgroundColor: "#1E88E5",
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f2ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1E88E5",
    marginRight: 8,
  },
  statusText: {
    color: "#1E88E5",
    fontWeight: "600",
  },
  locationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  locationText: {
    flex: 1,
    marginRight: 12,
  },
  locationLabel: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 4,
  },
  locationValue: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#e8f2ff",
  },
  mapButtonText: {
    color: "#1E88E5",
    fontWeight: "700",
    marginLeft: 6,
  },
  destinationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  destinationIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E88E5",
    justifyContent: "center",
    alignItems: "center",
  },
  destinationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  destinationLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
  },
  destinationEta: {
    color: "#111827",
    fontWeight: "700",
  },
  destinationValue: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metaCol: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  metaLabel: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 4,
  },
  metaValue: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  timeline: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  timelineDotActive: {
    borderColor: "#1E88E5",
    backgroundColor: "#1E88E5",
  },
  timelineText: {
    color: "#111827",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cancelButton: {
    backgroundColor: "#ffffff",
  },
  completeButton: {
    backgroundColor: "#1E88E5",
    borderColor: "#1E88E5",
  },
  actionText: {
    color: "#111827",
    fontWeight: "700",
  },
});
