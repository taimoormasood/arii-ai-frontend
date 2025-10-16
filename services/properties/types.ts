export interface GetPropertyListingParams {
  published?: boolean;
  property_type?: string;
  city?: string;
  rental_type?: string;
  status?: string;
  availability_date?: string;
  unit_count_min?: number;
  unit_count_max?: number;
  q?: string;
  page?: number;
}

export interface GetAllUnitsByPropertyIdParams {
  propertyId: number;
  published: boolean;
  q: string;
  page?: number;
}

export interface PropertyInfoBody {
  name: string;
  property_type: string | null;
  state: string;
  city: string;
  zip_code: string | undefined;
  street_address: string;
  page_saved: number;
}

export interface ListingInfoBody {
  property: number | undefined;
  listed_by: string;
  total_bedrooms?: string;
  total_bathrooms?: string;
  number_of_units?: string;
  occupancy_type?: string;
  square_footage?: string;
  description: string;
  care_services?: string[];
  pets_allowed: boolean;
  pet_types: string[];
  other_pets?: string[];
  availability_duration: number;
  showing_availability: { [day: string]: string };
  photo?: File[] | string[];
  page_saved: number;
}

export interface RentalDetailBody {
  property: number;
  unit?: number;
  rental_type: string;
  rent: string;
  assigned_tenant?: string;
  security_deposit: string;
  lease_start_date?: string;
  lease_end_date?: string;
  promote_special_offer?: boolean;
  offer_start_date?: string;
  offer_end_date?: string;
  offer_percentage?: string;
  page_saved: number;
}

export interface AmenitiesBody {
  property_id: number;
  unit?: number;

  sub_amenities: number[];
  other_amenities: any[];
  page_saved: number;
}

export interface CostFeeBody {
  property: number;
  unit?: number;
  cost_fees: {
    category_name: string;
    fees: {
      fee_name: string;
      payment_frequency: string;
      fee_amount: number;
      fee_type: string;
      is_required: string;
      refundable_status: string;
    }[];
  }[];
  page_saved: number;
}

export interface OwnerInfoBody {
  property: number;
  page_saved: number;
  owners: {
    id?: number; // Add id field for existing owners (used in updates)
    email: string;
    percentage: string;
    emergency_person?: string;
    emergency_contact?: string;
  }[];
}

export interface PropertyDocumentBody {
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
    existing_data: Array<{
      id: number;
      title: string;
      document_type: string;
    }>;
  };
}

export interface PropertyDocument {
  id: number;
  document: string;
  title: string;
  document_type: string;
  visibility: string;
  created_at: string;
  property: number;
  unit: number | null;
}

export interface GetPropertyDocumentsResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: PropertyDocument[];
  };
  error: string | null;
  success: boolean;
  message: string;
}

export interface AddAvailibilitySlotsBody {
  property: number;
  unit?: number;
  unavailable_dates: {
    date: string;
    reason: string;
  }[];
}

export interface PublishPropertyBody {
  published: boolean;
}

export interface AddExtraUnitBody {
  property: number | undefined;
  number?: string;
  type?: string;
  floor_number?: string;
  size?: string;
  bedrooms?: string;
  bathrooms?: string;
  beds?: string;
  desks?: string;
  photo?: File[];
  page_saved: number;
  max_occupants?: string;
  study_desks?: string;
}

export interface RentalDetails {
  id: number;
  assigned_tenant: string;
  rental_type: string;
  rent: string;
  security_deposit: string;
  lease_start_date: string;
  lease_end_date: string;
  promote_special_offer: boolean;
  offer_start_date: string;
  offer_end_date: string;
  offer_percentage: string;
  property: number;
  unit: null | number;
}

export interface Amenity {
  id: number;
  name: string;
}

export interface Amenities {
  [key: string]: Amenity[] | string[][];
  other_amenities: string[][];
}

export interface Fee {
  id: number;
  fee_name: string;
  payment_frequency: string;
  fee_amount: string;
  fee_type: string;
  is_required: string;
  refundable_status: string;
  category: number;
}

export interface CostFeeCategory {
  category_name: string;
  fees: Fee[];
}

export interface Document {
  id: number;
  document: string;
  title: string;
  document_type: string;
  visibility: string;
  property: number;
  unit: null | number;
}

export interface PropertyDetail {
  id: number;
  name: string;
  property_type: string;
  state: string;
  city: string;
  zip_code: string;
  street_address: string;
  other_amenities: string[];
  page_saved: number;
  published: boolean;
  published_at: null | string;
}

export interface ListingPhoto {
  id: number;
  photo: string;
}

