import {
  useQuery,
  UseQueryResult
} from "@tanstack/react-query";

import { getServiceCategories } from "@/services/vendor/vendor.service";

export const GET_SERVICE_CATEGORIES = ["service-categories"] as const;

/**
 * Custom hook to fetch and cache the list of service categories.
 *
 * This hook uses the `useQuery` hook from React Query to fetch the list of service categories
 * and cache the result. It ensures that the data is fetched only once and is not
 * refetched on mount, window focus, or reconnect.
 *
 * @param params - The parameters to filter the list of service categories.
 * @returns The query result containing the list of service categories.
 */

export type ServiceSubcategory = {
  id: number;
  name: string;
};

export type ServiceCategory = {
  id: number;
  name: string;
  subcategories: ServiceSubcategory[];
};

export type GetServiceCategoriesResponse = {
  data: ServiceCategory[];
};

export function useGetServiceCategories(): UseQueryResult<
  GetServiceCategoriesResponse,
  unknown
> {
  return useQuery({
    queryKey: GET_SERVICE_CATEGORIES,
    queryFn: () => getServiceCategories(),
  });
}

/**
 * Usage example:
 *
 * import { useGetServiceCategories } from "@/api/use-setup-profile.ts";
 *
 * const { data, error, isLoading } = useGetServiceCategories();
 *
 */





