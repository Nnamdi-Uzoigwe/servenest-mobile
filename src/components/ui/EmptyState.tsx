import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { colors, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "file-tray-outline",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.tile}>
        <Ionicons name={icon} size={28} color={colors.ink} />
      </View>
      <AppText variant="h2" style={styles.title}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" color="textMuted">
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          size="md"
          fullWidth={false}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "flex-start", paddingTop: spacing.sm },
  tile: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.champagne,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.sm },
  action: { marginTop: spacing.xl },
});
