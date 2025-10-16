import React from "react";

import type { PropertyType } from "../config/property-steps";
import AddBuildingUnit from "./property-types/building-unit";
import AddMultiFamily from "./property-types/multi-family";
import AddSeniorLiving from "./property-types/senior-living";
import AddSingleFamily from "./property-types/single-family";
import AddStudentHousing from "./property-types/student-housing";
import AddUniversityHousing from "./property-types/university_housing";

const AddPropertyComponent = ({
  propertyType,
}: {
  propertyType: PropertyType;
}) => {
  const ComponentMap: Record<PropertyType, React.FC<{}> | null> = {
    single_family_home: AddSingleFamily,
    multi_family: AddMultiFamily,
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

export default AddPropertyComponent;
