import { useCallback, useState } from "react";

import { hasActiveFilters } from "@/helpers";
import { GetPropertyListingParams } from "@/services/properties/types";

import { FilterState } from "../components/dashboard/property-owner-dashboard/my-properties/property-filter-sidebar";
import { useUrlSearchParams } from "./use-url-search-params";

const defaultFilters: GetPropertyListingParams = {
  published: true, // Default to showing active properties
  q: "",
  status: undefined,
  property_type: undefined,
  rental_type: undefined,
  city: undefined,
  availability_date: undefined,
  unit_count_min: undefined,
  unit_count_max: undefined,
};

export function usePropertyFilters() {
  const [tempFilters, setTempFilters] = useState<FilterState>({});

  // Use the URL search params hook for managing filter state
  const {
    params: filters,
    updateParams,
    setParams,
  } = useUrlSearchParams({
    defaultParams: defaultFilters,
    paramMapping: {
      published: "tab",
    },
    parseParam: (key, value) => {
      // Custom parsing for specific fields
      if (key === "published") {
        return value !== "inactive";
      }
      if (key === "unit_count_min" || key === "unit_count_max") {
        return parseInt(value);
      }

      return value;
    },
    formatParam: (key, value) => {
      // Custom formatting for URL parameters
      if (key === "published") {
        return value ? "active" : "inactive";
      }

      return String(value);
    },
  });

  // Convert filters to FilterState for the sidebar
  const getFilterState = useCallback((): FilterState => {
    return {
      status: filters.status as "vacant" | "occupied" | undefined,
      property_type: filters.property_type,
      rental_type: filters.rental_type,
      city: filters.city,
      availability_date: filters.availability_date,
      unit_count_min: filters.unit_count_min,
      unit_count_max: filters.unit_count_max,
    };
  }, [filters]);

  const handleTabChange = useCallback(
    (tab: string) => {
      updateParams({ published: tab === "active" });
    },
    [updateParams]
  );

  const handleSearchFilter = useCallback(
    (query: string) => {
      updateParams({ q: query });
    },
    [updateParams]
  );

  const handleFiltersChange = useCallback((newFilterState: FilterState) => {
    setTempFilters(newFilterState);
  }, []);

  const handleApplyFilters = useCallback(() => {
    const newFilters: Partial<GetPropertyListingParams> = {
      status: tempFilters.status,
      property_type: tempFilters.property_type,
      rental_type: tempFilters.rental_type,
      city: tempFilters.city,
      availability_date: tempFilters.availability_date,
      unit_count_min: tempFilters.unit_count_min,
      unit_count_max: tempFilters.unit_count_max,
    };
    updateParams(newFilters);
  }, [tempFilters, updateParams]);

  const handleClearFilters = useCallback(() => {
    // Reset to default filters instead of setting everything to undefined
    const clearedFilters: Partial<GetPropertyListingParams> = {
      status: defaultFilters.status,
      property_type: defaultFilters.property_type,
      rental_type: defaultFilters.rental_type,
      city: defaultFilters.city,
      availability_date: defaultFilters.availability_date,
      unit_count_min: defaultFilters.unit_count_min,
      unit_count_max: defaultFilters.unit_count_max,
    };
    updateParams(clearedFilters);
    setTempFilters({});
  }, [updateParams]);

  return {
    filters,
    selectedTab: filters.published ? "active" : "inactive",
    hasActiveFilters: hasActiveFilters(filters, defaultFilters),
    // Filter sidebar props
    filterState: getFilterState(),
    tempFilters:
      Object.keys(tempFilters).length > 0 ? tempFilters : getFilterState(),
    // Handlers
    handleTabChange,
    handleSearchFilter,
    onFiltersChange: handleFiltersChange,
    onApplyFilters: handleApplyFilters,
    onClearFilters: handleClearFilters,
  };
}
