import { AppText } from "@/components/ui/AppText";
import { colors, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface NoticeProps {
  message: string;
  tone?: "error" | "info";
}

export function Notice({ message, tone = "error" }: NoticeProps) {
  const isError = tone === "error";
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.box,
        { backgroundColor: isError ? colors.dangerSoft : colors.champagne },
      ]}
    >
      <Ionicons
        name={isError ? "alert-circle" : "information-circle"}
        size={20}
        color={isError ? colors.danger : colors.ink}
        style={styles.icon}
      />
      <AppText
        variant="caption"
        color={isError ? "danger" : "ink"}
        style={styles.text}
      >
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: radius.md,
    padding: spacing.md,
  },
  icon: { marginRight: spacing.sm, marginTop: 1 },
  text: { flex: 1 },
});
