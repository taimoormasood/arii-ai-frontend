"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { CustomSearchFieldRef } from "@/components/ui/custom-searchfield";
import {
  useDeleteVendor,
  useGetVendorsList,
  useResendInvitationToVendor,
  useUpdateVendorBlockStatus,
} from "@/hooks/api/use-vendors";
import { usePaginationWithSearchParams } from "@/hooks/use-pagination-with-search-params";

const useVendorManagement = () => {
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

  const selectedTab = searchParams?.get("tab") || "joined";

  const { mutate, isPending: isUpdating } = useUpdateVendorBlockStatus();

  const { mutate: deleteVendor, isPending: isDeleting } = useDeleteVendor();

  const { mutate: resendInvitation, isPending: isResending } =
    useResendInvitationToVendor();

  const [resendingInvitationId, setResendingInvitationId] = useState<
    number | null
  >(null);

  const [filters, setFilters] = useState<{
    q?: string;
    accepted?: boolean;
    blocked?: boolean;
  }>({});

  // Update filters based on selected tab
  useEffect(() => {
    setFilters((prev) => {
      // Set appropriate filter flags based on the tab
      if (selectedTab === "joined") {
        return { ...prev, accepted: true, blocked: false };
      } else if (selectedTab === "invited") {
        return { ...prev, accepted: false, blocked: false };
      } else if (selectedTab === "blocked") {
        return { ...prev, blocked: true };
      }

      return prev;
    });
  }, [selectedTab]);

  const {
    data,
    isPending,
    isError: error,
  } = useGetVendorsList({ ...filters, page, limit });

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

  const handleVendorStatus = (
    val: boolean,
    id: number,
    onSuccessCallback?: () => void
  ) => {
    const payload = {
      invitation_id: id,
      blocked: val,
    };
    mutate(payload, {
      onSuccess: () => {
        setFilters((prev) => ({ ...prev, q: "" }));
        onSuccessCallback?.();
      },
    });
  };

  const handleDeleteVendor = (
    vendorId: number,
    onSuccessCallback?: () => void
  ) => {
    deleteVendor(vendorId, {
      onSuccess: () => {
        setFilters((prev) => ({ ...prev, q: "" }));
        onSuccessCallback?.();
      },
    });
  };

  const handleResendInvitation = (invitationId: number) => {
    setResendingInvitationId(invitationId);
    resendInvitation(
      {
        invitation_id: invitationId,
        role: "vendor",
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

  return {
    vendors: data?.data?.results || [],
    total,
    page,
    limit,
    isPending,
    error,
    handleSearchFilter,
    selectedTab,
    handleTabChange,
    handleVendorStatus,
    handleDeleteVendor,
    handlePageChange,
    handleLimitChange,
    isDeleting,
    isUpdating,
    searchFieldRef,
    handleResendInvitation,
    isResending,
    resendingInvitationId,
  };
};

export default useVendorManagement;
