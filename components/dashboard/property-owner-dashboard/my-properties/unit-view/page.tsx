"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import CustomSearchField from "@/components/ui/custom-searchfield";
import GenericTabs from "@/components/ui/GenericTabs";
import { errorHandler } from "@/helpers";
import { useGetAllUnitsByPropertyId } from "@/hooks/api/use-properties";
import { usePaginationWithSearchParams } from "@/hooks/use-pagination-with-search-params";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import { publishUnit } from "@/services/properties/properties.service";
import type { UnitResult } from "@/services/properties/types";

import { UnitConfirmationModal } from "../add-property/property-types/common/unit-confirmation-modal";
import UnitPropertyCardSkeleton from "../add-property/property-types/common/unit-property-card-skeleton";
import { UnitPropertyType } from "../config/unit-steps";
import UnitPropertyCard from "./unit-property-card";

const UnitView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUnitStep, setCurrentUnitStep] = useState(1);
  const { clearAllUnitFormData, updateStepData } = usePropertyStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  const propertyType = useMemo(
    () => searchParams.get("propertyType"),
    [searchParams]
  );

  const params = useParams();
  const propertyId = useMemo(() => Number(params?.id), [params]);

  const { setSelectedPropertyType, setEditMode, updateUnitStepData } =
    usePropertyStore();

  // Use pagination hook similar to tenant management
  const {
    page,
    limit,
    total,
    setTotal,
    handlePageChange,
    handleLimitChange,
    reset,
  } = usePaginationWithSearchParams("page");

  // Get tab from URL params
  const selectedTab = searchParams.get("tab") || "active";

  // State for filters
  const [filters, setFilters] = useState<{
    q?: string;
    published?: boolean;
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

  const { data, isLoading, error, refetch } = useGetAllUnitsByPropertyId({
    propertyId,
    published: filters.published ?? true,
    q: filters.q || "",
    page: page,
  });

  const units = data?.data?.data?.results;

  // Update total when data changes
  useEffect(() => {
    setTotal(data?.data?.data?.count || 0);
  }, [data, setTotal]);

  const totalPages = Math.ceil(total / limit);

  const tabItems = [
    { label: "Active", value: "active", content: null },
    { label: "Inactive", value: "inactive", content: null },
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    params.set("page", "1"); // Reset to first page
    router.push(`?${params.toString()}`);
    reset(); // Reset pagination
    setFilters({}); // Reset filters
  };

  // Handle search filter
  const handleSearchFilter = useCallback((searchValue: string) => {
    setFilters((prev) => {
      const trimmedValue = searchValue?.trim() || undefined;
      if (prev.q === trimmedValue) return prev;

      return { ...prev, q: trimmedValue };
    });
  }, []);

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (filters.q !== undefined) {
      handlePageChange(1);
    }
  }, [filters.q, handlePageChange]);

  // Create skeleton array for loading state
  const skeletonArray = Array.from({ length: 6 }, (_, index) => index);

  const handleAddNewUnits = async () => {
    setModalOpen(true);
    clearAllUnitFormData();
    setCurrentUnitStep(1);
  };

  const handleUnitEdit = (unitId: any) => {
    setSelectedPropertyType(propertyType as UnitPropertyType);
    // Set edit mode with the property ID from params
    setEditMode(true, parseInt(propertyId as any));

    // Update unit step data with unit ID
    updateUnitStepData("unitInfo", {
      id: unitId,
    });

    // Navigate to unit edit page
    router.push(`/my-properties/add-unit/${propertyType}?unitId=${unitId}`);
  };

  const handleUnitStatus = async (
    id: number | null,
    status: "active" | "inactive"
  ) => {
    if (!id) return;
    // Set published true if activating, false if deactivating
    const published = status === "active";
    try {
      const res = await publishUnit(id, { published });

      if (res?.success) {
        if (published) {
          toast.success("Unit is now Active and visible to tenants.");
        } else {
          toast.success("Unit status updated to Inactive.");
        }
      }
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      refetch();
    }
  };

  return (
    <React.Fragment>
      {modalOpen && (
        <UnitConfirmationModal
          title={`How would you like to add your ${propertyType === "university_housing" ? "rooms" : "units"}?`}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          actions={[
            {
              text: "Add Manually",
              variant: "outline",
              onClick: () => {
                setModalOpen(false);
                updateStepData("propertyInfo", {
                  id: propertyId!,
                });
                router.push(
                  `/my-properties/add-unit/${propertyType}?propertyId=${propertyId}`
                );
              },
            },
            {
              text: "Bulk Import",
              variant: "default",
              onClick: () => {
                setModalOpen(false);
                router.push(
                  `/my-properties/bulk-import/${propertyId}?propertyId=${propertyType}`
                );
              },
            },
          ]}
        />
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Units Summary
            </h1>
          </div>
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <CustomSearchField
              onChange={handleSearchFilter}
              className="w-full sm:w-auto"
            />
            <Button
              // disabled={buttonDisabled}
              onClick={handleAddNewUnits}
              className="bg-primary-600 hover:bg-primary-700 text-white w-full sm:w-auto"
            >
              <Plus size={18} className="mr-2" /> Add New Unit
            </Button>
          </div>
        </div>

        {/* Active/Inactive Tabs */}
        <GenericTabs
          tabs={tabItems}
          defaultValue={selectedTab}
          onValueChange={handleTabChange}
          className="w-full"
        />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {skeletonArray.map((index) => (
              <UnitPropertyCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Units Grid - Only show when not loading */}
        {!isLoading && (
          <>
            {units && units.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {units.map((unit: UnitResult) => (
                  <UnitPropertyCard
                    key={unit?.id}
                    unitData={unit}
                    selectedTab={selectedTab}
                    actions={[
                      {
                        text: "Edit",
                        onClick: () => handleUnitEdit(unit?.id),
                      },
                      {
                        text: selectedTab === "active" ? "In-Active" : "Active",
                        onClick: () =>
                          handleUnitStatus(
                            unit?.id,
                            selectedTab === "active" ? "inactive" : "active"
                          ),
                      },
                    ]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No {selectedTab === "active" ? "active" : "inactive"} units
                found
              </div>
            )}
          </>
        )}

        {/* Pagination - Only show when not loading and has data */}
        {!isLoading && units && units.length > 0 && (
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {/* Dynamic page numbers */}
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-8 px-3 ${page === pageNum ? "bg-primary-200 text-primary-700" : ""}`}
                    >
                      {pageNum}
                    </Button>
                  )
                )
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className={`h-8 px-3 ${page === 1 ? "bg-primary-200 text-primary-700" : ""}`}
                  >
                    1
                  </Button>
                  {page > 3 && <span className="px-2 text-gray-500">...</span>}
                  {page > 2 && page < totalPages - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      className="h-8 px-3"
                    >
                      {page - 1}
                    </Button>
                  )}
                  {page !== 1 && page !== totalPages && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`h-8 px-3 bg-primary-200 text-primary-700`}
                      disabled
                    >
                      {page}
                    </Button>
                  )}
                  {page < totalPages - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      className="h-8 px-3"
                    >
                      {page + 1}
                    </Button>
                  )}
                  {page < totalPages - 2 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className={`h-8 px-3 ${page === totalPages ? "bg-primary-200 text-primary-700" : ""}`}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default UnitView;
