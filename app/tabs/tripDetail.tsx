import TripCard from "@/components/Card/TripCard";
import VehicleCard from "@/components/Card/VehicleCard";
import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { MapView } from "@rnmapbox/maps";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  page: {
    flex: 1,
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
  return (
    <View style={styles.page}>
      <View className="flex-1">
        <MapView style={styles.map} />
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
