import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function DocumentTripDetail() {
  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <Heading size="2xl" className="text-center">
          Dokumen Perjalanan
        </Heading>

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
          }}
          className="h-48 w-full rounded-2xl"
          resizeMode="cover"
        />

        <VStack className="gap-4 rounded-2xl border border-background-200 bg-white p-4">
          <HStack className="items-center justify-between">
            <Heading size="lg">Bandung</Heading>
            <Icon as={FontAwesome} name="long-arrow-right" size="md" className="text-slate-500" />
            <Heading size="lg">Jakarta</Heading>
          </HStack>

          <VStack className="gap-2">
            <HStack className="items-center justify-between">
              <Text className="text-slate-600">Mulai</Text>
              <Text className="font-semibold text-slate-800">24 Agustus 2025</Text>
              <HStack className="items-center gap-2">
                <Icon as={FontAwesome} name="clock-o" size="xs" className="text-slate-500" />
                <Text className="text-slate-700">09:30 WIB</Text>
              </HStack>
            </HStack>
            <HStack className="items-center justify-between">
              <Text className="text-slate-600">Selesai</Text>
              <Text className="font-semibold text-slate-800">24 Agustus 2025</Text>
              <HStack className="items-center gap-2">
                <Icon as={FontAwesome} name="clock-o" size="xs" className="text-slate-500" />
                <Text className="text-slate-700">16:30 WIB</Text>
              </HStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack className="gap-3">
          <Button
            variant="outline"
            className="border-background-200 bg-white"
            onPress={() => router.push("/tabs/deliveryProof")}
          >
            <ButtonText className="text-slate-800">Lihat Bukti Pengantaran</ButtonText>
          </Button>
          <Button variant="outline" className="border-background-200 bg-white">
            <ButtonText className="text-slate-800">Lihat Foto Perjalanan</ButtonText>
          </Button>
          <Button variant="outline" className="border-background-200 bg-white">
            <ButtonText className="text-slate-800">Lihat History GPS</ButtonText>
          </Button>
          <Button variant="outline" className="border-background-200 bg-white">
            <ButtonText className="text-slate-800">Lihat Surat Jalan</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
