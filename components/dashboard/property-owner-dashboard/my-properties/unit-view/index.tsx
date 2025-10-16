"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

import AdditionalCostFee from "../property-view/additional-cost-fee";
import AssignTenantCard from "../property-view/assign-tenant-card";
import DocumentsTable from "../property-view/document-table";
import Tabs from "../property-view/tabs";
import PropertyUnitListing from "./property-unit-listing";
import PropertyUnitMetrics from "./property-unit-metrics";
import UnitAvailabilityViewDetail from "./unit-availability-view-detail";
import useUnitView from "./use-unit-view";

const PropertyUnitDetail = () => {
  const {
    data,
    isPending,
    error,
    activeTab,
    setActiveTab,
    propertyType,
    flatAmenities,
    unitRentalDetails,
    additionalCostFeeData,
    updatingStatus,
    handlePropertyUnitStatus,
    unitId,
    currentPropertyStatus,
    handleUnitEdit,
  } = useUnitView();

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

  const renderAmenitiesButtons = () => (
    <div className="flex flex-wrap gap-2">
      {flatAmenities?.map((amenity, index) => (
        <Button
          key={amenity.id || index}
          className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-100 capitalize mb-2"
        >
          {amenity?.name}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="w-full  mx-auto">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Overview" && (
        <div className="w-full  mx-auto">
          <div className="w-full flex flex-col sm:flex-row gap-4 mb-6">
            <h2 className="w-full font-semibold text-center sm:text-start text-lg sm:text-2xl leading-8">
              {propertyType === "university_housing"
                ? "Room Overview & Metrics"
                : "Unit Overview & Metrics"}
            </h2>
            <div className="w-full flex items-center justify-end flex-wrap gap-4">
              <Button
                className="bg-white border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-100"
                onClick={() =>
                  handlePropertyUnitStatus(
                    parseInt(unitId as any),
                    currentPropertyStatus ? "inactive" : "active"
                  )
                }
                disabled={updatingStatus}
              >
                {currentPropertyStatus ? "In-Active" : "Active"}
              </Button>
              <Button
                className="bg-primary-600 text-white hover:bg-primary-700"
                onClick={() => handleUnitEdit(unitId)}
              >
                {propertyType === "university_housing"
                  ? "Edit Room"
                  : "Edit Unit"}
              </Button>
            </div>
          </div>
          <PropertyUnitMetrics isUnit />

          <PropertyUnitListing data={data} />

          {unitRentalDetails?.rental_details?.rental_type === "short_term" && (
            <UnitAvailabilityViewDetail
              heading={
                propertyType === "university_housing"
                  ? "Room Availability"
                  : "Unit Availability"
              }
            />
          )}

          {flatAmenities?.length > 0 && (
            <div className="w-full max-w-container py-6">
              <h3 className="text-xl leading-7 font-semibold mb-4">
                Amenities
              </h3>
              <div className="flex gap-4">{renderAmenitiesButtons()}</div>
            </div>
          )}

          {/* <AssignTenantCard data={data?.data?.rental_details} /> */}
          {unitRentalDetails?.rental_details?.assigned_tenant && (
            <AssignTenantCard data={unitRentalDetails?.rental_details} />
          )}

          {additionalCostFeeData?.length > 0 && (
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

export default PropertyUnitDetail;
