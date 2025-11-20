import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export default function VehicleCard() {
  return (
    <Card size="lg" variant="elevated">
      <Box className="flex-row gap-5 items-center ">
        <Box className="w-4/12 h-20 bg-red-200 rounded-lg"></Box>
        <VStack space="sm" className="w-8/12">
          <VStack>
            <Heading size="md">Mitsubishi Fusho</Heading>
            <Text size="sm">AB 1234 AD1</Text>
          </VStack>
          <HStack className="justify-between pr-5 items-center">
            <Text size="sm">Lihat Detail Kendaraan</Text>
            <FontAwesome name="caret-right" size={10} />
          </HStack>
        </VStack>
      </Box>
    </Card>
  );
}
