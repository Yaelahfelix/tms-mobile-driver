import { useMemo } from "react";
import TripCard from "@/components/Card/TripCard";
import VehicleCard from "@/components/Card/VehicleCard";
import { View } from "@/components/Themed";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import Mapbox, {
  Camera,
  LineLayer,
  MapView as MapboxMap,
  PointAnnotation,
  ShapeSource,
} from "@rnmapbox/maps";
import { ScrollView, StyleSheet } from "react-native";
import type { FeatureCollection, LineString } from "geojson";

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  mapContainer: {
    height: 360,
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    gap: 10,
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routeSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  pill: {
    backgroundColor: "#EEF2FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badge: {
    backgroundColor: "#1E88E5",
    color: "white",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: "600",
    fontSize: 12,
  },
});

export default function Tab2() {
  const routeGeoJson: FeatureCollection<LineString> = useMemo(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [107.6098, -6.9147],
              [107.428, -6.87],
              [107.214, -6.78],
              [107.05, -6.65],
              [106.95, -6.5],
              [106.88, -6.37],
              [106.84, -6.25],
              [106.8272, -6.1754],
            ],
          },
          properties: {},
        },
      ],
    }),
    [],
  );

  return (
    <View style={styles.page}>
      <View style={styles.mapContainer}>
        <MapboxMap
          style={styles.map}
          styleURL={Mapbox.StyleURL.Street}
          logoEnabled={false}
          compassEnabled={false}
        >
          <Camera centerCoordinate={[107.6098, -6.9147]} zoomLevel={10} />
          <ShapeSource id="trip-route" shape={routeGeoJson}>
            <LineLayer
              id="trip-route-line"
              style={{ lineColor: "#1E88E5", lineWidth: 4, lineCap: "round" }}
            />
          </ShapeSource>
          <PointAnnotation id="start" coordinate={[107.6098, -6.9147]}>
            <View className="rounded-full bg-green-500 p-2">
              <Text className="text-xs font-semibold text-white">Start</Text>
            </View>
          </PointAnnotation>
          <PointAnnotation id="end" coordinate={[106.8272, -6.1754]}>
            <View className="rounded-full bg-red-500 p-2">
              <Text className="text-xs font-semibold text-white">Finish</Text>
            </View>
          </PointAnnotation>
        </MapboxMap>

        <View style={styles.mapOverlay}>
          <View style={styles.mapHeader}>
            <Heading size="md">Rute Perjalanan</Heading>
            <Text style={styles.badge}>Aktif</Text>
          </View>

          <View style={styles.routeSummary}>
            <View className="flex-1">
              <Text className="text-xs text-slate-500">Mulai</Text>
              <Text className="font-semibold text-slate-800">Bandung</Text>
              <View style={styles.pill}>
                <Text className="text-xs font-medium text-indigo-700">07:45 WIB</Text>
              </View>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-xs text-slate-500">Estimasi</Text>
              <Text className="font-semibold text-slate-800">4 jam 30 mnt</Text>
              <Text className="text-xs text-slate-500">270 km</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-xs text-slate-500">Tujuan</Text>
              <Text className="font-semibold text-slate-800">Jakarta</Text>
              <View style={styles.pill}>
                <Text className="text-xs font-medium text-indigo-700">12:15 WIB</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Box className="">
        <ScrollView className="m-5 max-h-[70vh]">
          <VStack space="sm">
            <TripCard />
            <VehicleCard />

            <Button>
              <ButtonText>Mulai Perjalanan</ButtonText>
            </Button>

            <Button variant="outline">
              <ButtonText>Lihat Surat Jalan</ButtonText>
            </Button>
          </VStack>
        </ScrollView>
      </Box>
    </View>
  );
}
