import { CategoryIcon } from "@/components/catalog/CategoryIcon";
import { cloudinaryThumb } from "@/lib/cloudinary";
import { colors, radius } from "@/theme";
import type { CatalogImage, IconKey } from "@/types/api";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface CatalogPictureProps {
  image?: CatalogImage;
  // Used when there is no image of its own, for example a service using its category's photo
  fallbackImage?: CatalogImage;
  iconKey: IconKey;
  size: number;
  rounding?: number;
}

// The photo if there is one, otherwise the category icon on champagne
export function CatalogPicture({
  image,
  fallbackImage,
  iconKey,
  size,
  rounding = radius.lg,
}: CatalogPictureProps) {
  const source = image ?? fallbackImage;
  const box = { width: size, height: size, borderRadius: rounding };

  if (source) {
    return (
      <Image
        source={{ uri: cloudinaryThumb(source.url, size) }}
        style={[styles.base, box]}
        contentFit="cover"
        transition={150}
        accessible={false}
      />
    );
  }

  return (
    <View style={[styles.base, styles.fallback, box]}>
      <CategoryIcon
        iconKey={iconKey}
        size={Math.round(size * 0.4)}
        color={colors.ink}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: "hidden", backgroundColor: colors.champagne },
  fallback: { alignItems: "center", justifyContent: "center" },
});
