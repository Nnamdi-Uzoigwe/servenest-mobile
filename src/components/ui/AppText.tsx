import { colors, textVariants, type ColorKey, type TextVariant } from "@/theme";
import { Text, type TextProps } from "react-native";

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: ColorKey;
  align?: "left" | "center" | "right";
}

export function AppText({
  variant = "body",
  color = "text",
  align,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[
        textVariants[variant],
        { color: colors[color] },
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}
