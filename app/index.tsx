import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

import VehicleCard from "@/components/Card/VehicleCard";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

type QuickAction = {
  label: string;
  description: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  onPress: () => void;
};

type UpcomingTrip = {
  id: string;
  origin: string;
  destination: string;
  schedule: string;
  status: string;
};

const SectionCard = ({
  title,
  children,
  actionText,
  onAction,
}: {
  title: string;
  children: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}) => (
  <Box className="bg-white rounded-2xl p-4 shadow-sm border border-background-100">
    <HStack className="items-center justify-between mb-3">
      <Heading size="lg">{title}</Heading>
      {actionText && onAction ? (
        <TouchableOpacity onPress={onAction}>
          <Text className="text-primary-500 font-medium">{actionText}</Text>
        </TouchableOpacity>
      ) : null}
    </HStack>
    {children}
  </Box>
);

export default function Home() {
  const router = useRouter();

  const quickActions: QuickAction[] = [
    {
      label: "Mulai perjalanan",
      description: "Lanjutkan tugas aktif dan buka detail rute",
      icon: "play",
      onPress: () => router.push("/tabs/tripDetail"),
    },
    {
      label: "Buka peta langsung",
      description: "Pantau posisi dan titik muat/antar",
      icon: "map-marker",
      onPress: () => router.push("/tabs/map"),
    },
    {
      label: "Dokumen",
      description: "Upload surat jalan atau bukti muat",
      icon: "file-text",
      onPress: () => router.push("/tabs/document"),
    },
  ];

  const upcomingTrips: UpcomingTrip[] = [
    {
      id: "next-1",
      origin: "Gudang Bandung",
      destination: "Pelabuhan Tanjung Priok",
      schedule: "Berangkat 10:30",
      status: "Siap dimuat",
    },
    {
      id: "next-2",
      origin: "Depo Cikarang",
      destination: "Kawasan Industri KIIC",
      schedule: "Berangkat 14:00",
      status: "Menunggu konfirmasi",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-300">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack className="px-5 pt-4 gap-4">
          <Box className="bg-primary-500 rounded-3xl p-5 shadow-sm">
            <Text className="text-white text-base">Selamat datang, Pengemudi</Text>
            <Heading className="text-white mt-1" size="2xl">
              Perjalanan hari ini siap dimulai
            </Heading>
            <Text className="text-white/90 mt-2">
              Pantau status tugas, dokumen, dan detail kendaraan langsung dari
              beranda.
            </Text>
            <HStack className="mt-4" space="sm">
              <Button
                className="bg-white"
                onPress={() => router.push("/tabs/tripDetail")}
              >
                <ButtonText className="text-primary-500">
                  Lihat perjalanan aktif
                </ButtonText>
              </Button>
              <Button
                variant="link"
                onPress={() => router.push("/tabs/(tabs)/profil")}
              >
                <ButtonText className="text-white">Lihat profil</ButtonText>
              </Button>
            </HStack>
          </Box>

          <SectionCard title="Perjalanan aktif">
            <VStack className="gap-3">
              <HStack className="items-center justify-between">
                <VStack className="flex-1">
                  <Text className="text-sm text-slate-500">Rute</Text>
                  <Heading size="lg">Bandung → Jakarta</Heading>
                  <Text className="text-slate-500 mt-1">
                    Muat 09:30 • Est. tiba 13:00
                  </Text>
                </VStack>
                <Box className="bg-amber-100 px-3 py-1 rounded-full">
                  <Text className="text-amber-700 font-medium">Persiapan</Text>
                </Box>
              </HStack>

              <HStack className="gap-3">
                <Box className="flex-1 bg-background-100 p-3 rounded-xl">
                  <HStack className="items-center gap-2">
                    <Icon as={FontAwesome} name="truck" />
                    <VStack>
                      <Text className="text-sm text-slate-500">Unit</Text>
                      <Text className="font-medium">Mitsubishi Fuso • AB1234CD</Text>
                    </VStack>
                  </HStack>
                </Box>
                <Box className="flex-1 bg-background-100 p-3 rounded-xl">
                  <HStack className="items-center gap-2">
                    <Icon as={FontAwesome} name="file-text" />
                    <VStack>
                      <Text className="text-sm text-slate-500">Dokumen</Text>
                      <Text className="font-medium">Surat jalan siap</Text>
                    </VStack>
                  </HStack>
                </Box>
              </HStack>

              <HStack className="gap-3">
                <Button className="flex-1" onPress={() => router.push("/tabs/map")}>
                  <ButtonText>Buka peta</ButtonText>
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onPress={() => router.push("/tabs/tripDetail")}
                >
                  <ButtonText>Detail perjalanan</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </SectionCard>

          <SectionCard title="Akses cepat">
            <VStack className="gap-3">
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  onPress={action.onPress}
                  className="active:opacity-80"
                >
                  <HStack className="items-center gap-3 bg-background-100 p-3 rounded-2xl">
                    <Box className="bg-primary-100 w-12 h-12 rounded-2xl items-center justify-center">
                      <FontAwesome name={action.icon} size={20} color="#1d4ed8" />
                    </Box>
                    <VStack className="flex-1">
                      <Text className="font-semibold text-base">{action.label}</Text>
                      <Text className="text-slate-500 text-sm">{action.description}</Text>
                    </VStack>
                    <FontAwesome name="angle-right" size={18} color="#94a3b8" />
                  </HStack>
                </TouchableOpacity>
              ))}
            </VStack>
          </SectionCard>

          <SectionCard title="Kendaraan">
            <VehicleCard />
          </SectionCard>

          <SectionCard
            title="Perjalanan berikutnya"
            actionText="Lihat semua"
            onAction={() => router.push("/tabs/trip")}
          >
            <VStack className="gap-3">
              {upcomingTrips.map((trip) => (
                <Box
                  key={trip.id}
                  className="border border-background-100 p-3 rounded-2xl bg-background-0/60"
                >
                  <HStack className="items-center justify-between">
                    <VStack className="flex-1 pr-2 gap-1">
                      <Text className="text-sm text-slate-500">{trip.schedule}</Text>
                      <Heading size="md">{trip.origin} → {trip.destination}</Heading>
                      <Text className="text-slate-500">{trip.status}</Text>
                    </VStack>
                    <Button
                      size="sm"
                      onPress={() => router.push("/tabs/tripDetail")}
                    >
                      <ButtonText>Detail</ButtonText>
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </SectionCard>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
