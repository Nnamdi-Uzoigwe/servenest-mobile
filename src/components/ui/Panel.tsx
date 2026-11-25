import { colors, radius, spacing } from "@/theme";
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";

type Tone = "champagne" | "ink" | "outline";

const TONES: Record<Tone, { bg: string; pressedBg: string; border: string }> = {
  champagne: {
    bg: colors.champagne,
    pressedBg: colors.champagneDeep,
    border: "transparent",
  },
  ink: { bg: colors.ink, pressedBg: colors.inkLift, border: "transparent" },
  outline: {
    bg: "transparent",
    pressedBg: colors.champagne,
    border: colors.line,
  },
};

interface PanelProps extends ViewProps {
  tone?: Tone;
  onPress?: () => void;
  padded?: boolean;
}

export function Panel({
  tone = "champagne",
  onPress,
  padded = true,
  style,
  children,
  ...rest
}: PanelProps) {
  const t = TONES[tone];
  const base = [
    styles.panel,
    { backgroundColor: t.bg, borderColor: t.border },
    padded && styles.padded,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [
          base,
          pressed && { backgroundColor: t.pressedBg },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View {...rest} style={base}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: radius.xl, borderWidth: 1.5 },
  padded: { padding: spacing.xl },
});
