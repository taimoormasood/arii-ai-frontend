import { useInfiniteQuery } from "@tanstack/react-query";

import { CityResponse } from "@/app/api/cities/route";

interface UseCitiesParams {
  search?: string;
  limit?: number;
  enabled?: boolean;
}

export const CITIES_QUERY_KEY = ["cities"] as const;

export function useCities({
  search = "",
  limit = 30,
  enabled = true,
}: UseCitiesParams = {}) {
  return useInfiniteQuery<CityResponse>({
    queryKey: [...CITIES_QUERY_KEY, search, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams({
        page: String(pageParam),
        limit: String(limit),
        ...(search && { search }),
      });

      const response = await fetch(`/api/cities?${searchParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Helper hook to get all cities flattened from pages
export function useFlattenedCities(params?: UseCitiesParams) {
  const query = useCities(params);

  const cities = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    ...query,
    cities,
    totalCount: query.data?.pages[0]?.pagination.total ?? 0,
  };
}
