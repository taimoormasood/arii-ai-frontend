import React from "react";

import { usePropertyStore } from "@/lib/stores/use-property-store";

import AddDocument from "../../../add-property/common/add-document";
import Amenities from "../../../add-property/common/amenities";
import CostFee from "../../../add-property/common/cost-fee";
import RentDetails from "../../../add-property/common/rental-detail";
import UnitInfo from "../../common/unit-info";

const AddStudentHousing = () => {
  const { currentUnitStep } = usePropertyStore();

  const renderStepComponent = (step: number) => {
    switch (step) {
      case 1:
        return <UnitInfo />;
      case 2:
        return (
          <RentDetails
            pageSaved={2}
            nextCurrentStep={3}
            stepToMarkComplete={2}
            isUnit
          />
        );
      case 3:
        return (
          <Amenities
            pageSaved={3}
            nextCurrentStep={4}
            stepToMarkComplete={3}
            isUnit
          />
        );
      case 4:
        return (
          <CostFee
            pageSaved={4}
            nextCurrentStep={5}
            stepToMarkComplete={4}
            isUnit
          />
        );
      case 5:
        return <AddDocument pageSaved={5} isUnit />;
    }

    return null;
  };

  const CurrentStepComponent = renderStepComponent(currentUnitStep);

  if (!CurrentStepComponent) {
    return (
      <div className="text-red-500">
        Error: No component found for step {currentUnitStep} for Multi Family
        property.
      </div>
    );
  }

  return renderStepComponent(currentUnitStep);
};

export default AddStudentHousing;