export interface UnitDetail {
  id: number;
  number: string;
  type: string;
  floor_number: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  other_amenities: null | any;
  page_saved: number;
  property: number;
}

export interface Unit {
  rental_details: null | RentalDetails;
  amenities: {
    other_amenities: any[];
    [key: string]: any;
  };
  cost_fees: CostFeeCategory[];
  documents: Document[];
  detail: UnitDetail;
}

export interface PropertyDetailData {
  rental_details: RentalDetails | null;
  amenities: Amenities;
  cost_fees: CostFeeCategory[];
  documents: Document[];
  detail: PropertyDetail;
  listing_info: ListingInfo;
  owners: Owner[];
  units: Unit[];
}

export interface Owner {
  id: number;
  username: string;
  email: string;
  percentage: string;
  emergency_person: string;
  emergency_contact: string;
  registered: boolean;
  phone_number: string;
}

export interface SinglePropertyView {
  detail: {
    id: number;
    name: string;
    city: string;
    state: string;
    zip_code: string;
    street_address: string;
    status: string;
    property_type: string;
    published: boolean;
    published_at: string;
    occupancy_type: string;
  };
  rental_details: {
    id: string | number;
    assigned_tenant: string;
    rental_type: string;
    rent: string;
    security_deposit: string;
    lease_start_date: string;
    lease_end_date: string;
    promote_special_offer: boolean;
    offer_start_date: string | null;
    offer_end_date: string | null;
    offer_percentage: number | null | string;
    property: number;
    unit: number | null;
  };

  owners: Owner[];
  cost_fees: CostFeeCategory[];
  listing_info: ListingInfo;
  rent: number | null;
  photos: { id: number; photo: string }[];
  units: UnitSummaryView[];
  amenities: {
    other_amenities: string[][];
    [category: string]: { id: number; name: string }[] | string[][];
  };
}

export interface GetSinglePropertyResponse {
  data: SinglePropertyView | undefined;
  error: null | string;
  success: boolean;
  message: string;
}

export interface GetSingleUnitDetailResponse {
  data: UnitSummaryView;
  error: null | string;
  success: boolean;
  message: string;
}

export interface getAllUnitsByPropertyIdResponse {
  data: {
    data: {
      count: number;
      next: string | null;
      previous: string | null;
      results: UnitResult[];
    };
  };
  error: string | null;
  success: boolean;
  message: string;
}

export interface UnitResult {
  id: number;
  rent: number;
  photos: Photo[];
  tenants: any | null;
  number: string;
  type: string;
  floor_number: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  other_amenities: any | null;
  page_saved: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  property: number;
}

export interface GetPropertyMetricsResponse {
  data: {
    rental_income: string;
    occupancy_rate: string;
    avg_lease_term: string;
    avg_tenant_rating: string;
  };
  error: null | string;
  success: boolean;
  message: string;
}

export interface GetCostFeeTypesResponse {
  data: {
    add_on: string[];
    deposits: string[];
    services: string[];
    storage: string[];
    technology: string[];
    parking: string[];
    utilities: string[];
  };
  error: null | string;
  success: boolean;
  message: string;
}
export interface GetDocumentsTypesResponse {
  data: string[];
  error: string | null;
  success: boolean;
  message: string;
}

export interface Photo {
  id: number;
  photo: string;
}

