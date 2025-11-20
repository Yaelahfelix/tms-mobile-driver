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

const ActionButton = ({
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
    className="flex-1 bg-white rounded-xl p-4 border border-background-100 active:opacity-80"
  >
    <HStack className="items-center gap-3">
      <Box className="bg-primary-100 w-11 h-11 rounded-2xl items-center justify-center">
        <FontAwesome name={icon} size={18} color="#1d4ed8" />
      </Box>
      <Text className="font-semibold text-base">{label}</Text>
    </HStack>
  </TouchableOpacity>
);

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-200">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
        <Box className="bg-primary-500 rounded-2xl p-5 shadow-sm">
          <Text className="text-white text-sm">Selamat datang kembali</Text>
          <Heading size="xl" className="text-white mt-1">
            Mulai perjalanan dengan tenang
          </Heading>
          <Text className="text-white/90 mt-3">
            Lihat tugas aktif dan akses fitur penting langsung dari beranda.
          </Text>
          <HStack className="mt-4" space="md">
            <Button onPress={() => router.push("/tabs/tripDetail")}> 
              <ButtonText>Lanjutkan tugas</ButtonText>
            </Button>
            <Button
              variant="outline"
              className="border-white/70"
              onPress={() => router.push("/tabs/(tabs)/profil")}
            >
              <ButtonText className="text-white">Profil</ButtonText>
            </Button>
          </HStack>
        </Box>

        <Box className="bg-white rounded-2xl p-4 shadow-sm border border-background-100">
          <HStack className="items-center justify-between mb-2">
            <Heading size="lg">Perjalanan aktif</Heading>
            <Text className="text-primary-500" onPress={() => router.push("/tabs/tripDetail")}>Detail</Text>
          </HStack>
          <Text className="text-slate-500">Bandung → Jakarta</Text>
          <Text className="font-semibold mt-1">Muat 09:30 • Est. tiba 13:00</Text>
          <HStack className="items-center gap-2 mt-3">
            <Icon as={FontAwesome} name="truck" />
            <Text className="text-slate-600">Unit: AB1234CD</Text>
          </HStack>
        </Box>

        <VStack className="gap-3">
          <Heading size="lg">Akses cepat</Heading>
          <HStack className="gap-3">
            <ActionButton
              label="Peta"
              icon="map-marker"
              onPress={() => router.push("/tabs/map")}
            />
            <ActionButton
              label="Dokumen"
              icon="file-text"
              onPress={() => router.push("/tabs/document")}
            />
          </HStack>
          <HStack className="gap-3">
            <ActionButton
              label="Perjalanan"
              icon="list-alt"
              onPress={() => router.push("/tabs/trip")}
            />
            <ActionButton
              label="Profil"
              icon="user"
              onPress={() => router.push("/tabs/(tabs)/profil")}
            />
          </HStack>
        </VStack>

        <Box className="bg-white rounded-2xl p-4 border border-background-100">
          <Heading size="lg">Perjalanan berikutnya</Heading>
          <Text className="text-slate-500 mt-1">Berangkat 14:00 • Depo Cikarang → KIIC</Text>
          <Button className="mt-3" variant="outline" onPress={() => router.push("/tabs/trip") }>
            <ButtonText>Lihat jadwal</ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
