import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/lib/auth";
import { router } from "expo-router";

const MenuButton = ({
  title,
  variant = "default",
  onPress,
}: {
  title: string;
  variant?: "default" | "danger";
  onPress?: () => void;
}) => {
  const isDanger = variant === "danger";
  return (
    <Button
      variant="outline"
      action={isDanger ? "negative" : "primary"}
      className={`w-full ${isDanger ? "border-red-500" : "border-gray-300"}`}
      onPress={onPress}
    >
      <ButtonText className={isDanger ? "text-red-500" : "text-gray-800"}>
        {title}
      </ButtonText>
    </Button>
  );
};

export default function Profile() {
  const { user, lastLogin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/tabs/auth/login");
  };

  const formattedLogin = lastLogin
    ? new Date(lastLogin).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <SafeAreaView className="flex-1 px-6 bg-white">
      <VStack className="flex-1 justify-between py-8">
        <VStack className="items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-gray-300 items-center justify-center">
            <Text className="text-lg font-bold text-white">
              {user?.name
                ?.split(" ")
                .map((part) => part[0])
                .join("") || "JD"}
            </Text>
          </View>
          <VStack className="items-center">
            <Text className="text-lg font-semibold">
              Hai, {user?.name || "Pengguna"}
            </Text>
            <Text className="text-gray-500">
              Login terakhir: {formattedLogin} WIB
            </Text>
          </VStack>
        </VStack>

        <VStack className="gap-3">
          <MenuButton title="Pengaturan" />
          <MenuButton title="Notification" />
          <MenuButton title="History" />
          <MenuButton title="Log Out" variant="danger" onPress={handleLogout} />
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
