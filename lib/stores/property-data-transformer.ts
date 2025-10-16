import { propertyStepsConfig } from "@/components/dashboard/property-owner-dashboard/my-properties/config/property-steps";
import type { SinglePropertyView } from "@/services/properties/types";

import type {
  AmenitiesFormData,
  CostFeeFormData,
  DocumentsFormData,
  ListingDetailsFormData,
  OwnerDetailsFormData,
  PropertyFormData,
  PropertyInfoFormData,
  RentLeaseFormData,
} from "./types";

/**
 * Transform API response data into store format for editing properties
 */
export function transformPropertyDataForStore(
  apiData: SinglePropertyView
): PropertyFormData {
  const formData: PropertyFormData = {};

  // Transform property info
  if (apiData.detail) {
    formData.propertyInfo = transformPropertyInfo(apiData.detail);
  }

  // Transform listing details
  if (apiData.listing_info) {
    formData.listingDetails = transformListingDetails(
      apiData.listing_info,
      apiData.photos
    );
  }

  // Transform rent & lease details
  if (apiData.rental_details) {
    formData.rentLease = transformRentLease(apiData.rental_details);
  }

  // Transform amenities
  if (apiData.amenities) {
    formData.amenities = transformAmenities(apiData.amenities);
  }

  // Transform cost fees
  if (apiData.cost_fees && apiData.cost_fees.length > 0) {
    formData.costFee = transformCostFees(apiData.cost_fees, apiData.detail.id);
  }

  // Transform owner details
  if (apiData.owners && apiData.owners.length > 0) {
    formData.ownerDetails = transformOwnerDetails(apiData.owners);
  }

  // Transform documents (handle optional field since type definition is missing it)
  const documents = (apiData as any).documents;
  if (documents) {
    formData.documents = transformDocuments(documents, apiData.detail.id);
  }

  return formData;
}

function transformPropertyInfo(
  detail: SinglePropertyView["detail"]
): PropertyInfoFormData {
  return {
    id: detail.id,
    propertyName: detail.name,
    state: detail.state,
    city: detail.city,
    zipCode: detail.zip_code || undefined,
    streetAddress: detail.street_address,
  };
}

function transformListingDetails(
  listingInfo: SinglePropertyView["listing_info"],
  rootPhotos?: SinglePropertyView["photos"]
): ListingDetailsFormData {
  // Transform pet types array to match form structure
  const petTypes = listingInfo.pet_types || [];
  const standardPetTypes = ["cats", "dogs", "birds", "reptiles"];
  const standardPets = petTypes.filter((pet: string) =>
    standardPetTypes.includes(pet)
  );
  const customPets = petTypes.filter(
    (pet: string) => !standardPetTypes.includes(pet)
  );

  // Transform showing availability back to the form format
  const availability: {
    [day: string]: { startTime: string; endTime: string };
  } = {};

  if (listingInfo.showing_availability) {
    Object.entries(listingInfo.showing_availability).forEach(
      ([day, timeRange]) => {
        // Convert "9am-6pm" back to "9:00 AM - 6:00 PM" format
        const [startTime, endTime] = (timeRange as string).split("-");
        availability[day] = {
          startTime: formatTimeForForm(startTime),
          endTime: formatTimeForForm(endTime),
        };
      }
    );
  }

  // Convert photos from URLs to File objects (this is tricky since we can't recreate File objects)
  // For now, we'll store the photo URLs and handle this in the form component
  const propertyPhotos =
    Array.isArray(listingInfo.photos) && listingInfo.photos.length > 0
      ? listingInfo.photos.map((p: any) => p.photo)
      : [];

  // Store photo URLs separately for edit mode - check both locations
  const listingPhotos = listingInfo.photos?.map((photo) => photo.photo) || [];
  const rootPhotosUrls = rootPhotos?.map((photo) => photo.photo) || [];

  // Use whichever has photos, prioritizing listing_info photos
  const existingPhotoUrls =
    listingPhotos.length > 0 ? listingPhotos : rootPhotosUrls;

  return {
    listedBy: listingInfo.listed_by as
      | "owner_manager_not_live"
      | "owner_manager_live"
      | "agent_broker",
    totalBedrooms: listingInfo.total_bedrooms?.toString(),
    totalBathrooms: listingInfo.total_bathrooms?.toString(),
    totalUnits: listingInfo.number_of_units?.toString(),
    squareFootage: listingInfo.square_footage?.toString(),
    description: listingInfo.description,
    careServices: listingInfo.care_services || [],
    availability_duration: listingInfo.availability_duration,
    petsAllowed: listingInfo.pets_allowed,
    petTypes: standardPets,
    // customPets: customPets,
    customTags: [], // API doesn't seem to have custom tags
    availability,
    propertyPhotos,
    existingPhotoUrls, // Add existing photo URLs for edit mode
  };
}

