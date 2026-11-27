import { colors } from "@/theme";
import { Stack } from "expo-router";

export default function CatalogLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white },
      }}
    />
  );
}
