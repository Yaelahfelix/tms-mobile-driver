import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <HStack className="items-center justify-between py-1">
    <Text className="text-slate-600">{label}</Text>
    <Text className="font-semibold text-slate-800">{value}</Text>
  </HStack>
);

export default function DeliveryProof() {
  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 32 }}>
        <Heading size="2xl" className="text-center">
          Dokumen Bukti Pengantaran
        </Heading>

        <VStack className="gap-4 rounded-2xl border border-background-200 bg-white p-4">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
            }}
            className="h-52 w-full rounded-2xl"
            resizeMode="cover"
          />

          <VStack className="gap-3">
            <Heading size="lg">Nama Barang</Heading>
            <DetailRow label="Nama Customer" value="Alan *****" />
            <DetailRow label="Tanggal" value="14/04/2025" />
            <DetailRow label="Capacity" value="10 Kg" />
            <Text className="text-slate-600">Rating</Text>
            <HStack className="items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  as={FontAwesome}
                  name={star <= 4 ? "star" : "star-o"}
                  size="sm"
                  className="text-amber-400"
                />
              ))}
            </HStack>
          </VStack>

          <Box className="rounded-xl bg-background-100 p-3">
            <Text className="text-slate-700">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </Text>
          </Box>
        </VStack>

        <Button onPress={() => router.back()}>
          <ButtonText>Keluar</ButtonText>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
