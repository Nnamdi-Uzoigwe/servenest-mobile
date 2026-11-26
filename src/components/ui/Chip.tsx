import { AppText } from "@/components/ui/AppText";
import { colors, radius, type ColorKey } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  // When set, the chip is a removable tag with a close icon
  onRemove?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function Chip({
  label,
  selected = false,
  onPress,
  onRemove,
  disabled,
  accessibilityLabel,
}: ChipProps) {
  const removable = !!onRemove;
  const bg = removable
    ? colors.champagne
    : selected
      ? colors.ink
      : colors.field;
  const fg: ColorKey = selected && !removable ? "onInk" : "ink";

  return (
    <Pressable
      onPress={removable ? onRemove : onPress}
      disabled={disabled}
      accessibilityRole={removable ? "button" : "checkbox"}
      accessibilityState={
        removable ? undefined : { checked: selected, disabled }
      }
      accessibilityLabel={
        removable ? `Remove ${label}` : (accessibilityLabel ?? label)
      }
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {selected && !removable ? (
        <Ionicons
          name="checkmark"
          size={16}
          color={colors.onInk}
          style={styles.leading}
        />
      ) : null}
      <AppText variant="label" color={fg}>
        {label}
      </AppText>
      {removable ? (
        <Ionicons
          name="close"
          size={16}
          color={colors.ink}
          style={styles.trailing}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  leading: { marginRight: 6 },
  trailing: { marginLeft: 6 },
});