function transformRentLease(
  rentalDetails: SinglePropertyView["rental_details"]
): RentLeaseFormData {
  return {
    property: rentalDetails.property,
    rentalType: rentalDetails.rental_type as any,
    rent: Number(rentalDetails.rent),
    assignedTenant: rentalDetails.assigned_tenant || undefined,
    securityDeposit: Number(rentalDetails.security_deposit),
    leaseStartDate: rentalDetails.lease_start_date || undefined,
    leaseEndDate: rentalDetails.lease_end_date || undefined,
    promoteSpecialOffer: rentalDetails.promote_special_offer || false,
    offerStartDate: rentalDetails.offer_start_date || undefined,
    offerEndDate: rentalDetails.offer_end_date || undefined,
    offerPercentage: rentalDetails.offer_percentage
      ? Number(rentalDetails.offer_percentage)
      : undefined,
  };
}

function transformAmenities(
  amenities: SinglePropertyView["amenities"]
): AmenitiesFormData {
  const transformed: AmenitiesFormData = {};

  Object.entries(amenities).forEach(([category, items]) => {
    if (category === "other_amenities") {
      // Handle other amenities - flatten the nested array structure
      const flattenedOtherAmenities = (items as string[][]).flat();
      transformed.other_amenities = flattenedOtherAmenities;
    } else {
      // Handle regular amenities
      transformed[category] = items as Array<{ id: number; name: string }>;
    }
  });

  return transformed;
}

function transformCostFees(
  costFees: SinglePropertyView["cost_fees"],
  propertyId: number
): CostFeeFormData {
  // Flatten all fees from all categories into a single array
  const transformedFees: any[] = [];

  costFees.forEach((categoryGroup: any) => {
    categoryGroup.fees.forEach((fee: any) => {
      transformedFees.push({
        id: fee.id, // Include the fee ID from the API response
        fee_name: fee.fee_name,
        payment_frequency: fee.payment_frequency,
        fee_amount: Number(fee.fee_amount),
        fee_type: fee.fee_type,
        is_required: fee.is_required,
        refundable_status: fee.refundable_status,
        category: categoryGroup.category_name, // Store the category for each fee
      });
    });
  });

  const result = {
    property: propertyId,
    category: costFees.map((cat: any) => cat.category_name),
    page_saved: 5, // This is the cost fee step
    fees: transformedFees,
  };

  return result;
}

function transformOwnerDetails(
  owners: SinglePropertyView["owners"]
): OwnerDetailsFormData {
  const transformed = {
    owners: owners.map((owner: any) => ({
      id: owner.id, // Include the id field for existing owners
      email: owner.email,
      ownershipPercentage: Number(owner.percentage),
      emergencyPerson: owner.emergency_person || undefined,
      emergencyPhone: owner.emergency_contact || undefined,
    })),
  };

  return transformed;
}

function transformDocuments(
  documents: any[],
  propertyId: number
): DocumentsFormData {
  // Since documents are files, we can't recreate them from URLs
  // We'll create a structure that represents the existing documents
  const documentTitles = documents.map((doc: any) => ({
    title: doc.title,
    document_type: doc.document_type,
    visibility: doc.visibility,
  }));

  return {
    property: propertyId,
    page_saved: 7, // This is the documents step
    documents: [], // No files to recreate
    data: {
      data: documentTitles,
    },
  };
}

