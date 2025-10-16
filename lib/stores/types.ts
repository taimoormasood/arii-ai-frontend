// property store
export interface PropertyInfoFormData {
  id: number;
  propertyName?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  streetAddress?: string;
}

export interface ListingDetailsFormData {
  listedBy: "owner_manager_not_live" | "owner_manager_live" | "agent_broker";
  totalBedrooms?: string;
  totalBathrooms?: string;
  totalUnits?: string;
  totalRooms?: string;
  occupancyType?: string;
  squareFootage?: string;
  availability_duration: number;
  description: string;
  careServices?: string[];
  petsAllowed: boolean;
  petTypes?: string[];
  other_pets?: string[];
  customTags?: string[];
  availability: {
    [day: string]: {
      startTime: string;
      endTime: string;
    };
  };
  propertyPhotos: File[];
  existingPhotoUrls?: string[]; // URLs of existing photos for edit mode
  existingPhotoIds?: number[]; // IDs of existing photos for API
}

export interface RentLeaseFormData {
  property?: number;
  rentalType:
    | "monthly_billing"
    | "semester_billing"
    | "short_term"
    | "long_term";
  rent: number;
  semester?: string;
  assignedTenant?: string;
  securityDeposit: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  promoteSpecialOffer?: boolean;
  offerStartDate?: string;
  offerEndDate?: string;
  offerPercentage?: number;
  pageSaved?: number;
}

export interface AmenityItem {
  id: number;
  name: string;
}

export interface AmenitiesFormData {
  other_amenities?: string[];
  [key: string]: Array<{ id: number; name: string }> | string[] | undefined;
}

export interface CostFeeFormData {
  property: number;
  category: string[];
  page_saved: number;
  fees: {
    fee_name: string;
    payment_frequency: string;
    fee_amount: number;
    fee_type: string;
    is_required: string;
    refundable_status: string;
  }[];
}

// Update your interfaces to match the array structure
export interface OwnerDetailsFormData {
  owners: {
    id?: number; // Add id field for existing owners
    email: string;
    ownershipPercentage: number;
    emergencyPerson?: string;
    emergencyPhone?: string;
  }[]; // Note the array notation
}

export interface DocumentsFormData {
  property: number;
  unit?: number;
  page_saved: number;
  documents: File[];
  data: {
    data: Array<{
      title: string;
      document_type: string;
      visibility: string;
    }>;
  };
}

// Main form data structure organized by semantic keys
export interface PropertyFormData {
  propertyInfo?: PropertyInfoFormData;
  listingDetails?: ListingDetailsFormData;
  rentLease?: RentLeaseFormData;
  amenities?: AmenitiesFormData;
  costFee?: CostFeeFormData;
  ownerDetails?: OwnerDetailsFormData;
  documents?: DocumentsFormData;
  // For multi-family specific
  buildingDetails?: Record<string, any>;
  unitConfiguration?: Record<string, any>;
  rentPricing?: Record<string, any>;
  management?: Record<string, any>;
  // For other property types
  other_pets?: string[];
  [key: string]: any;
}

// unit form data

export interface UnitInfoFormData {
  id: number;
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
  desks?: number;
  floorNumber?: number;
  maxOccupants?: number;
  studyDesk?: number;
  number?: number;
  property?: number;
  size?: string;
  type?: string;
  unitPhotos?: File[];
  unitPhotosBase64?: string[];
  existingPhotoUrls?: string[];
  existingPhotoIds?: number[];
}

export interface UnitFormData {
  unitInfo?: UnitInfoFormData;
  listingDetails?: ListingDetailsFormData;
  rentLease?: RentLeaseFormData;
  amenities?: AmenitiesFormData;
  costFee?: CostFeeFormData;
  ownerDetails?: OwnerDetailsFormData;
  documents?: DocumentsFormData;
  // For multi-family specific
  buildingDetails?: Record<string, any>;
  unitConfiguration?: Record<string, any>;
  rentPricing?: Record<string, any>;
  management?: Record<string, any>;
  // For other property types
  other_pets?: string[];
  [key: string]: any;
}
