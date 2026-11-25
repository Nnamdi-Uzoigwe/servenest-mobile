export const colors = {
  // Brand: emerald ink and champagne
  primary: "#064e3b",
  primaryPressed: "#022c22",
  primarySoft: "#e3efe9",
  champagne: "#f8e7c9",
  champagneSoft: "#fcf4e3",
  champagneDeep: "#ecd3a6",
  onPrimary: "#f8e7c9",

  // Surfaces
  background: "#fdf9f1",
  surface: "#ffffff",
  border: "#eadfc8",
  borderStrong: "#d4c5a3",

  // Text
  text: "#10201a",
  textMuted: "#5a6b63",
  textSubtle: "#8a978f",

  // Accents and status
  gold: "#b7791f",
  success: "#15803d",
  successSoft: "#dcfce7",
  warning: "#b45309",
  warningSoft: "#fef3c7",
  danger: "#b42318",
  dangerSoft: "#fee4e2",
  info: "#0e7490",
  infoSoft: "#cffafe",
} as const;

export type ColorKey = keyof typeof colors;
