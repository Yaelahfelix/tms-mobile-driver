import TripCard from "@/components/Card/TripCard";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tab2() {
  return (
    <SafeAreaView className="mx-5">
      <VStack className="gap-5 my-5">
        <Heading size="2xl" className="mb-1">
          Tugas Perjalanan
        </Heading>
        <HStack className="justify-between">
          <Text>Filter</Text>
          <Text>H</Text>
        </HStack>
        <Input className="bg-white">
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder="Cari perjalanan..." />
        </Input>
      </VStack>

      <TouchableOpacity onPress={() => router.push("/tabs/tripDetail")}>
        <TripCard />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
