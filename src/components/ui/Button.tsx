import { AppText } from "@/components/ui/AppText";
import { colors, layout, radius, spacing, type ColorKey } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Variant = "primary" | "champagne" | "tonal" | "ghost" | "ghostOnInk";
type Size = "md" | "lg";

interface ButtonProps extends Omit<PressableProps, "style" | "children"> {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

const VARIANTS: Record<
  Variant,
  { bg: string; pressedBg: string; fg: ColorKey }
> = {
  primary: { bg: colors.ink, pressedBg: colors.inkDeep, fg: "onInk" },
  champagne: {
    bg: colors.champagne,
    pressedBg: colors.champagneDeep,
    fg: "ink",
  },
  tonal: { bg: colors.champagneDeep, pressedBg: colors.champagne, fg: "ink" },
  ghost: { bg: "transparent", pressedBg: colors.champagne, fg: "ink" },
  ghostOnInk: { bg: "transparent", pressedBg: colors.inkLift, fg: "onInk" },
};

export function Button({
  title,
  variant = "primary",
  size = "lg",
  loading = false,
  fullWidth = true,
  icon,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const v = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          height: layout.buttonHeight[size],
          backgroundColor: pressed ? v.pressedBg : v.bg,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        fullWidth ? styles.full : styles.auto,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors[v.fg]} />
      ) : (
        <View style={styles.row}>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={colors[v.fg]}
              style={styles.icon}
            />
          ) : null}
          <AppText variant="button" color={v.fg}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  full: { alignSelf: "stretch" },
  auto: { alignSelf: "flex-start" },
  disabled: { opacity: 0.5 },
  row: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: spacing.sm },
});
