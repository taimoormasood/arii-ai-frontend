"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { CustomSearchFieldRef } from "@/components/ui/custom-searchfield";
import {
  useGetTenantsList,
  useResendInvitationToTenant,
  useUpdateLeaseStatus,
} from "@/hooks/api/use-tenants";
import { usePaginationWithSearchParams } from "@/hooks/use-pagination-with-search-params";

const useTenantManagement = () => {
  const searchFieldRef = useRef<CustomSearchFieldRef>(null);
  const { mutate: resendInvitation, isPending: isResending } =
    useResendInvitationToTenant();

  const { mutate: updateLeaseStatus, isPending: isUpdatingLease } =
    useUpdateLeaseStatus();

  const [resendingInvitationId, setResendingInvitationId] = useState<
    number | null
  >(null);

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

  const selectedTab = searchParams?.get("tab") || "joined";

  const [filters, setFilters] = useState<{
    q?: string;
    accepted?: boolean;
  }>({});

  // Update filters based on selected tab
  useEffect(() => {
    setFilters((prev) => {
      // Set appropriate filter flags based on the tab
      if (selectedTab === "joined") {
        return { ...prev, accepted: true };
      } else if (selectedTab === "invited") {
        return { ...prev, accepted: false };
      }

      return prev;
    });
  }, [selectedTab]);

  const {
    data,
    isPending,
    isError: error,
  } = useGetTenantsList({ ...filters, page, limit });

  useEffect(() => {
    setTotal(data?.data?.count || 0);
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

  const handleResendInvitation = (tenantId: number) => {
    setResendingInvitationId(tenantId);
    resendInvitation(
      {
        invitation_id: tenantId,
        role: "tenant",
      },
      {
        onSuccess: () => {
          setResendingInvitationId(null);
        },
        onError: () => {
          setResendingInvitationId(null);
        },
      }
    );
  };

  const handleLeaseUpdateStatus = (
    tenantId: number,
    action: string,
    successCallback?: () => void
  ) => {
    updateLeaseStatus(
      {
        invitation_id: tenantId,
        action: action,
      },
      {
        onSuccess: () => {
          successCallback?.();
        },
      }
    );
  };

  return {
    tenants: data?.data?.results || [],
    total,
    page,
    limit,
    isPending,
    error,
    handleSearchFilter,
    selectedTab,
    handleTabChange,
    handleResendInvitation,
    handlePageChange,
    handleLimitChange,
    searchFieldRef,
    isResending,
    resendingInvitationId,
    handleLeaseUpdateStatus,
    isUpdatingLease,
  };
};

export default useTenantManagement;
