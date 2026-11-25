export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// Radius follows hierarchy: small controls are tighter, big surfaces are rounder
export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const layout = {
  screenPadding: 24,
  inputHeight: 56,
  buttonHeight: { md: 48, lg: 56 },
} as const;
