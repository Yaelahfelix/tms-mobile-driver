import TripCard from "@/components/Card/TripCard";
import { Heading } from "@/components/ui/heading";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const trips = [
  {
    from: "Bandung",
    to: "Jakarta",
    date: "24 Agustus 2025",
    time: "09:30 WIB",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1549049950-48d5887197af?auto=format&fit=crop&w=600&q=80",
  },
  {
    from: "Cikarang",
    to: "Bekasi",
    date: "24 Agustus 2025",
    time: "09:30 WIB",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1502877828070-33ce180772ae?auto=format&fit=crop&w=600&q=80",
  },
  {
    from: "Surabaya",
    to: "Madiun",
    date: "24 Agustus 2025",
    time: "09:30 WIB",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Tab2() {
  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 28 }}
      >
        <VStack className="gap-4">
          <Heading size="2xl">Tugas Perjalanan</Heading>

          <Input className="bg-white">
            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField placeholder="Cari Perjalanan" />
          </Input>

          <Text className="text-slate-500">Filter</Text>
        </VStack>

        <VStack className="gap-3">
          {trips.map((trip, index) => (
            <TripCard
              key={`${trip.from}-${trip.to}-${index}`}
              {...trip}
              onPress={() => router.push("/tabs/tripDetail")}
            />
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
