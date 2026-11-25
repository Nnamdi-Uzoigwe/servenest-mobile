import type { TextStyle } from "react-native";

export const fonts = {
  displayExtraBold: "BricolageGrotesque_800ExtraBold",
  display: "BricolageGrotesque_700Bold",
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
} as const;

export const textVariants = {
  display: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h3: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 23 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19 },
  label: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 },
  button: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
