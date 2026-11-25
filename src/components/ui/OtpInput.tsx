import { AppText } from "@/components/ui/AppText";
import { colors, radius } from "@/theme";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  hasError?: boolean;
  autoFocus?: boolean;
  onComplete?: (value: string) => void;
}

// Six boxes for display, one invisible input on top that receives typing, paste and autofill
export function OtpInput({
  value,
  onChange,
  length = 6,
  hasError = false,
  autoFocus = false,
  onComplete,
}: OtpInputProps) {
  const [focused, setFocused] = useState(false);
  const cursor = Math.min(value.length, length - 1);

  function handleChange(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, length);
    onChange(digits);
    if (digits.length === length) onComplete?.(digits);
  }

  return (
    <View>
      <View style={styles.row}>
        {Array.from({ length }, (_, i) => (
          <View
            key={i}
            style={[
              styles.box,
              focused && i === cursor && styles.boxActive,
              hasError && styles.boxError,
            ]}
          >
            <AppText variant="h2">{value[i] ?? ""}</AppText>
          </View>
        ))}
      </View>

      <TextInput
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        caretHidden
        contextMenuHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={`${length} digit code`}
        style={styles.hidden}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  box: {
    flex: 1,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.field,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: radius.md,
  },
  boxActive: { backgroundColor: colors.paper, borderColor: colors.ink },
  boxError: { borderColor: colors.danger },
  hidden: { ...StyleSheet.absoluteFill, opacity: 0 },
});
