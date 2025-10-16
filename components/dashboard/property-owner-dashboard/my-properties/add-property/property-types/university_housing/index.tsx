import React from "react";

import { usePropertyStore } from "@/lib/stores/use-property-store";

import AddDocument from "../../common/add-document";
import Amenities from "../../common/amenities";
import CostFee from "../../common/cost-fee";
import OwnerInfo from "../../common/owner-info";
import PropertyInfoForm from "../../common/property-info-form";
import ListingInfo from "./steps/listing-info";

const AddUniversityHousing = () => {
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
          <Amenities pageSaved={3} nextCurrentStep={4} stepToMarkComplete={3} />
        );
      case 4:
        return (
          <CostFee
            pageSaved={4}
            nextCurrentStep={5}
            stepToMarkComplete={4}
            isUniversityHousing={true}
          />
        );
      case 5:
        return (
          <OwnerInfo pageSaved={5} nextCurrentStep={6} stepToMarkComplete={5} />
        );
      case 6:
        return <AddDocument pageSaved={6} />;
      default:
        return null;
    }
  };

  const CurrentStepComponent = renderStepComponent(currentStep);

  if (!CurrentStepComponent) {
    return (
      <div className="text-red-500">
        Error: No component found for step {currentStep} for Single-Family
        property.
      </div>
    );
  }

  return CurrentStepComponent;
};

export default AddUniversityHousing;
