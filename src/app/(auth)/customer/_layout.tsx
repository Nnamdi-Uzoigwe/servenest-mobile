import { Stack } from "expo-router";

// Booking and service detail screens will be pushed on top of the tabs in Phase 2
export default function CustomerLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
