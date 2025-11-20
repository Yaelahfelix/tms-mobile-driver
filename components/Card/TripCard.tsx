import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, TouchableOpacity, View } from "react-native";

import { Box } from "../ui/box";
import { Heading } from "../ui/heading";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";

type TripCardProps = {
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  status?: string;
  image?: string;
  onPress?: () => void;
};

const statusStyles: Record<
  string,
  { container: string; text: string }
> = {
  Pending: {
    container: "border-amber-200 bg-amber-100",
    text: "text-amber-800",
  },
  Selesai: {
    container: "border-emerald-200 bg-emerald-50",
    text: "text-emerald-700",
  },
};

export default function TripCard({
  from = "Bandung",
  to = "Jakarta",
  date = "24 Agustus 2025",
  time = "09:30 WIB",
  status = "Pending",
  image = "https://images.unsplash.com/photo-1519648023493-d82b5f8d7fd0?auto=format&fit=crop&w=320&q=80",
  onPress,
}: TripCardProps) {
  const statusStyle = statusStyles[status] ?? statusStyles.Pending;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
      onPress={onPress}
      className="rounded-2xl border border-background-200 bg-white p-4"
    >
      <View className="flex-row items-start gap-3">
        <View className="flex-1 gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Heading size="md">{from}</Heading>
              <Icon
                as={FontAwesome}
                name="long-arrow-right"
                size="md"
                className="text-slate-500"
              />
              <Heading size="md">{to}</Heading>
            </View>

            <Box
              className={`rounded-full border px-3 py-1 ${statusStyle.container}`}
            >
              <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                {status}
              </Text>
            </Box>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-2">
              <Icon
                as={FontAwesome}
                name="calendar"
                size="xs"
                className="text-slate-500"
              />
              <Text className="text-slate-600">{date}</Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Icon
                as={FontAwesome}
                name="clock-o"
                size="xs"
                className="text-slate-500"
              />
              <Text className="text-slate-600">{time}</Text>
            </View>
          </View>
        </View>

        <Image
          source={{ uri: image }}
          className="h-20 w-20 rounded-xl bg-slate-100"
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
}