/**
 * Helper function to convert time from API format (9am) to form format (9:00 AM)
 */
function formatTimeForForm(time: string): string {
  const cleanTime = time.toLowerCase().replace(/\s/g, "");
  const isPM = cleanTime.includes("pm");
  const timeNumber = parseInt(cleanTime.replace(/[ap]m/, ""));

  if (timeNumber === 12) {
    return isPM ? "12:00 PM" : "12:00 AM";
  }

  return `${timeNumber}:00 ${isPM ? "PM" : "AM"}`;
}

/**
 * Calculate which step to navigate to based on page_saved value and property status
 */
export function calculateCurrentStep(
  pageSaved: number,
  published: boolean
): number {
  // If page_saved is 0, start from step 1
  if (pageSaved === 0) {
    return 1;
  }

  // For active properties (published), always go to step 2 (listing info) when editing
  if (published) {
    return 2;
  }

  // For inactive properties, use the original logic
  // If all steps are complete (page_saved >= 7), navigate to step 1 for editing
  if (pageSaved >= 7) {
    return 1;
  }

  // Otherwise, navigate to the next incomplete step
  const nextStep = pageSaved + 1;

  return nextStep;
}

/**
 * Calculate completed steps based on page_saved value and published status
 */
export function calculateCompletedSteps(
  pageSaved: number,
  published?: boolean,
  propertyType?: string
): number[] {
  const completedSteps: number[] = [];

  // For published properties, mark all steps as completed to enable navigation to all steps
  if (published && propertyType) {
    // Get the actual steps for this property type from the imported configuration
    const steps =
      propertyStepsConfig[propertyType as keyof typeof propertyStepsConfig];
    const maxSteps = steps ? steps.length : 6; // fallback to 6 if config not found

    // This enables navigation to all steps for published properties
    for (let i = 1; i <= maxSteps; i++) {
      completedSteps.push(i);
    }

    return completedSteps;
  }

  for (let i = 1; i <= pageSaved; i++) {
    completedSteps.push(i);
  }

  return completedSteps;
}

/**
 * Transform API response data into store format for editing a unit
 */
export function transformUnitDataForStore(unitApiData: any): any {
  // The structure of unitApiData is similar to a property, but nested
  const unitFormData: any = {};

  // Transform unit info (detail)
  if (unitApiData.detail) {
    unitFormData.unitInfo = {
      id: unitApiData.detail.id,
      number: unitApiData.detail.number,
      type: unitApiData.detail.type,
      floorNumber: unitApiData.detail.floor_number,
      size: unitApiData.detail.size,
      bedrooms: unitApiData.detail.bedrooms,
      bathrooms: unitApiData.detail.bathrooms,
      property: unitApiData.detail.property,
      // Add more fields as needed
      unitPhotos: Array.isArray(unitApiData.detail.photos)
        ? unitApiData.detail.photos.map((p: any) => p.photo)
        : [],
    };
  }

  // Transform listing details
  if (unitApiData.listing_info) {
    unitFormData.listingDetails = transformListingDetails(
      unitApiData.listing_info
    );
  }

  // Transform rent & lease details
  if (unitApiData.rental_details) {
    unitFormData.rentLease = transformRentLease(unitApiData.rental_details);
  }

  // Transform amenities
  if (unitApiData.amenities) {
    unitFormData.amenities = transformAmenities(unitApiData.amenities);
  }

  // Transform cost fees
  if (unitApiData.cost_fees && unitApiData.cost_fees.length > 0) {
    unitFormData.costFee = transformCostFees(
      unitApiData.cost_fees,
      unitApiData.detail.id
    );
  }

  // Transform owner details
  if (unitApiData.owners && unitApiData.owners.length > 0) {
    unitFormData.ownerDetails = transformOwnerDetails(unitApiData.owners);
  }

  // Transform documents
  if (unitApiData.documents) {
    unitFormData.documents = transformDocuments(
      unitApiData.documents,
      unitApiData.detail.id
    );
  }

  return unitFormData;
}
