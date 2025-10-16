"use client";

import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  HomeIcon,
  MapPin,
  MoreVertical,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";

import {
  ArrowPointerIcon,
  EmtpyIcon,
  PropertyTypeIcon,
  UnitHomeIcon,
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomSearchField from "@/components/ui/custom-searchfield";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDefaultTrigger,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GenericTabs from "@/components/ui/GenericTabs";
import { formatText } from "@/helpers";
import type { Property } from "@/hooks/api/use-properties";

import { ActiveInactiveModal } from "./active-inactive-modal";
import PropertyCardSkeleton from "./add-property/property-types/common/property-card-skeleton";
import { PropertyFilterSidebar } from "./property-filter-sidebar";
import SelectPropertyTypeModal from "./select-property-modal";
import useMyProperties from "./use-my-properties";

const MyPropertiesComponent = () => {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [hasDataLoaded, setHasDataLoaded] = useState(false);
  const [isActiveInactiveModalOpen, setIsActiveInactiveModalOpen] =
    useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const [selectedPropertyStatus, setSelectedPropertyStatus] = useState<
    "active" | "inactive" | null
  >(null);

  const {
    properties,
    isPending: isApiPending,
    error,
    handleTabChange,
    handleSearchFilter,
    selectedTab,
    total,
    page,
    limit,
    handlePageChange,
    handleLimitChange,
    searchFieldRef,
    filters,
    handleFiltersChange,
    handleClearFilters,
    handlePropertyStatus,
  } = useMyProperties();

  const totalPages = total ? Math.ceil(total / limit) : 1;

  const tabItems = [
    { label: "Active", value: "active", content: null },
    { label: "In-Active", value: "inactive", content: null },
  ];

  const handleApplyFiltersAndClose = () => {
    startTransition(() => {
      // Apply filters is now handled internally by the filter state
      setIsFilterSidebarOpen(false);
    });
  };

  const handleClearFiltersAndClose = () => {
    startTransition(() => {
      handleClearFilters();
      setIsFilterSidebarOpen(false);
    });
  };

  const handleTabChangeWithTransition = (value: string) => {
    startTransition(() => {
      handleTabChange(value);
    });
  };

  // Check if any filters are active (excluding tab-specific filters)
  const hasActiveFilters = Boolean(
    filters.q ||
      filters.status ||
      filters.property_type ||
      filters.rental_type ||
      filters.city ||
      filters.availability_date ||
      filters.unit_count_min ||
      filters.unit_count_max
  );

  // Create skeleton array for loading state
  const skeletonArray = Array.from({ length: 8 }, (_, index) => index);

  // Determine what to show based on API state
  const isLoading = isApiPending || isPending;

  // Only show NoProperty if we've loaded data, have no active filters, and confirmed there are no properties at all
  // This prevents showing NoProperty when filters simply return no results
  const shouldShowNoProperty =
    hasDataLoaded &&
    !isApiPending &&
    !isPending &&
    !hasActiveFilters &&
    properties.length === 0 &&
    total === 0;

  return (
    <React.Fragment>
      {isAddPropertyModalOpen && (
        <SelectPropertyTypeModal
          isOpen={isAddPropertyModalOpen}
          onClose={() => setIsAddPropertyModalOpen(false)}
        />
      )}

      {isActiveInactiveModalOpen && selectedPropertyStatus === "active" && (
        <ActiveInactiveModal
          isOpen={isActiveInactiveModalOpen}
          onClose={() => setIsActiveInactiveModalOpen(false)}
          title="Are you sure you want to mark this property as Inactive?  It will no longer be visible to tenants."
          actions={[
            {
              text: "No, cancel",
              onClick: () => {
                setIsActiveInactiveModalOpen(false);
              },
              variant: "outline",
            },
            {
              text: "Yes, I'm sure",
              onClick: () => {
                handlePropertyStatus(selectedPropertyId, "inactive");
                setIsActiveInactiveModalOpen(false);
              },
            },
          ]}
        />
      )}
      <div>
        {isFilterSidebarOpen && (
          <PropertyFilterSidebar
            isOpen={isFilterSidebarOpen}
            onClose={() => setIsFilterSidebarOpen(false)}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFiltersAndClose}
            onClearFilters={handleClearFiltersAndClose}
          />
        )}
        {/* breadcrum */}
        <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
          <HomeIcon />
          <ChevronRight size={14} />
          <span>Dashboard</span>
          <ChevronRight size={14} />
          <span>Properties</span>
        </div>

        {/* Header */}
        <div className="flex lg:flex-nowrap flex-wrap mt-4 justify-between gap-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Properties
            </h1>
            <p className="text-gray-600">
              Central hub for property management and unit details.
            </p>
          </div>

          {/* actions */}
          <div className="flex lg:flex-nowrap flex-wrap items-center gap-2">
            <CustomSearchField
              ref={searchFieldRef}
              onChange={handleSearchFilter}
            />
            <Button
              variant="outline"
              size="sm"
              className="px-3 h-10 border-gray-200 text-gray-800 font-semibold hover:border-gray-100 bg-transparent"
              onClick={() => setIsFilterSidebarOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 bg-primary-500 text-white text-xs rounded-full w-2 h-2" />
              )}
            </Button>
            <Button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Plus size={18} className="mr-2" /> Add New Property
            </Button>
          </div>
        </div>

        {/* Active/In-Active Tabs */}
        <div className="mt-6">
          <GenericTabs
            tabs={tabItems}
            defaultValue={selectedTab}
            onValueChange={handleTabChangeWithTransition}
            className="w-full"
          />
        </div>

        {/* Property Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Show skeleton cards during loading
            skeletonArray.map((index) => <PropertyCardSkeleton key={index} />)
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              Error loading properties.
            </div>
          ) : properties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                No {selectedTab.toLowerCase()} properties found.
              </div>
              <div className="text-gray-400 text-sm">
                Try switching to the other tab or adjusting your search
                criteria.
              </div>
            </div>
          ) : (
            properties.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                selectedTab={selectedTab}
                setIsActiveInactiveModalOpen={setIsActiveInactiveModalOpen}
                setSelectedPropertyId={setSelectedPropertyId}
                setSelectedPropertyStatus={setSelectedPropertyStatus}
                handlePropertyStatus={handlePropertyStatus}
              />
            ))
          )}
        </div>

        {/* Pagination - Only show when not loading and has data */}
        {!isLoading && properties && properties?.length > 0 && (
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => startTransition(() => handlePageChange(1))}
              disabled={page === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                startTransition(() => handlePageChange(Math.max(1, page - 1)))
              }
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
                      onClick={() =>
                        startTransition(() => handlePageChange(pageNum))
                      }
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
                    onClick={() => startTransition(() => handlePageChange(1))}
                    className={`h-8 px-3 ${page === 1 ? "bg-primary-200 text-primary-700" : ""}`}
                  >
                    1
                  </Button>
                  {page > 3 && <span className="px-2 text-gray-500">...</span>}
                  {page > 2 && page < totalPages - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        startTransition(() => handlePageChange(page - 1))
                      }
                      className="h-8 px-3"
                    >
                      {page - 1}
                    </Button>
                  )}
                  {page !== 1 && page !== totalPages && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        startTransition(() => handlePageChange(page))
                      }
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
                      onClick={() =>
                        startTransition(() => handlePageChange(page + 1))
                      }
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
                    onClick={() =>
                      startTransition(() => handlePageChange(totalPages))
                    }
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
              onClick={() =>
                startTransition(() =>
                  handlePageChange(Math.min(totalPages, page + 1))
                )
              }
              disabled={page === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                startTransition(() => handlePageChange(totalPages))
              }
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

