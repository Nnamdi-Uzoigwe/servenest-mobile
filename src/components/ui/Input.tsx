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
  multiline = false,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const isPassword = !!secureTextEntry;

  return (
    <View style={containerStyle}>
      {label ? (
        <AppText variant="label" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.field,
          multiline ? styles.fieldMultiline : styles.fieldSingle,
          focused && styles.focused,
          !!error && styles.errored,
          !editable && styles.readonly,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? colors.ink : colors.textSubtle}
            style={[styles.leftIcon, multiline && styles.leftIconMultiline]}
          />
        ) : null}

        <TextInput
          {...rest}
          ref={inputRef}
          multiline={multiline}
          editable={editable}
          secureTextEntry={isPassword && hidden}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.ink}
          style={[styles.input, multiline && styles.inputMultiline]}
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
  // The border is always 2px (transparent at rest) so focusing never shifts the layout
  field: {
    flexDirection: "row",
    backgroundColor: colors.field,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  fieldSingle: { height: layout.inputHeight, alignItems: "center" },
  fieldMultiline: {
    minHeight: 120,
    alignItems: "flex-start",
    paddingVertical: 14,
  },
  focused: { backgroundColor: colors.paper, borderColor: colors.ink },
  errored: { borderColor: colors.danger },
  readonly: { opacity: 0.6 },
  leftIcon: { marginRight: spacing.md },
  leftIconMultiline: { marginTop: 2 },
  input: {
    ...textVariants.body,
    flex: 1,
    color: colors.text,
    paddingVertical: 0,
  },
  inputMultiline: { minHeight: 90, textAlignVertical: "top" },
  helper: { marginTop: spacing.xs },
});
