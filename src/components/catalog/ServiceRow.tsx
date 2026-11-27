import { CatalogPicture } from "@/components/catalog/CatalogPicture";
import { AppText } from "@/components/ui";
import { useCategoryLookup } from "@/lib/catalog";
import { formatDuration, formatNaira } from "@/lib/money";
import { colors, radius, spacing } from "@/theme";
import type { CatalogService } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export function ServiceRow({ service }: { service: CatalogService }) {
  const router = useRouter();
  const categoryImage = useCategoryLookup().get(service.category._id)?.image;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/catalog/[slug]",
          params: { slug: service.slug },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`${service.name}, from ${formatNaira(service.startingPrice)}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <CatalogPicture
        image={service.image}
        fallbackImage={categoryImage}
        iconKey={service.category.iconKey}
        size={72}
      />

      <View style={styles.text}>
        <AppText variant="h3" numberOfLines={2}>
          {service.name}
        </AppText>
        <AppText variant="caption" color="textMuted" numberOfLines={1}>
          {service.category.name}
        </AppText>

        <View style={styles.meta}>
          <AppText variant="bodyMedium" color="ink">
            From {formatNaira(service.startingPrice)}
          </AppText>
          <AppText variant="caption" color="textSubtle">
            About {formatDuration(service.estimatedDurationMinutes)}
          </AppText>
        </View>

        {!service.isAvailable ? (
          <View style={styles.paused}>
            <AppText variant="caption" color="warning">
              Not taking bookings right now
            </AppText>
          </View>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.textSubtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  pressed: { backgroundColor: colors.paper },
  text: { flex: 1 },
  meta: { marginTop: spacing.xs },
  paused: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.warningSoft,
  },
});
