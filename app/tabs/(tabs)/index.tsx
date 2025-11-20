import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const QuickAction = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-1 flex-row items-center gap-3 rounded-xl border border-background-200 px-4 py-3 active:opacity-80"
  >
    <Box className="bg-primary-100 w-10 h-10 rounded-2xl items-center justify-center">
      <FontAwesome name={icon} size={16} color="#1d4ed8" />
    </Box>
    <Text className="font-semibold text-base text-slate-800">{label}</Text>
  </TouchableOpacity>
);

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 32 }}>
        <VStack className="gap-2">
          <Text className="text-slate-500 text-sm">Halo, pengemudi</Text>
          <Heading size="2xl">Perjalanan hari ini</Heading>
          <Text className="text-slate-600">
            Lanjutkan tugas aktif dan akses fitur utama tanpa harus membuka banyak menu.
          </Text>
        </VStack>

        <Box className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
          <HStack className="items-center justify-between">
            <Text className="text-primary-700 font-semibold">Perjalanan aktif</Text>
            <Button
              size="sm"
              variant="outline"
              className="border-primary-200"
              onPress={() => router.push("/tabs/tripDetail")}
            >
              <ButtonText className="text-primary-700">Detail</ButtonText>
            </Button>
          </HStack>
          <VStack className="mt-3 gap-2">
            <Heading size="lg">Bandung → Jakarta</Heading>
            <Text className="text-slate-700">Muat 09:30 • Estimasi tiba 13:00</Text>
            <HStack className="items-center gap-2 pt-1">
              <Icon as={FontAwesome} name="truck" />
              <Text className="text-slate-700">Unit: AB1234CD</Text>
            </HStack>
          </VStack>
          <Button className="mt-4" onPress={() => router.push("/tabs/tripDetail")}>
            <ButtonText>Lanjutkan perjalanan</ButtonText>
          </Button>
        </Box>

        <VStack className="gap-3">
          <Heading size="lg">Akses cepat</Heading>
          <HStack className="gap-3">
            <QuickAction label="Peta" icon="map-marker" onPress={() => router.push("/tabs/map")} />
            <QuickAction
              label="Dokumen"
              icon="file-text"
              onPress={() => router.push("/tabs/document")}
            />
          </HStack>
          <HStack className="gap-3">
            <QuickAction label="Perjalanan" icon="list-alt" onPress={() => router.push("/tabs/trip")} />
            <QuickAction label="Profil" icon="user" onPress={() => router.push("/tabs/(tabs)/profil")} />
          </HStack>
        </VStack>

        <VStack className="gap-3">
          <HStack className="items-center justify-between">
            <Heading size="lg">Agenda berikutnya</Heading>
            <Text className="text-primary-600" onPress={() => router.push("/tabs/trip")}>
              Lihat semua
            </Text>
          </HStack>
          <Box className="rounded-2xl border border-background-200 bg-white p-4 gap-3">
            <HStack className="items-center justify-between">
              <Text className="text-slate-500">14:00</Text>
              <Text className="text-slate-600">Depo Cikarang → KIIC</Text>
            </HStack>
            <HStack className="items-center justify-between">
              <Text className="text-slate-500">17:30</Text>
              <Text className="text-slate-600">KIIC → Gudang Timur</Text>
            </HStack>
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
