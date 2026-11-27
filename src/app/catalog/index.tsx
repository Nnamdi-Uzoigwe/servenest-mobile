import { ErrorNotice } from "@/components/catalog/ErrorNotice";
import { ServiceRow } from "@/components/catalog/ServiceRow";
import {
    AppText,
    BackButton,
    Chip,
    EmptyState,
    Input,
    Loader,
    Screen,
} from "@/components/ui";
import { useCategories, useServiceSearch } from "@/lib/catalog";
import { useDebounced } from "@/lib/useDebounced";
import { colors, layout, spacing } from "@/theme";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

export default function CatalogBrowse() {
  const params = useLocalSearchParams<{ category?: string; focus?: string }>();

  const [category, setCategory] = useState<string | undefined>(params.category);
  const [text, setText] = useState("");
  const q = useDebounced(text.trim(), 300);

  const categories = useCategories();
  const search = useServiceSearch({ category, q: q || undefined });

  const items = search.data?.pages.flatMap((page) => page.items) ?? [];
  const total = search.data?.pages[0]?.pagination.total ?? 0;
  const filterChips = (categories.data ?? []).filter((c) => c.serviceCount > 0);

  return (
    <Screen ground="white" padded={false}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <BackButton />
          <AppText variant="h2">Services</AppText>
        </View>

        <Input
          icon="search-outline"
          placeholder="Search services"
          value={text}
          onChangeText={setText}
          autoFocus={params.focus === "1"}
          autoCorrect={false}
          returnKeyType="search"
          containerStyle={styles.searchField}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chips}
        >
          <Chip
            label="All"
            selected={!category}
            onPress={() => setCategory(undefined)}
          />
          {filterChips.map((c) => (
            <Chip
              key={c._id}
              label={c.name}
              selected={category === c.slug}
              onPress={() => setCategory(c.slug)}
            />
          ))}
        </ScrollView>
      </View>

      {search.isLoading ? (
        <Loader />
      ) : search.isError ? (
        <View style={styles.padded}>
          <ErrorNotice onRetry={() => void search.refetch()} />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.padded}>
          <EmptyState
            icon="search-outline"
            title="No services match"
            message="Try a different word, or pick another category."
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ServiceRow service={item} />}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (search.hasNextPage && !search.isFetchingNextPage)
              void search.fetchNextPage();
          }}
          ListHeaderComponent={
            <AppText variant="caption" color="textMuted" style={styles.count}>
              {total} {total === 1 ? "service" : "services"}
            </AppText>
          }
          ListFooterComponent={
            search.isFetchingNextPage ? (
              <ActivityIndicator
                color={colors.ink}
                style={styles.footerLoader}
              />
            ) : null
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.md },
  topRow: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  searchField: { marginTop: spacing.lg },
  chipsScroll: {
    marginTop: spacing.md,
    marginHorizontal: -layout.screenPadding,
  },
  chips: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  padded: { paddingHorizontal: layout.screenPadding },
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  count: { marginTop: spacing.md, marginBottom: spacing.xs },
  footerLoader: { paddingVertical: spacing.xl },
});
