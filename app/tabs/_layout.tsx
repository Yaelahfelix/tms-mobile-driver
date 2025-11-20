export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="expensesInput" options={{ headerShown: true }} />
      <Stack.Screen name="tripDetail" options={{ headerShown: true }} />
      <Stack.Screen name="documentTrip" options={{ title: "Dokumen Perjalanan" }} />
      <Stack.Screen name="documentTripDetail" options={{ title: "Detail Dokumen" }} />
      <Stack.Screen name="deliveryProof" options={{ title: "Dokumen Bukti Pengantaran" }} />
    </Stack>
  );
}
