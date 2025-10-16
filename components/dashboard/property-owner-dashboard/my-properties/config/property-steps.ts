export type PropertyType =
  | "single_family_home"
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

export const propertyStepsConfig: Record<PropertyType, PropertyStep[]> = {
  single_family_home: [
    {
      id: 1,
      key: "property-info",
      label: "Property Info",
      required: true,
      editable: false,
      component: "PropertyInfoForm",
    },
    {
      id: 2,
      key: "listing-details",
      label: "Listing Details",
      required: true,
      editable: true,
      component: "ListingDetailsForm",
    },
    {
      id: 3,
      key: "rent-lease",
      label: "Rent & Lease",
      required: true,
      editable: true,
      component: "RentLeaseForm",
    },
    {
      id: 4,
      key: "amenities",
      label: "Amenities",
      required: false,
      editable: true,
      component: "AmenitiesForm",
    },
    {
      id: 5,
      key: "cost-fee",
      label: "Cost & Fee",
      required: false,
      editable: true,
      component: "CostFee",
    },
    {
      id: 6,
      key: "owner-details",
      label: "Investor Details",
      required: true,
      editable: true,
      component: "OwnerDetailsForm",
    },
    {
      id: 7,
      key: "documents",
      label: "Documents",
      required: false,
      editable: true,
      component: "DocumentsForm",
    },
  ],
  multi_family: [
    {
      id: 1,
      key: "property-info",
      label: "Property Info",
      required: true,
      editable: false,
      component: "PropertyInfoForm",
    },
    {
      id: 2,
      key: "listing-details",
      label: "Listing Info",
      required: true,
      editable: true,
      component: "ListingDetailsForm",
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
      key: "owner-details",
      label: "Investor Details",
      required: true,
      editable: true,
      component: "OwnerDetailsForm",
    },
    {
      id: 6,
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
      key: "property-info",
      label: "Property Info",
      required: true,
      editable: false,
      component: "PropertyInfoForm",
    },
    {
      id: 2,
      key: "listing-details",
      label: "Listing Info",
      required: true,
      editable: true,
      component: "ListingDetailsForm",
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
      key: "owner-details",
      label: "Investor Details",
      required: true,
      editable: true,
      component: "OwnerDetailsForm",
    },
    {
      id: 6,
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
      key: "property-info",
      label: "Property Info",
      required: true,
      editable: false,
      component: "PropertyInfoForm",
    },
    {
      id: 2,
      key: "listing-details",
      label: "Listing Info",
      required: true,
      editable: true,
      component: "ListingDetailsForm",
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
      key: "owner-details",
      label: "Investor Details",
      required: true,
      editable: true,
      component: "OwnerDetailsForm",
    },
    {
      id: 6,
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
      key: "property-info",
      label: "Property Info",
      required: true,
      editable: false,
      component: "PropertyInfoForm",
    },
    {
      id: 2,
      key: "listing-details",
      label: "Listing Info",
      required: true,
      editable: true,
      component: "ListingDetailsForm",
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
      key: "owner-details",
      label: "Investor Details",
      required: true,
      editable: true,
      component: "OwnerDetailsForm",
    },
    {
      id: 6,
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
      key: "property-info",
      label: "Property Info",
      required: true,
      editable: false,
      component: "PropertyInfoForm",
    },
    {
      id: 2,
      key: "listing-details",
      label: "Listing Info",
      required: true,
      editable: true,
      component: "ListingDetailsForm",
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
      key: "owner-details",
      label: "Investor Details",
      required: true,
      editable: true,
      component: "OwnerDetailsForm",
    },
    {
      id: 6,
      key: "documents",
      label: "Documents",
      required: false,
      editable: true,
      component: "DocumentsForm",
    },
  ],
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  single_family_home: "Single-Family Home",
  multi_family: "Multi-Family",
  student_housing: "Student Housing",
  apartment_unit: "Apartment Building",
  senior_living: "Senior Living",
  university_housing: "University Housing",
};
