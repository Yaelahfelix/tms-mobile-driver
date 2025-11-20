import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const DocumentLink = ({
  title,
  description,
  onPress,
  disabled,
}: {
  title: string;
  description?: string;
  onPress?: () => void;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    disabled={disabled}
    className={`rounded-2xl border border-background-200 bg-white p-4 ${disabled ? "opacity-60" : ""}`}
  >
    <Box className="flex-row items-center justify-between">
      <VStack className="flex-1 gap-1 pr-3">
        <Text className="text-xs text-slate-500 uppercase">Dokumen</Text>
        <Heading size="lg">{title}</Heading>
        {description ? <Text className="text-slate-600">{description}</Text> : null}
      </VStack>
      <Box className="h-10 w-10 items-center justify-center rounded-full bg-primary-50">
        <Icon as={FontAwesome} name="chevron-right" size="md" className="text-primary-700" />
      </Box>
    </Box>
  </TouchableOpacity>
);

export default function Document() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Heading size="2xl" className="text-center">
          Dokumen
        </Heading>

        <DocumentLink
          title="Dokumen Perjalanan"
          description="Lihat riwayat dokumen dari setiap perjalanan Anda."
          onPress={() => router.push("/tabs/documentTrip")}
        />

        <DocumentLink
          title="Dokumen Umum"
          description="Segera hadir untuk menyimpan dokumen lainnya."
          disabled
        />
      </ScrollView>
    </SafeAreaView>
  );
}
