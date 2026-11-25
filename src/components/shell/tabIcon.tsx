import { Ionicons } from "@expo/vector-icons";
import type { ColorValue } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

export const tabIcon =
  (active: IconName, inactive: IconName) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} size={22} color={color} />
  );
