import EditScreenInfo from "@/components/EditScreenInfo";
import MapScreen from "@/components/MapView";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { StyleSheet, View } from "react-native";
import Mapbox, { MapView } from "@rnmapbox/maps";
import { useCallback, useMemo, useRef, useState } from "react";
import { SwipeablePanel } from "rn-swipeable-panel";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import TripCard from "@/components/Card/TripCard";
import { Button, ButtonText } from "@/components/ui/button";
import { BottomSheetFlatList } from "@/components/ui/bottomsheet";
import { router } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { MapboxToken } from "@/constants/Mapbox";

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {},
  map: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default function Tab2() {
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    [],
  );
  const snapPoints = useMemo(() => ["20%", "80%"], []);

  return (
    <View style={styles.page}>
      <View className="w-full h-full bg-red-500">
        <MapView style={styles.map} />
      </View>
      {/*
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />*/}
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      >
        <BottomSheetView className="m-3">
          <TripCard />
          <VStack>
            <Text>Status Perjalanan</Text>
            <Button onPress={() => router.push("/tabs/expensesInput")}>
              <ButtonText>Pengeluaran Perjalanan</ButtonText>
            </Button>
          </VStack>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
