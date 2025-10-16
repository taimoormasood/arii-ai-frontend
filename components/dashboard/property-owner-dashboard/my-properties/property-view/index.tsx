"use client";

import { on } from "events";
import { ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { EmtpyIcon, HomeIcon } from "@/assets/icons";
import LinkSquareIcon from "@/assets/icons/link-square-icon";
import WhitePlusIcon from "@/assets/icons/white-plus-icon";
import DocumentsTable from "@/components/dashboard/property-owner-dashboard/my-properties/property-view/document-table";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { convertMinutesToHours, formatText } from "@/helpers";
import { usePropertyStore } from "@/lib/stores/use-property-store";

import { UnitConfirmationModal } from "../add-property/property-types/common/unit-confirmation-modal";
import AdditionalCostFee from "./additional-cost-fee";
import AssignTenantCard from "./assign-tenant-card";
import InvestorCard from "./investor-card";
import PropertyAvailabilityViewDetail from "./property-availability-view-detail";
import PropertyCard from "./property-card";
import PropertyListing from "./property-listing";
import PropertyMetrics from "./property-metrics";
import Tabs from "./tabs";
import usePropertyView from "./use-property-view";

const PropertyDetailView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const {
    isPending,
    error,
    listingInfo,
    flatAmenities,
    flatPets,
    careServices,
    activeTab,
    setActiveTab,
    propertyId,
    propertyType,
    data,
    propertyListingData,
    ownersData,
    additionalCostFeeData,
    handlePropertyStatus,
    updatingStatus,
    currentPropertyStatus,
    activeUnits,
    handleUnitStatus,
    handleUnitEdit,
    hasUnits,
    hasActiveUnits,
  } = usePropertyView();

  const { clearAllUnitFormData, setCurrentUnitStep, updateStepData } =
    usePropertyStore();

  const numberOfUnits = data?.data?.listing_info?.number_of_units || 0;
  const totalUnit = data?.data?.units?.length || 0;

  const handleAddNewUnits = async () => {
    setModalOpen(true);
    clearAllUnitFormData();
    setCurrentUnitStep(1);
  };

  const handleEditProperty = () => {
    router.push(
      `/my-properties/add-property/${propertyType}?edit=true&id=${propertyId}`
    );
  };

  if (isPending) {
    return (
      <div className="min-h-full min-w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error loading property details.
      </div>
    );
  }

  const renderPetButtons = () =>
    flatPets.map((pet: string, index: number) => (
      <Button
        key={index + 1}
        className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-100 capitalize md:text-sm text-xs"
      >
        {pet}
      </Button>
    ));

  const renderAmenitiesButtons = () => (
    <div className="flex flex-wrap gap-2">
      {flatAmenities?.map((amenity, index) => (
        <Button
          key={amenity.id || index + 1}
          className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-100 capitalize mb-2 md:text-sm text-xs"
        >
          {amenity?.name}
        </Button>
      ))}
    </div>
  );

  const renderCareServices = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {careServices?.map((service, index) => (
          <Button
            key={service || index + 1}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-100 capitalize mb-2"
          >
            {formatText(service)}
          </Button>
        ))}
      </div>
    );
  };

  const SlotCard = ({ day, time }: { day: string; time: string }) => (
    <div className="p-2.5 bg-white rounded-lg outline outline-offset-[-1px] outline-gray-100 inline-flex">
      <div className="text-gray-800 text-sm font-normal leading-tight capitalize">
        {day} <span>({time})</span>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto">
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

      {/* breadcrum */}
      <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
        <HomeIcon />
        <ChevronRight size={14} />
        <span
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </span>
        <ChevronRight size={14} />
        <span
          className="cursor-pointer"
          onClick={() => router.push("/my-properties")}
        >
          Properties
        </span>
        <ChevronRight size={14} />
        <span
          className="cursor-pointer"
          onClick={() => router.push("/property-detail")}
        >
          Property Details
        </span>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Overview" && (
        <div className="w-full mx-auto">
          <div className="w-full flex flex-col sm:flex-row gap-4 mb-6">
            <h2 className="w-full font-semibold text-center sm:text-start text-lg sm:text-2xl leading-8">
              Property Overview & Metrics
            </h2>
            <div className="w-full flex items-center justify-end flex-wrap gap-4">
              <Button
                className="bg-white border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-100"
                onClick={() =>
                  handlePropertyStatus(
                    propertyId,
                    currentPropertyStatus ? "inactive" : "active"
                  )
                }
                disabled={updatingStatus}
              >
                {currentPropertyStatus ? "In-Active" : "Active"}
              </Button>
              <Button
                onClick={handleEditProperty}
                className="bg-primary-600 text-white hover:bg-primary-700"
              >
                Edit Property
              </Button>
            </div>
          </div>

          <PropertyMetrics />

          <PropertyListing
            detail={propertyListingData?.detail}
            listing_info={propertyListingData?.listing_info}
            rental_details={propertyListingData?.rental_details}
          />

          {hasUnits && (
            <div className="w-full mx-auto my-6">
              {/* Section Header */}
              <div className="w-full flex flex-col sm:flex-row gap-4 my-6">
                <h2 className="w-full font-semibold text-center sm:text-start text-lg sm:text-2xl leading-8">
                  {propertyType === "university_housing"
                    ? "Rooms Overview"
                    : "Units Overview"}
                </h2>
                <div className="w-full flex items-center justify-end flex-wrap gap-4">
                  {/* <Link href={`/my-properties/add-unit/${propertyType}`}> */}
                  <Button
                    onClick={handleAddNewUnits}
                    disabled={numberOfUnits === totalUnit}
                    className="bg-primary-600 border-none rounded-lg text-white hover:bg-primary-700"
                  >
                    <WhitePlusIcon className="h-5 w-5" />
                    {propertyType === "university_housing"
                      ? "Add New Room"
                      : "Add New Unit"}
                  </Button>
                  {/* </Link> */}

                  <Link
                    // href={`/my-properties/unit-view/${propertyId}?propertyType=${propertyType}&buttonDisabled=${buttonDisabled}`}
                    href={`/my-properties/unit-view/${propertyId}?propertyType=${propertyType}`}
                  >
                    <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-lg">
                      {propertyType === "university_housing"
                        ? "View All Rooms"
                        : "View All Units"}
                      <LinkSquareIcon className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Map each unit into a card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(hasActiveUnits ? activeUnits : data?.data?.units)?.map(
                  (unit: any) => (
                    <PropertyCard
                      key={unit?.detail?.id}
                      unitData={unit}
                      actions={[
                        {
                          text: "Edit",
                          onClick: () => handleUnitEdit(unit?.detail?.id),
                        },
                        {
                          text: "In-Active",
                          onClick: () =>
                            handleUnitStatus(unit?.detail?.id, "inactive"),
                        },
                      ]}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {data?.data?.units?.length === 0 &&
            propertyType !== "single_family_home" && (
              <div className="w-full mx-auto my-16 space-y-4 flex flex-col items-center justify-center">
                <EmtpyIcon />
                <h4 className="text-lg font-medium">No Units Available Yet</h4>
                <Link href={`/my-properties/add-unit/${propertyType}`}>
                  {" "}
                  <Button
                    onClick={handleAddNewUnits}
                    className="bg-primary-600 border-none rounded-lg text-white hover:bg-primary-700"
                  >
                    <WhitePlusIcon className="h-5 w-5" />
                    Add New Unit
                  </Button>
                </Link>
              </div>
            )}

          {propertyListingData?.rental_details?.rental_type ===
            "short_term" && <PropertyAvailabilityViewDetail />}

          {listingInfo?.pets_allowed && (
            <div className="w-full md:py-6 py-2">
              <h3 className="md:text-xl text-lg leading-7 font-semibold mb-2">
                Pets Allowed
              </h3>
              <div className="flex gap-4">{renderPetButtons()}</div>
            </div>
          )}

          <div className="w-full max-w-container md:py-6 py-2">
            <h3 className="md:text-xl text-lg leading-7 font-semibold mb-2">
              Amenities
            </h3>
            <div className="flex gap-4">{renderAmenitiesButtons()}</div>
          </div>
          {propertyType === "senior_living" && (
            <div className="w-full max-w-container md:py-6 py-2">
              <h3 className="md:text-xl text-lg leading-7 font-semibold mb-2">
                Care Services
              </h3>
              <div className="flex gap-4">{renderCareServices()}</div>
            </div>
          )}

          <div className="w-full md:py-6 py-2">
            <div className="flex justify-between flex-wrap items-center pb-4 gap-2">
              <div className="flex items-center">
                <h3 className="md:text-xl text-sm font-semibold">
                  Property Visiting Slots
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1"
                        type="button"
                      >
                        <Info className="h-4 w-4 text-gray-400" />
                        <span className="sr-only">Slot Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-3 border-none">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-medium">
                          These are the time slots when the property can be
                          shown to potential tenants.
                        </h4>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="bg-[#FFC107] text-black py-1.5 px-3.5 rounded-md">
                Duration per slot:{" "}
                {convertMinutesToHours(
                  listingInfo?.availability_duration ?? 0
                )}{" "}
              </p>
            </div>

            <div className="space-x-4 md:space-y-0 space-y-2">
              {listingInfo?.showing_availability &&
                Object.entries(listingInfo.showing_availability).map(
                  ([day, time], index) => (
                    <SlotCard key={index + 1} day={day} time={time as string} />
                  )
                )}
            </div>
          </div>

          {propertyListingData?.rental_details?.assigned_tenant && (
            <AssignTenantCard data={propertyListingData?.rental_details} />
          )}

          {data?.data?.owners && data.data.owners.length > 0 && (
            <InvestorCard data={ownersData} />
          )}

          {additionalCostFeeData.length > 0 && (
            <AdditionalCostFee data={additionalCostFeeData} />
          )}
        </div>
      )}

      {activeTab === "Documents" && (
        <div className="w-full mx-auto">
          <DocumentsTable />
        </div>
      )}
    </div>
  );
};

export default PropertyDetailView;
