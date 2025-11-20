import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import * as Location from "expo-location";

const JAKARTA = { latitude: -6.21462, longitude: 106.84513 };

export default function MapScreen() {
  const [me, setMe] = useState(JAKARTA);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      // pos awal
      const cur = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setMe({ latitude: cur.coords.latitude, longitude: cur.coords.longitude });

      // realtime
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          setMe({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        },
      );
    })();
    return () => watchRef.current?.remove();
  }, []);

  // Contoh ambil rute OSRM dari posisi saya ke Monas
  useEffect(() => {
    (async () => {
      const start = [me.longitude, me.latitude]; // [lon, lat]
      const end = [106.8272, -6.1754]; // Monas [lon, lat]
      const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        const coords: [number, number][] =
          json?.routes?.[0]?.geometry?.coordinates || [];
        setRouteCoords(
          coords.map(([lon, lat]) => ({ latitude: lat, longitude: lon })),
        );
      } catch {}
    })();
  }, [me.latitude, me.longitude]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...JAKARTA,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* OSM tiles (gratis, tanpa API key) */}
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {/* Garis rute OSRM */}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={4} />
        )}

        {/* Posisi driver */}
        <Marker coordinate={me} title="Saya" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 }, map: { flex: 1 } });
