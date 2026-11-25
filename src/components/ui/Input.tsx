import { AppText } from "@/components/ui/AppText";
import { colors, layout, radius, spacing, textVariants } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
    type StyleProp,
    type TextInputProps,
    type ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  inputRef?: React.Ref<TextInput>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  hint,
  icon,
  inputRef,
  containerStyle,
  secureTextEntry,
  onFocus,
  onBlur,
  editable = true,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const isPassword = !!secureTextEntry;

  const borderColor = error
    ? colors.danger
    : focused
      ? colors.primary
      : colors.border;

  return (
    <View style={containerStyle}>
      {label ? (
        <AppText variant="label" color="text" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.field,
          { borderColor },
          focused && styles.focused,
          !editable && styles.readonly,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? colors.primary : colors.textSubtle}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          {...rest}
          ref={inputRef}
          editable={editable}
          secureTextEntry={isPassword && hidden}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          style={styles.input}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />

        {isPassword ? (
          <Pressable
            hitSlop={10}
            onPress={() => setHidden((h) => !h)}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <AppText variant="caption" color="danger" style={styles.helper}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color="textMuted" style={styles.helper}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.sm },
  field: {
    height: layout.inputHeight,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  focused: { backgroundColor: colors.champagneSoft },
  readonly: { backgroundColor: colors.champagneSoft, opacity: 0.8 },
  leftIcon: { marginRight: spacing.md },
  input: {
    ...textVariants.body,
    flex: 1,
    color: colors.text,
    paddingVertical: 0,
  },
  helper: { marginTop: spacing.xs },
});
