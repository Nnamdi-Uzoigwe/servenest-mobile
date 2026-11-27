import { api } from "@/lib/api";
import type {
  CatalogCategory,
  CatalogService,
  CatalogServiceList,
} from "@/types/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// The catalogue changes rarely, so a minute of caching keeps the app quick without going stale
const STALE = 60 * 1000;
const PAGE_SIZE = 20;

function query(params: Record<string, string | number | boolean | undefined>) {
  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  return parts.length ? `?${parts.join("&")}` : "";
}

// Public endpoints, so no sign in is needed and the same calls work for guests

export function useCategories() {
  return useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: () =>
      api.get<CatalogCategory[]>("/catalog/categories", { auth: false }),
    staleTime: STALE,
  });
}

// Categories by id, so a service can borrow its category's photo when it has none
export function useCategoryLookup() {
  const { data } = useCategories();
  return useMemo(() => new Map((data ?? []).map((c) => [c._id, c])), [data]);
}

export function useFeaturedServices() {
  return useQuery({
    queryKey: ["catalog", "featured"],
    queryFn: () =>
      api.get<CatalogServiceList>(
        `/catalog/services${query({ featured: true, limit: 6 })}`,
        {
          auth: false,
        },
      ),
    staleTime: STALE,
    select: (data) => data.items,
  });
}

export function useServiceSearch(params: { category?: string; q?: string }) {
  return useInfiniteQuery({
    queryKey: ["catalog", "services", params.category ?? "", params.q ?? ""],
    queryFn: ({ pageParam }) =>
      api.get<CatalogServiceList>(
        `/catalog/services${query({
          category: params.category,
          q: params.q,
          page: pageParam,
          limit: PAGE_SIZE,
        })}`,
        { auth: false },
      ),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.pages
        ? last.pagination.page + 1
        : undefined,
    staleTime: STALE,
  });
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ["catalog", "service", slug],
    queryFn: () =>
      api.get<CatalogService>(`/catalog/services/${encodeURIComponent(slug)}`, {
        auth: false,
      }),
    staleTime: STALE,
    enabled: !!slug,
  });
}
