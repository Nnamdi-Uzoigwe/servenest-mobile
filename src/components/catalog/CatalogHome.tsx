import { CategoryTile } from "@/components/catalog/CategoryTile";
import { ErrorNotice } from "@/components/catalog/ErrorNotice";
import { ServiceRow } from "@/components/catalog/ServiceRow";
import { AppText, Button, EmptyState, Loader } from "@/components/ui";
import { useCategories, useFeaturedServices } from "@/lib/catalog";
import { colors, layout, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

function SearchPill() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/catalog", params: { focus: "1" } })
      }
      accessibilityRole="search"
      accessibilityLabel="Search services"
      style={styles.search}
    >
      <Ionicons name="search-outline" size={20} color={colors.textSubtle} />
      <AppText variant="body" color="textSubtle">
        Search plumbing, cleaning, repairs
      </AppText>
    </Pressable>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <AppText variant="h2">{title}</AppText>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <AppText variant="bodyMedium" color="ink">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

// The catalogue sections shared by the customer Home and the guest home
export function CatalogHome() {
  const router = useRouter();
  const categories = useCategories();
  const featured = useFeaturedServices();

  const loading = categories.isLoading || featured.isLoading;
  const failed = categories.isError || featured.isError;
  const visibleCategories = (categories.data ?? []).filter(
    (c) => c.serviceCount > 0,
  );
  const popular = featured.data ?? [];

  return (
    <View>
      <SearchPill />

      {failed ? (
        <ErrorNotice
          onRetry={() => {
            void categories.refetch();
            void featured.refetch();
          }}
        />
      ) : null}

      {loading ? <Loader /> : null}

      {visibleCategories.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Categories"
            actionLabel="See all"
            onAction={() => router.push("/catalog")}
          />
          {/* Runs to the screen edges, so the next tile peeks in and hints that it scrolls */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.rail}
            contentContainerStyle={styles.railContent}
          >
            {visibleCategories.map((category) => (
              <CategoryTile key={category._id} category={category} />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {popular.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader title="Popular services" />
          <View>
            {popular.map((service) => (
              <ServiceRow key={service._id} service={service} />
            ))}
          </View>
        </View>
      ) : null}

      {!loading && !failed && visibleCategories.length === 0 ? (
        <EmptyState
          icon="construct-outline"
          title="No services yet"
          message="Services will show up here as soon as they are added."
        />
      ) : null}

      {visibleCategories.length > 0 ? (
        <Button
          title="Browse all services"
          variant="tonal"
          onPress={() => router.push("/catalog")}
          style={styles.browseAll}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    height: layout.inputHeight,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.field,
  },
  section: { marginTop: spacing.xxl },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  rail: { marginHorizontal: -layout.screenPadding },
  railContent: { paddingHorizontal: layout.screenPadding, gap: spacing.md },
  browseAll: { marginTop: spacing.xl },
});
