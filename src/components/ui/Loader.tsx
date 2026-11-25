import { colors } from "@/theme";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoaderProps {
  fullScreen?: boolean;
  size?: "small" | "large";
  tone?: "ink" | "onInk";
}

export function Loader({
  fullScreen = false,
  size = "large",
  tone = "ink",
}: LoaderProps) {
  return (
    <View
      style={[
        fullScreen ? styles.full : styles.inline,
        fullScreen && {
          backgroundColor: tone === "ink" ? colors.paper : colors.ink,
        },
      ]}
    >
      <ActivityIndicator
        size={size}
        color={tone === "ink" ? colors.ink : colors.onInk}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, alignItems: "center", justifyContent: "center" },
  inline: { padding: 24, alignItems: "center", justifyContent: "center" },
});
