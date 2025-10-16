import axios from "axios";

import { serializeParams } from "@/helpers/serialize-params";
import axiosInstance from "@/lib/axios";

import type {
  AddAvailibilitySlotsBody,
  AddExtraUnitBody,
  AmenitiesBody,
  BulkImportUnitsRequest,
  BulkImportUnitsResponse,
  CostFeeBody,
  GetAllUnitsByPropertyIdParams,
  GetPropertyListingParams,
  ListingInfoBody,
  OwnerInfoBody,
  PropertyDocumentBody,
  PropertyInfoBody,
  PublishPropertyBody,
  RentalDetailBody,
} from "./types";

export const deleteUserProperties = async () => {
  try {
    const res = await axiosInstance.delete(`/property/user-listings/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPropertyListing = async ({
  published,
  property_type,
  city,
  rental_type,
  status,
  availability_date,
  unit_count_min,
  unit_count_max,
  q = "",
  page,
}: GetPropertyListingParams) => {
  try {
    const params = {
      published,
      property_type,
      city,
      rental_type,
      status,
      availability_date,
      unit_count_min,
      unit_count_max,
      q,
      ...(page !== undefined ? { page } : {}),
    };
    const queryString = serializeParams(params);

    const res = await axiosInstance.get(
      `/property/detail${queryString ? `?${queryString}` : ""}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAmenities = async (type: string) => {
  try {
    const res = await axiosInstance.get(
      `/property/amenities/?property_type=${type}`
    );

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getMonthAvailability = async (
  month: string,
  year: string,
  property: number,
  unitId?: number
) => {
  try {
    const params: Record<string, any> = {
      month,
      year,
      property,
    };

    if (unitId) {
      params.unit = unitId;
    }

    const res = await axiosInstance.get("/property/availability", {
      params,
    });

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const addAvailabilitySlots = async (body: AddAvailibilitySlotsBody) => {
  try {
    const res = await axiosInstance.post("/property/availability/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAvailabilitySlot = async (id: number) => {
  try {
    const res = await axiosInstance.delete(`/property/availability/${id}/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addPropertyInfo = async (body: PropertyInfoBody) => {
  try {
    const res = await axiosInstance.post("/property/detail/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addListingInfo = async (body: ListingInfoBody) => {
  try {
    const formData = new FormData();

    if (body.property !== undefined && body.property !== null) {
      formData.append("property", String(body.property));
    }

    formData.append("listed_by", body.listed_by);

    const hasUnits =
      body?.number_of_units !== undefined && body?.number_of_units !== null;

    const hasOccupancyType =
      body?.occupancy_type !== undefined && body?.occupancy_type !== null;

    const hasBedroomsAndBathrooms =
      body?.total_bedrooms !== undefined &&
      body?.total_bedrooms !== null &&
      body?.total_bathrooms !== undefined &&
      body?.total_bathrooms !== null;

    // Priority: number_of_units > total_rooms > total_bedrooms+total_bathrooms
    if (hasUnits) {
      formData.append("number_of_units", String(body.number_of_units));
    } else if (hasBedroomsAndBathrooms) {
      formData.append("total_bedrooms", String(body.total_bedrooms));
      formData.append("total_bathrooms", String(body.total_bathrooms));
    }

    if (hasOccupancyType) {
      formData.append("occupancy_type", body?.occupancy_type || "");
    }

    if (body?.square_footage !== undefined && body?.square_footage !== null) {
      formData.append("square_footage", String(body.square_footage));
    }

    if (body?.occupancy_type !== undefined && body?.occupancy_type !== null) {
      formData.append("occupancy_type", String(body.occupancy_type));
    }

    formData.append("description", body.description);
    formData.append("pets_allowed", String(body.pets_allowed));
    formData.append("pet_types", JSON.stringify(body.pet_types));
    formData.append("other_pets", JSON.stringify(body.other_pets));
    if (body?.care_services)
      formData.append("care_services", JSON.stringify(body.care_services));

    if (
      body.availability_duration !== undefined &&
      body.availability_duration !== null
    ) {
      formData.append(
        "availability_duration",
        String(body.availability_duration)
      );
    }

    formData.append(
      "showing_availability",
      JSON.stringify(body.showing_availability)
    );

    formData.append("page_saved", String(body.page_saved));

    if (body.photo && Array.isArray(body.photo)) {
      body.photo.forEach((file) => {
        formData.append("photo", file);
      });
    }

    const res = await axiosInstance.post("/property/listing/", formData);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateListingInfo = async (
  propertyId: number,
  body: ListingInfoBody
) => {
  try {
    const formData = new FormData();

    if (body.property !== undefined && body.property !== null) {
      formData.append("property", String(body.property));
    }

    formData.append("listed_by", body.listed_by);

    const hasUnits =
      body?.number_of_units !== undefined && body?.number_of_units !== null;

    const hasBedroomsAndBathrooms =
      body?.total_bedrooms !== undefined &&
      body?.total_bedrooms !== null &&
      body?.total_bathrooms !== undefined &&
      body?.total_bathrooms !== null;

    // Priority: number_of_units > total_rooms > total_bedrooms+total_bathrooms
    if (hasUnits) {
      formData.append("number_of_units", String(body.number_of_units));
    } else if (hasBedroomsAndBathrooms) {
      formData.append("total_bedrooms", String(body.total_bedrooms));
      formData.append("total_bathrooms", String(body.total_bathrooms));
    }

    if (body?.square_footage !== undefined && body?.square_footage !== null) {
      formData.append("square_footage", String(body.square_footage));
    }
    if (body?.occupancy_type !== undefined && body?.occupancy_type !== null) {
      formData.append("occupancy_type", body?.occupancy_type || "");
    }

    formData.append("description", body.description);
    formData.append("pets_allowed", String(body.pets_allowed));
    formData.append("pet_types", JSON.stringify(body.pet_types));
    formData.append("other_pets", JSON.stringify(body.other_pets));

    if (
      body.availability_duration !== undefined &&
      body.availability_duration !== null
    ) {
      formData.append(
        "availability_duration",
        String(body.availability_duration)
      );
    }

    formData.append(
      "showing_availability",
      JSON.stringify(body.showing_availability)
    );

    formData.append("page_saved", String(body.page_saved));

    if (body.photo && Array.isArray(body.photo)) {
      body.photo.forEach((file) => {
        formData.append("photo", file);
      });
    }

    // Handle existing photos
    if (
      (body as any).existing_photos &&
      Array.isArray((body as any).existing_photos)
    ) {
      formData.append(
        "existing_photos",
        JSON.stringify((body as any).existing_photos)
      );
    }

    const res = await axiosInstance.put(
      `/property/listing/${propertyId}/`,
      formData
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addRentalDetail = async (body: RentalDetailBody) => {
  try {
    const res = await axiosInstance.post("/property/rental/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateRentalDetail = async (
  propertyId: number,
  body: RentalDetailBody
) => {
  try {
    const res = await axiosInstance.put(
      `/property/rental/${propertyId}/`,
      body
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addAmenities = async (body: AmenitiesBody) => {
  try {
    const res = await axiosInstance.post("/property/amenities/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateAmenities = async (
  propertyId: number,
  body: AmenitiesBody
) => {
  try {
    const res = await axiosInstance.put(
      `/property/amenities/${propertyId}/`,
      body
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addCostFee = async (body: CostFeeBody) => {
  try {
    const res = await axiosInstance.post("/property/cost-fee/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateCostFee = async (propertyId: number, body: CostFeeBody) => {
  try {
    const res = await axiosInstance.put(`/property/cost-fee/`, body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addOwnerInfo = async (body: OwnerInfoBody) => {
  try {
    const res = await axiosInstance.post("/property/owner-info/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateOwnerInfo = async (body: OwnerInfoBody) => {
  try {
    const res = await axiosInstance.put(`/property/owner-info/`, body);

    return res.data;
  } catch (error) {
    throw error;
  }
};
export const addPropertyDocuments = async (
  body: PropertyDocumentBody & { existing_data?: any[] }
) => {
  try {
    const formData = new FormData();

    if (body.property !== undefined && body.property !== null) {
      formData.append("property", String(body.property));
    }

    if (body.unit !== undefined && body.unit !== null) {
      formData.append("unit", String(body.unit));
    }

    if (body.page_saved !== undefined && body.page_saved !== null) {
      formData.append("page_saved", String(body.page_saved));
    }

    if (body.data) {
      formData.append("data", JSON.stringify(body.data));
    }

    // Handle existing_data at top level for updates
    if (body.existing_data) {
      formData.append("existing_data", JSON.stringify(body.existing_data));
    }

    if (body.documents && body.documents.length > 0) {
      body.documents.forEach((file) => {
        formData.append("documents", file);
      });
    }

    const res = await axiosInstance.post("/property/documents/", formData);

    return res.data;
  } catch (error) {
    throw error;
  }
};

// export const updatePropertyDocuments = async (
//   propertyId: number,
//   body: PropertyDocumentBody & { existing_data?: any[] }
// ) => {
//   try {
//     const formData = new FormData();

//     if (body.property !== undefined && body.property !== null) {
//       formData.append("property", String(body.property));
//     }

//     if (body.unit !== undefined && body.unit !== null) {
//       formData.append("unit", String(body.unit));
//     }

//     if (body.page_saved !== undefined && body.page_saved !== null) {
//       formData.append("page_saved", String(body.page_saved));
//     }

//     if (body.data) {
//       formData.append("data", JSON.stringify(body.data));
//     }

//     // Handle existing_data at top level for updates
//     if (body.existing_data) {
//       formData.append("existing_data", JSON.stringify(body.existing_data));
//     }

//     if (body.documents && body.documents.length > 0) {
//       body.documents.forEach((file) => {
//         formData.append("documents", file);
//       });
//     }

//     const res = await axiosInstance.put(
//       `/property/documents/${propertyId}/`,
//       formData
//     );

//     return res.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const getPropertyDocuments = async (
  propertyId: number,
  unitId?: number,
  q?: string,
  page?: number
) => {
  try {
    const params = new URLSearchParams({
      property: propertyId.toString(),
    });

    if (unitId) {
      params.append("unit", unitId.toString());
    }

    if (q && q.trim() !== "") {
      params.append("q", q.trim());
    }
    if (page) {
      params.append("page", page.toString());
    }

    const res = await axiosInstance.get(
      `/property/documents/?${params.toString()}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deletePropertyDocument = async (documentId: number) => {
  try {
    const res = await axiosInstance.delete(
      `/property/documents/${documentId}/`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const publishProperty = async (
  propertyId: number,
  body: PublishPropertyBody
) => {
  try {
    const res = await axiosInstance.patch(
      `/property/detail/${propertyId}/publish/`,
      body
    );

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const publishUnit = async (
  unitId: number,
  body: PublishPropertyBody
) => {
  try {
    const res = await axiosInstance.patch(
      `/property/unit/${unitId}/publish/`,
      body
    );

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const addExtraUnit = async (body: AddExtraUnitBody) => {
  try {
    const formData = new FormData();

    if (body.property !== undefined && body.property !== null) {
      formData.append("property", String(body.property));
    }

    if (body.number !== undefined) {
      formData.append("number", body.number);
    }

    if (body.type !== undefined) {
      formData.append("type", body.type);
    }

    if (body.floor_number !== undefined) {
      formData.append("floor_number", body.floor_number);
    }

    if (body.size !== undefined) {
      formData.append("size", body.size);
    }

    if (body.bedrooms !== undefined) {
      formData.append("bedrooms", body.bedrooms);
    }

    if (body.bathrooms !== undefined) {
      formData.append("bathrooms", body.bathrooms);
    }

    if (body.max_occupants !== undefined) {
      formData.append("max_occupants", body.max_occupants);
    }

    if (body.study_desks !== undefined) {
      formData.append("study_desks", body.study_desks);
    }

    if (body.desks !== undefined) {
      formData.append("desks", body.desks);
    }

    if (body.beds !== undefined) {
      formData.append("beds", body.beds);
    }

    if (body.photo && Array.isArray(body.photo)) {
      body.photo.forEach((file) => {
        formData.append("photo", file);
      });
    }

    formData.append("page_saved", String(body.page_saved));

    const res = await axiosInstance.post("/property/unit/", formData);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateExtraUnit = async (
  unitId: number,
  body: AddExtraUnitBody & { existing_photos?: number[] }
) => {
  try {
    const formData = new FormData();

    if (body.property !== undefined && body.property !== null) {
      formData.append("property", String(body.property));
    }

    if (body.number !== undefined) {
      formData.append("number", body.number);
    }

    if (body.type !== undefined) {
      formData.append("type", body.type);
    }

    if (body.floor_number !== undefined) {
      formData.append("floor_number", body.floor_number);
    }

    if (body.size !== undefined) {
      formData.append("size", body.size);
    }

    if (body.bedrooms !== undefined) {
      formData.append("bedrooms", body.bedrooms);
    }

    if (body.bathrooms !== undefined) {
      formData.append("bathrooms", body.bathrooms);
    }

    if (body.max_occupants !== undefined) {
      formData.append("max_occupants", body.max_occupants);
    }

    if (body.study_desks !== undefined) {
      formData.append("study_desks", body.study_desks);
    }

    if (body.photo && Array.isArray(body.photo)) {
      body.photo.forEach((file) => {
        formData.append("photo", file);
      });
    }

    // Handle existing photos for updates
    if (body.existing_photos && Array.isArray(body.existing_photos)) {
      formData.append("existing_photos", JSON.stringify(body.existing_photos));
    }

    formData.append("page_saved", String(body.page_saved));

    const res = await axiosInstance.put(`/property/unit/${unitId}/`, formData);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUnitsByPropertyId = async ({
  propertyId,
  published,
  q,
  page,
}: GetAllUnitsByPropertyIdParams & { propertyId: number }) => {
  try {
    const params: any = { property: propertyId, published, q };
    if (page) params.page = page;
    const queryString = serializeParams(params);
    const res = await axiosInstance.get(
      `/property/unit${queryString ? `?${queryString}` : ""}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSinglePropertyDetail = async (id: number) => {
  try {
    const res = await axiosInstance.get(`/property/summary/${id}/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSingleUnitDetail = async (id: number) => {
  try {
    const res = await axiosInstance.get(`/property/unit-summary/${id}/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPropertyMetrics = async (id: number) => {
  try {
    const res = await axiosInstance.get(`/property/metrics/${id}/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCostFeeTypes = async (id: number) => {
  try {
    const res = await axiosInstance.get(
      `/property/cost-fee-types/?property=${id}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};
export const getDocumentTypes = async (propertyId: number, unitId?: number) => {
  try {
    const params: Record<string, number> = { property: propertyId };

    if (unitId !== undefined) {
      params.unit = unitId;
    }

    const res = await axiosInstance.get("/property/document-types/", {
      params,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const bulkImportUnits = async (
  body: BulkImportUnitsRequest,
  onUploadProgress?: (progressEvent: any) => void
): Promise<BulkImportUnitsResponse> => {
  try {
    const formData = new FormData();
    formData.append("property", String(body.property));
    formData.append("file", body.file);
    const res = await axiosInstance.post(
      "/property/units-bulk-import/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPopularProperties = async () => {
  try {
    const res = await axiosInstance.get(`/property/top-listings/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getInfiniteProperties = async ({
  pageParam = 1,
  q,
}: {
  pageParam?: number;
  q?: string;
}) => {
  try {
    const res = await axiosInstance.get(`/property/user-properties-units/`, {
      params: {
        page: pageParam,
        ...(q ? { q } : {}),
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
