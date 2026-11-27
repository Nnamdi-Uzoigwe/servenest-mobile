import { CatalogPicture } from "@/components/catalog/CatalogPicture";
import { AppText } from "@/components/ui";
import { spacing } from "@/theme";
import type { CatalogCategory } from "@/types/api";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

const TILE = 104;

export function CategoryTile({ category }: { category: CatalogCategory }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/catalog",
          params: { category: category.slug },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${category.serviceCount} ${
        category.serviceCount === 1 ? "service" : "services"
      }`}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <CatalogPicture
        image={category.image}
        iconKey={category.iconKey}
        size={TILE}
      />
      <AppText variant="label" numberOfLines={2} style={styles.label}>
        {category.name}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { width: TILE },
  pressed: { opacity: 0.8 },
  label: { marginTop: spacing.sm },
});
