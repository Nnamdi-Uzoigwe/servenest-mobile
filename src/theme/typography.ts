import type { TextStyle } from "react-native";

export const fonts = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
} as const;

export const textVariants = {
  display: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 42 },
  h1: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 36 },
  h2: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 28 },
  h3: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 23 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 19 },
  button: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