export interface PropertySummary {
  rental_details: {
    id: number;
    assigned_tenant: string;
    rental_type: string;
    rent: string;
    security_deposit: string;
    lease_start_date: string;
    lease_end_date: string;
    promote_special_offer: boolean;
    offer_start_date: string | null;
    offer_end_date: string | null;
    offer_percentage: string | null;
    property: number;
    unit: number | null;
  };
  amenities: {
    [category: string]: { id: number; name: string }[] | string[][];
    other_amenities: string[][];
  };
  cost_fees: {
    category_name: string;
    fees: {
      id: number;
      fee_name: string;
      payment_frequency: string;
      fee_amount: string;
      fee_type: string;
      is_required: string;
      refundable_status: string;
      category: number;
    }[];
  }[];
  documents: {
    id: number;
    document: string;
    title: string;
    document_type: string;
    visibility: string;
    created_at: string;
    property: number;
    unit: number | null;
  }[];
  detail: {
    id: number;
    name: string;
    property_type: string;
    state: string;
    city: string;
    zip_code: string | null;
    street_address: string;
    status: string;
    other_amenities: string[];
    page_saved: number;
    published: boolean;
    published_at: string;
  };
  listing_info: {
    id: number;
    listed_by: string;
    total_bedrooms: number;
    total_bathrooms: number;
    square_footage: number;
    number_of_units: number | null;
    description: string;
    care_services: string[];
    pets_allowed: boolean;
    pet_types: string[];
    availability_duration: number;
    showing_availability: Record<string, string>;
    property: number;
    photos: {
      id: number;
      photo: string;
    }[];
  };
  owners: {
    id: number;
    email: string;
    percentage: string;
    emergency_person: string;
    emergency_contact: string;
    registered: boolean;
    username: string | null;
    phone_number: string | null;
  }[];
  units: {
    rental_details: {
      id: number;
      assigned_tenant: string;
      rental_type: string;
      rent: string;
      security_deposit: string;
      lease_start_date: string;
      lease_end_date: string;
      promote_special_offer: boolean;
      offer_start_date: string | null;
      offer_end_date: string | null;
      offer_percentage: string | null;
      property: number;
      unit: number | null;
    };
    amenities: {
      [category: string]: { id: number; name: string }[] | string[][];
      other_amenities: string[][];
    };
    cost_fees: {
      category_name: string;
      fees: {
        id: number;
        fee_name: string;
        payment_frequency: string;
        fee_amount: string;
        fee_type: string;
        is_required: string;
        refundable_status: string;
        category: number;
      }[];
    }[];
    documents: {
      id: number;
      document: string;
      title: string;
      document_type: string;
      visibility: string;
      created_at: string;
      property: number;
      unit: number | null;
    }[];
    detail: {
      id: number;
      name: string;
      property_type: string;
      state: string;
      city: string;
      zip_code: string | null;
      street_address: string;
      status: string;
      other_amenities: string[];
      other_pets: string[];
      page_saved: number;
      published: boolean;
      published_at: string;
    };
    listing_info: {
      id: number;
      listed_by: string;
      total_bedrooms: number;
      total_bathrooms: number;
      square_footage: number;
      number_of_units: number | null;
      description: string;
      care_services: string[];
      pets_allowed: boolean;
      pet_types: string[];
      availability_duration: number;
      showing_availability: Record<string, string>;
      property: number;
      photos: {
        id: number;
        photo: string;
      }[];
    };
    owners: {
      id: number;
      email: string;
      percentage: string;
      emergency_person: string;
      emergency_contact: string;
      registered: boolean;
      username: string | null;
      phone_number: string | null;
    }[];
  };
}
export interface UnitSummaryView {
  rental_details: {
    id: number;
    assigned_tenant: string;
    rental_type: string;
    rent: string;
    security_deposit: string;
    lease_start_date: string;
    lease_end_date: string;
    promote_special_offer: boolean;
    offer_start_date: string | null;
    offer_end_date: string | null;
    offer_percentage: string | null;
    property: number;
    unit: number | null;
  };
  amenities: {
    [category: string]: { id: number; name: string }[] | string[][];
    other_amenities: string[][];
  };
  cost_fees: {
    category_name: string;
    fees: {
      id: number;
      fee_name: string;
      payment_frequency: string;
      fee_amount: string;
      fee_type: string;
      is_required: string;
      refundable_status: string;
      category: number;
    }[];
  }[];
  documents: {
    id: number;
    document: string;
    title: string;
    document_type: string;
    visibility: string;
    created_at: string;
    property: number;
    unit: number | null;
  }[];
  detail: {
    id: number;
    number: string;
    type: string;
    floor_number: string;
    size: string;
    bedrooms: number;
    bathrooms: number;
    status: string;

    other_amenities: string[] | null;
    other_pets: string[] | null;
    page_saved: number;
    published: boolean;
    published_at: string | null;
    photos?: Photo[];
    property?: number;
  };
}

export interface ListingInfo {
  id: number;
  listed_by: string;
  occupancy_type: string;
  total_bedrooms: number;
  total_bathrooms: number;
  square_footage: number;
  number_of_units: number | null;
  description: string;
  care_services: string[];
  pets_allowed: boolean;
  pet_types: string[];
  other_pets: string[];
  availability_duration: number;
  showing_availability: { [key: string]: string };
  property: number;
  photos: Photo[];
}

export interface UnitSummary {
  data: PropertySummary;
}

export interface PropertySummaryResponse {
  data: PropertySummary;
  error: string | null;
  success: boolean;
  message: string;
}

// Bulk Import Types
export interface BulkImportUnitsRequest {
  property: number;
  file: File; // CSV or XLSX
}

export interface BulkImportUnitsResponse {
  data: {
    csv_units_count: number;
    units_created: number;
    units_failed: number;
    data: Record<string, string>; // unit name => error message
  };
  error: string;
  success: boolean;
  message: string;
}
