export const colors = {
  // Emerald ink: the ground and the main action color
  ink: "#064e3b",
  inkDeep: "#022c22",
  inkLift: "#0d6a50",

  // Champagne: paper, highlights and text on ink
  champagne: "#f8e7c9",
  champagneDeep: "#ecd3a6",
  paper: "#fdf8ec",
  white: "#ffffff",
  field: "#f4e8cc",
  line: "#e6d5ae",

  // Text
  text: "#0f2a22",
  textMuted: "#4f6a5f",
  textSubtle: "#7f9389",
  onInk: "#f8e7c9",
  onInkMuted: "rgba(248, 231, 201, 0.72)",
  inkLine: "rgba(248, 231, 201, 0.22)",

  // Accent
  brass: "#a8741a",

  // Status
  success: "#166534",
  successSoft: "#dcefd9",
  warning: "#9a5b07",
  warningSoft: "#fbefcf",
  danger: "#b42318",
  dangerSoft: "#fde8e4",
} as const;

export type ColorKey = keyof typeof colors;
