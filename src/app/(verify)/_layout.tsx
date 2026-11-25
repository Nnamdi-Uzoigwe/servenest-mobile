import { colors } from "@/theme";
import { Stack } from "expo-router";

export default function VerifyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    />
  );
}