export default MyPropertiesComponent;

const PropertyCard = ({
  property,
  selectedTab,
  setIsActiveInactiveModalOpen,
  setSelectedPropertyId,
  setSelectedPropertyStatus,
  handlePropertyStatus,
}: {
  property: Property;
  selectedTab: string;
  setIsActiveInactiveModalOpen: (isOpen: boolean) => void;
  setSelectedPropertyId: (id: number) => void;
  setSelectedPropertyStatus: (status: "active" | "inactive") => void;
  handlePropertyStatus: (
    id: number | null,
    status: "active" | "inactive"
  ) => void;
}) => {
  const router = useRouter();

  const thumbnail =
    property.photos?.[0]?.photo || "https://placehold.co/400x200?text=No+Image";

  const handleEditProperty = () => {
    router.push(
      `/my-properties/add-property/${property.property_type}?edit=true&id=${property.id}`
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-3 flex flex-col relative transition hover:shadow-md">
      <div className="relative w-full h-44 overflow-hidden">
        <Image
          fill
          priority
          src={thumbnail}
          alt={property.name}
          className="rounded-xl rounded-b-none object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="flex-1 flex flex-col gap-1 px-1 pt-3 pb-2">
        <div className="font-semibold relative md:text-xl text-lg text-gray-900 mb-1 flex items-center justify-between">
          {property?.name?.length > 20
            ? property?.name?.slice(0, 20) + "..."
            : property?.name}

          {/* More menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DropdownMenuDefaultTrigger aria-label="Open property menu">
                <MoreVertical size={18} className="text-gray-500" />
              </DropdownMenuDefaultTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border-none"
            >
              <DropdownMenuItem>Transfer Ownership</DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditProperty}>
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSelectedPropertyId(property.id);
                  setSelectedPropertyStatus(
                    selectedTab as "active" | "inactive"
                  ); // active or inactive

                  if (selectedTab === "active") {
                    // Show confirmation modal before inactivating
                    setIsActiveInactiveModalOpen(true);
                  } else {
                    // Directly activate property without confirmation
                    handlePropertyStatus(property.id, "active");
                  }
                }}
              >
                {selectedTab === "inactive" ? "Active" : "In-Active"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex text-gray-500 text-xs mb-1 gap-1">
          <MapPin size={16} className="text-primary-500" />
          <span className="text-xs text-gray-400 mb-1">
            {property.street_address} {property.city}, {property.state}{" "}
            {property.zip_code}
          </span>
        </div>

        {/* number of units */}
        {property?.property_type !== "single_family_home" && (
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="flex items-center text-gray-400 text-xs gap-1">
              <UnitHomeIcon className="text-gray-400" />{" "}
              {property?.property_type === "university_housing"
                ? "Number of rooms"
                : "Number of units"}
            </span>
            <span className=" text-gray-700 text-xs font-semibold px-3 py-1 rounded-full ml-1">
              {property.number_of_units}
            </span>
          </div>
        )}

        {property?.property_type === "single_family_home" && (
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="flex items-center text-gray-400 text-xs gap-1">
              <BadgeCheck size={16} className="text-gray-400" /> Status
            </span>
            <span className="bg-primary-200 text-primary-800 text-xs font-semibold px-3 py-1 rounded-full ml-1">
              {property.status === "vacant" ? "Vacant" : "Occupied"}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="flex items-center text-gray-400 text-xs gap-1">
            <PropertyTypeIcon className="text-gray-400" /> Property Type
          </span>
          <span className="text-gray-700 text-xs font-medium ml-1">
            {formatText(property.property_type)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          {property?.rent && (
            <span className="md:text-xl text-lg font-bold text-gray-900">
              $ {property.rent}
            </span>
          )}
          <Link
            href={`/my-properties/property-detail/${property.id}?propertyType=${property.property_type}`}
            className="text-primary-600 ml-auto font-semibold flex items-center gap-1 hover:underline md:text-sm text-xs"
          >
            View details
            <ArrowPointerIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

function NoProperty({
  setIsAddPropertyModalOpen,
}: {
  setIsAddPropertyModalOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className=" bg-white text-white p-8 ">
      <div className="flex flex-col items-center justify-center py-20">
        <Card className="bg-white border-0 shadow-none">
          <CardContent className="flex flex-col items-center">
            <EmtpyIcon />
            <p className="text-black text-center mb-6 max-w-md text-lg mt-8">
              No Property Available Yet
            </p>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Currently, no property are available. For the new property, please
              click on the button mentioned below.
            </p>
            <Button
              className="bg-primary-600 hover:bg-primary-700 text-white"
              onClick={() => {
                setIsAddPropertyModalOpen(true);
              }}
            >
              Add New Property
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
