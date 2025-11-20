import React from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TripCard from "@/components/Card/TripCard";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const trips = [
  {
    date: "24 Agustus 2025",
    items: [
      {
        from: "Bandung",
        to: "Jakarta",
        date: "24 Agustus 2025",
        time: "09:30 WIB",
        status: "Selesai",
        image:
          "https://images.unsplash.com/photo-1549049950-48d5887197af?auto=format&fit=crop&w=600&q=80",
      },
      {
        from: "Cikarang",
        to: "Bekasi",
        date: "24 Agustus 2025",
        time: "09:30 WIB",
        status: "Selesai",
        image:
          "https://images.unsplash.com/photo-1502877828070-33ce180772ae?auto=format&fit=crop&w=600&q=80",
      },
      {
        from: "Surabaya",
        to: "Madiun",
        date: "24 Agustus 2025",
        time: "09:30 WIB",
        status: "Selesai",
        image:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    date: "22 Agustus 2024",
    items: [
      {
        from: "Bandung",
        to: "Jakarta",
        date: "22 Agustus 2024",
        time: "09:30 WIB",
        status: "Selesai",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
      },
      {
        from: "Cikarang",
        to: "Bekasi",
        date: "22 Agustus 2024",
        time: "09:30 WIB",
        status: "Selesai",
        image:
          "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
];

export default function DocumentTrip() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 32 }}>
        <Heading size="2xl" className="text-center">
          Dokumen Perjalanan
        </Heading>

        <VStack className="gap-6">
          {trips.map((group) => (
            <VStack key={group.date} className="gap-3">
              <Text className="text-sm text-slate-500">{group.date}</Text>
              <VStack className="gap-3">
                {group.items.map((trip, index) => (
                  <TripCard
                    key={`${group.date}-${index}`}
                    {...trip}
                    onPress={() => router.push("/tabs/documentTripDetail")}
                  />
                ))}
              </VStack>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
