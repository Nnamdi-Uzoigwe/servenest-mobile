import { colors } from "@/theme";
import { Stack } from "expo-router";

export default function GuestLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white },
      }}
    />
  );
}
