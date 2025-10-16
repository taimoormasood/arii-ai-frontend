export type UnitPropertyType =
  | "multi_family"
  | "student_housing"
  | "apartment_unit"
  | "senior_living"
  | "university_housing";

export interface PropertyStep {
  id: number;
  key: string;
  label: string;
  required: boolean;
  editable: boolean;
  component: string;
}

export const unitStepsConfig: Record<UnitPropertyType, PropertyStep[]> = {
  multi_family: [
    {
      id: 1,
      key: "unit-info",
      label: "Unit Info",
      required: true,
      editable: true,
      component: "UnitInfo",
    },
    {
      id: 2,
      key: "rent-details",
      label: "Rent Details",
      required: true,
      editable: true,
      component: "RentDetails",
    },
    {
      id: 3,
      key: "amenities",
      label: "Amenities",
      required: false,
      editable: true,
      component: "AmenitiesForm",
    },

    {
      id: 4,
      key: "cost-fee",
      label: "Cost & Fee",
      required: false,
      editable: true,
      component: "CostFee",
    },

    {
      id: 5,
      key: "documents",
      label: "Documents",
      required: false,
      editable: true,
      component: "DocumentsForm",
    },
  ],
  student_housing: [
    {
      id: 1,
      key: "unit-info",
      label: "Unit Info",
      required: true,
      editable: true,
      component: "UnitInfo",
    },
    {
      id: 2,
      key: "rent-details",
      label: "Rent Details",
      required: true,
      editable: true,
      component: "RentDetails",
    },
    {
      id: 3,
      key: "amenities",
      label: "Amenities",
      required: false,
      editable: true,
      component: "AmenitiesForm",
    },

    {
      id: 4,
      key: "cost-fee",
      label: "Cost & Fee",
      required: false,
      editable: true,
      component: "CostFee",
    },

    {
      id: 5,
      key: "documents",
      label: "Documents",
      required: false,
      editable: true,
      component: "DocumentsForm",
    },
  ],
  apartment_unit: [
    {
      id: 1,
      key: "unit-info",
      label: "Unit Info",
      required: true,
      editable: true,
      component: "UnitInfo",
    },
    {
      id: 2,
      key: "rent-details",
      label: "Rent Details",
      required: true,
      editable: true,
      component: "RentDetails",
    },
    {
      id: 3,
      key: "amenities",
      label: "Amenities",
      required: false,
      editable: true,
      component: "AmenitiesForm",
    },

    {
      id: 4,
      key: "cost-fee",
      label: "Cost & Fee",
      required: false,
      editable: true,
      component: "CostFee",
    },

    {
      id: 5,
      key: "documents",
      label: "Documents",
      required: false,
      editable: true,
      component: "DocumentsForm",
    },
  ],
  senior_living: [
    {
      id: 1,
      key: "unit-info",
      label: "Unit Info",
      required: true,
      editable: true,
      component: "UnitInfo",
    },
    {
      id: 2,
      key: "rent-details",
      label: "Rent Details",
      required: true,
      editable: true,
      component: "RentDetails",
    },
    {
      id: 3,
      key: "amenities",
      label: "Amenities",
      required: false,
      editable: true,
      component: "AmenitiesForm",
    },

    {
      id: 4,
      key: "cost-fee",
      label: "Cost & Fee",
      required: false,
      editable: true,
      component: "CostFee",
    },

    {
      id: 5,
      key: "documents",
      label: "Documents",
      required: false,
      editable: true,
      component: "DocumentsForm",
    },
  ],
  university_housing: [
    {
      id: 1,
      key: "room-details",
      label: "Room Details",
      required: true,
      editable: true,
      component: "RoomDetails",
    },
    {
      id: 2,
      key: "rent-details",
      label: "Rent Details",
      required: true,
      editable: true,
      component: "RentDetails",
    },
    {
      id: 3,
      key: "amenities",
      label: "Amenities",
      required: false,
      editable: true,
      component: "AmenitiesForm",
    },
    {
      id: 4,
      key: "cost-fee",
      label: "Cost & Fee",
      required: false,
      editable: true,
      component: "CostFee",
    },
    {
      id: 5,
      key: "documents",
      label: "Documents",
      required: false,
      editable: true,
      component: "DocumentsForm",
    },
  ],
};

export const propertyTypeLabels: Record<UnitPropertyType, string> = {
  multi_family: "Multi-Family",
  student_housing: "Student Housing",
  apartment_unit: "Apartment Building",
  senior_living: "Senior Living",
  university_housing: "University Housing",
};
