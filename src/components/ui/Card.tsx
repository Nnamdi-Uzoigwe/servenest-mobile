import { colors, radius, shadows, spacing } from "@/theme";
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
}

export function Card({
  onPress,
  padded = true,
  style,
  children,
  ...rest
}: CardProps) {
  const cardStyle = [styles.card, padded && styles.padded, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View {...rest} style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  padded: { padding: spacing.lg },
  pressed: { backgroundColor: colors.champagneSoft },
});
