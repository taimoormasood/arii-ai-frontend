"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import type { CustomSearchFieldRef } from "@/components/ui/custom-searchfield";
import { errorHandler } from "@/helpers";
import { useGetPropertyListing } from "@/hooks/api/use-properties";
import { usePaginationWithSearchParams } from "@/hooks/use-pagination-with-search-params";
import { publishProperty } from "@/services/properties/properties.service";
import { GetPropertyListingParams } from "@/services/properties/types";

import { FilterState } from "./property-filter-sidebar";

const useMyProperties = () => {
  const searchFieldRef = useRef<CustomSearchFieldRef>(null);

  const {
    page,
    limit,
    total,
    setTotal,
    handlePageChange,
    handleLimitChange,
    reset,
  } = usePaginationWithSearchParams("page");

  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : undefined;

  const selectedTab = searchParams?.get("tab") || "active";

  const [filters, setFilters] = useState<{
    q?: string;
    published?: boolean;
    status?: "vacant" | "occupied";
    property_type?: string;
    rental_type?: string;
    city?: string;
    availability_date?: string;
    unit_count_min?: number;
    unit_count_max?: number;
  }>({});

  // Update filters based on selected tab
  useEffect(() => {
    setFilters((prev) => {
      if (selectedTab === "active") {
        return { ...prev, published: true };
      } else if (selectedTab === "inactive") {
        return { ...prev, published: false };
      }

      return prev;
    });
  }, [selectedTab]);

  const {
    data,
    isPending,
    isError: error,
    refetch,
  } = useGetPropertyListing({ ...filters, page });

  useEffect(() => {
    setTotal((data?.data as any)?.data?.count || 0);
  }, [data, setTotal]);

  const handleTabChange = (value: string) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    // Reset page to 1 when tab changes
    params.set("page", "1");
    window.history.replaceState(null, "", `?${params.toString()}`);

    // Reset pagination
    reset();

    // Reset filters to default state (only keeping tab-specific filters)
    setFilters({});

    // Clear search input using ref
    searchFieldRef.current?.clear();
  };

  const handleSearchFilter = useCallback((searchValue: string) => {
    setFilters((prev) => {
      const trimmedValue = searchValue?.trim() || undefined;
      if (prev.q === trimmedValue) return prev;

      return { ...prev, q: trimmedValue };
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    searchFieldRef.current?.clear();
  }, []);

  const handlePropertyStatus = async (
    id: number | null,
    status: "active" | "inactive"
  ) => {
    if (!id) return;

    // Set published true if activating, false if deactivating
    const published = status === "active";
    try {
      const res = await publishProperty(id, { published });

      if (res?.success) {
        if (published) {
          toast.success("Property is now Active and visible to tenants.");
        } else {
          toast.success("Property status updated to Inactive.");
        }
      }
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      refetch();
    }
  };

  return {
    properties: (data?.data as any)?.data?.results || [],
    total,
    page,
    limit,
    isPending,
    error,
    handlePropertyStatus,
    handleSearchFilter,
    selectedTab,
    handleTabChange,
    handlePageChange,
    handleLimitChange,
    searchFieldRef,
    filters,
    handleFiltersChange,
    handleClearFilters,
  };
};

export default useMyProperties;
