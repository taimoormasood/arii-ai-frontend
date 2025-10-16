import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

import { useGetPropertyDetail } from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";

import type { UnitPropertyType } from "../config/unit-steps";
import AddBuildingUnit from "./property-types/building-unit";
import AddMultiFamilyUnit from "./property-types/multi-family";
import AddSeniorLiving from "./property-types/senior-living";
import AddStudentHousing from "./property-types/student-housing";
import AddUniversityHousing from "./property-types/university_housing";

const AddUnitComponent = ({
  propertyType,
}: {
  propertyType: UnitPropertyType;
}) => {
  const ComponentMap: Record<UnitPropertyType, React.FC<{}> | null> = {
    multi_family: AddMultiFamilyUnit,
    student_housing: AddStudentHousing,
    apartment_unit: AddBuildingUnit,
    senior_living: AddSeniorLiving,
    university_housing: AddUniversityHousing,
  };

  const CurrentComponent = ComponentMap[propertyType];

  if (!CurrentComponent) {
    return (
      <>
        <div>
          <p>Error: No component found for property type: {propertyType}</p>
          {/* Optionally, render a default fallback component */}
          {/* <AddProperty /> */}
        </div>
      </>
    );
  }

  return <CurrentComponent />;
};

export default AddUnitComponent;
