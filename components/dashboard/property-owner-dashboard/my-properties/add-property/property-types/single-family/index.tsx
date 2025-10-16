import React from "react";

import { usePropertyStore } from "@/lib/stores/use-property-store";

import Amenities from "../../common/amenities";
import CostFee from "../../common/cost-fee";
import OwnerInfo from "../../common/owner-info";
import PropertyInfoForm from "../../common/property-info-form";
import RentDetails from "../../common/rental-detail";
import AddDocument from "./steps/add-document";
import ListingInfo from "./steps/listing-info";

const AddSingleFamily = () => {
  const { currentStep } = usePropertyStore();

  const renderStepComponent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <PropertyInfoForm
            pageSaved={1}
            nextCurrentStep={2}
            stepToMarkComplete={1}
          />
        );
      case 2:
        return <ListingInfo />;
      case 3:
        return (
          <RentDetails
            pageSaved={3}
            nextCurrentStep={4}
            stepToMarkComplete={3}
          />
        );
      case 4:
        return (
          <Amenities pageSaved={4} nextCurrentStep={5} stepToMarkComplete={4} />
        );
      case 5:
        return (
          <CostFee pageSaved={5} nextCurrentStep={6} stepToMarkComplete={5} />
        );
      case 6:
        return (
          <OwnerInfo pageSaved={6} nextCurrentStep={7} stepToMarkComplete={6} />
        );
      case 7:
        return <AddDocument pageSaved={7} />;
      default:
        return (
          <div className="text-red-500">
            Error: No component found for step {step} for Single-Family
            property.
          </div>
        );
    }
  };

  return renderStepComponent(currentStep);
};

export default AddSingleFamily;
