import { colors, radius } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.canGoBack() ? router.back() : router.replace("/welcome")
      }
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name="chevron-back" size={22} color={colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.champagne,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { backgroundColor: colors.champagneDeep },
});
