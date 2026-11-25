import { colors } from "@/theme";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoaderProps {
  fullScreen?: boolean;
  size?: "small" | "large";
}

export function Loader({ fullScreen = false, size = "large" }: LoaderProps) {
  return (
    <View style={fullScreen ? styles.full : styles.inline}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  inline: { padding: 24, alignItems: "center", justifyContent: "center" },
});
