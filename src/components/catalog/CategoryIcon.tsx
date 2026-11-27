import type { IconKey } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";

const ICONS: Record<IconKey, keyof typeof Ionicons.glyphMap> = {
  plumbing: "water-outline",
  electrical: "flash-outline",
  ac: "snow-outline",
  cleaning: "sparkles-outline",
  generator: "flame-outline",
  painting: "color-palette-outline",
  appliance: "tv-outline",
  carpentry: "hammer-outline",
  pest: "bug-outline",
  maintenance: "construct-outline",
  other: "apps-outline",
};

interface CategoryIconProps {
  iconKey: IconKey;
  size?: number;
  color: string;
}

export function CategoryIcon({ iconKey, size = 24, color }: CategoryIconProps) {
  return (
    <Ionicons
      name={ICONS[iconKey] ?? "apps-outline"}
      size={size}
      color={color}
    />
  );
}
