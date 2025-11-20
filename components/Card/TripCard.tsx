import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";

export default function TripCard(){
  return (
    <Card size="md" variant="elevated">
      <HStack className="justify-between">

      <HStack space="2xl">
        <Heading size="md">Bandung</Heading>
        <Heading size="md">-></Heading>
        <Heading size="md">Jakarta</Heading>
      </HStack>

      <Box className="bg-primary-100 items-center justify-center px-3 rounded-2xl">
        <Text size="sm">Pending</Text>
      </Box>
      </HStack>
      <Text size="sm">Start building your next project in minutes</Text>
    </Card>
  )
}
