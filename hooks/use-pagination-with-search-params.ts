import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { usePaginationStore } from "@/stores/pagination-store";

export function usePaginationWithSearchParams(paramKey = "page") {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { page, limit, total, setPage, setLimit, setTotal, reset } =
    usePaginationStore();

  // Sync Zustand store with searchParams on mount
  useEffect(() => {
    const pageFromParams = Number(searchParams.get(paramKey)) || 1;
    if (page !== pageFromParams) setPage(pageFromParams);
  }, [searchParams, paramKey, page, setPage]);

  // Update searchParams when page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, String(newPage));
    router.push(`?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    // Optionally reset page to 1 on limit change
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, "1");
    router.push(`?${params.toString()}`);
  };

  return {
    page,
    limit,
    total,
    setTotal,
    handlePageChange,
    handleLimitChange,
    reset,
  };
}
