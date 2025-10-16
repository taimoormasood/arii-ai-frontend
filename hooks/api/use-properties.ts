import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { errorHandler } from "@/helpers/error-handler";
import {
  addAmenities,
  addAvailabilitySlots,
  addCostFee,
  addExtraUnit,
  addListingInfo,
  addOwnerInfo,
  addPropertyDocuments,
  addPropertyInfo,
  addRentalDetail,
  bulkImportUnits,
  deleteAvailabilitySlot,
  deletePropertyDocument,
  getAllUnitsByPropertyId,
  getAmenities,
  getCostFeeTypes,
  getDocumentTypes,
  getInfiniteProperties,
  getMonthAvailability,
  getPopularProperties,
  getPropertyDocuments,
  getPropertyListing,
  getPropertyMetrics,
  getSinglePropertyDetail,
  getSingleUnitDetail,
  publishProperty,
  updateAmenities,
  updateCostFee,
  updateExtraUnit,
  updateListingInfo,
  updateOwnerInfo,
  updateRentalDetail,
} from "@/services/properties/properties.service";
import type {
  AddAvailibilitySlotsBody,
  AddExtraUnitBody,
  AmenitiesBody,
  BulkImportUnitsRequest,
  BulkImportUnitsResponse,
  CostFeeBody,
  GetAllUnitsByPropertyIdParams,
  getAllUnitsByPropertyIdResponse,
  GetCostFeeTypesResponse,
  GetDocumentsTypesResponse,
  GetPropertyDocumentsResponse,
  GetPropertyListingParams,
  GetPropertyMetricsResponse,
  GetSinglePropertyResponse,
  GetSingleUnitDetailResponse,
  ListingInfoBody,
  OwnerInfoBody,
  PropertyDocumentBody,
  PropertyInfoBody,
  PublishPropertyBody,
  RentalDetailBody,
} from "@/services/properties/types";

export const GET_PROPERTY_LISTING_QUERY_KEY = ["get-property-listing"] as const;

/**
 * Custom hook to fetch and cache the list of properties.
 *
 * This hook uses the `useQuery` hook from React Query to fetch the list of properties
 * and cache the result. It ensures that the data is fetched only once and is not
 * refetched on mount, window focus, or reconnect.
 *
 * @param params - The parameters to filter the list of properties.
 * @returns The query result containing the list of properties.
 */

export interface PropertyPhoto {
  id: number;
  photo: string;
}

export interface Property {
  id: number;
  property_owner: number;
  rent: number | null;
  photos: PropertyPhoto[];
  number_of_units: number;
  name: string;
  property_type: string;
  state: string;
  city: string;
  zip_code: string;
  street_address: string;
  status: string;
  other_amenities: string[];
  page_saved: number;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface GetPropertiesResponse {
  data: {
    results: Property[];
    count: number;
  };
  error: string | null;
  success: boolean;
  message: string;
}

export function useGetPropertyListing(
  params: GetPropertyListingParams
): UseQueryResult<GetPropertiesResponse, unknown> {
  return useQuery({
    queryKey: [...GET_PROPERTY_LISTING_QUERY_KEY, params],
    queryFn: () => getPropertyListing(params),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

/**
 * Usage example:
 *
 * import { useGetPropertyListing } from "@/hooks/api/use-properties";
 *
 * const { data, error, isLoading } = useGetPropertyListing({
 *   page: 1,
 *   limit: 10,
 *   search: "property",
 *   state: "CA",
 *   city: "Los Angeles",
 * });
 *
 */

/**
 * Custom hook to fetch and cache the list of month availability.
 *
 * This hook uses the `useQuery` hook from React Query to fetch the list of month availability
 * and cache the result. It ensures that the data is fetched only once and is not
 * refetched on mount, window focus, or reconnect.
 *
 * @param params - The parameters to filter the list of month availability.
 * @returns The query result containing the list of month availability.
 */

interface MonthAvailabilityParams {
  month: string;
  year: string;
  property: number;
  unitId?: number;
}

interface GetAvailabilityResponse {
  data: {
    id: number;
    date: string;
    status: string;
    reason: string | null;
  }[];
  error: string | null;
  success: boolean;
  message: string;
}

export const GET_MONTH_AVAILABILITY = ["get-availability"] as const;

export function useGetMonthAvailability(
  params: MonthAvailabilityParams
): UseQueryResult<GetAvailabilityResponse, unknown> {
  const { month, year, property, unitId } = params;

  const queryKey =
    params?.month && params?.year && params?.property
      ? [...GET_MONTH_AVAILABILITY, params]
      : GET_MONTH_AVAILABILITY;

  return useQuery({
    queryKey: queryKey,
    queryFn: () => getMonthAvailability(month, year, property, unitId),
  });
}

/**
 * Usage example:
 *
 * import { useGetAmenities } from "@/hooks/api/use-properties";
 *
 * const { data, error, isLoading } = useGetAmenities();
 *
 */

/**
 * Custom hook to fetch and cache the list of amenities.
 *
 * This hook uses the `useQuery` hook from React Query to fetch the list of amenities
 * and cache the result. It ensures that the data is fetched only once and is not
 * refetched on mount, window focus, or reconnect.
 *
 * @param params - The parameters to filter the list of amenities.
 * @returns The query result containing the list of amenities.
 */

export const GET_AMENITIES_QUERY_KEY = ["get-amenities"] as const;

interface GetAmenitiesResponse {
  data: {
    amenity: string;
    sub_amenities: {
      id: number;
      sub_amenity: string;
    }[];
  }[];
  error: string | null;
  success: boolean;
  message: string;
}

export function useGetAmenities(
  params: string
): UseQueryResult<GetAmenitiesResponse, unknown> {
  return useQuery({
    queryKey: GET_AMENITIES_QUERY_KEY,
    queryFn: () => getAmenities(params),
    staleTime: 0,
  });
}

/**
 * Usage example:
 *
 * import { useGetAmenities } from "@/hooks/api/use-properties";
 *
 * const { data, error, isLoading } = useGetAmenities();
 *
 */

/* add availability info mutation */

export const ADD_AVAILABILITY_SLOTS_KEY = ["add-availability-slots"] as const;

/**
 * Custom hook to add availability information.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the availability list and the specific availability after a successful creation.
 *
 * @returns Mutation object containing methods and states for creating a availability.
 */
export function useAddAvailabilitySlots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_PROPERTY_INFO_KEY,
    mutationFn: async (body: AddAvailibilitySlotsBody) => {
      const response = await addAvailabilitySlots(body);
      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to add availability information."
        );
      }

      return response.data;
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

export function useDeleteAvailabilitySlots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-availability"],
    mutationFn: async (id: number) => {
      const response = await deleteAvailabilitySlot(id);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_MONTH_AVAILABILITY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useAddPropertyInfo } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = useAddPropertyInfo();
 *
 * mutate({
 *   name: "New Property",
 *   property_type: "Apartment",
 *   state: "CA",
 *   city: "Los Angeles",
 *   zip_code: "90001",
 *   street_address: "123 Main St",
 *   page_saved: 1,
 * });
 *
 */

/* add property info mutation */

export const ADD_PROPERTY_INFO_KEY = ["add-property-info"] as const;

/**
 * Custom hook to add property information.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the property list and the specific property after a successful creation.
 *
 * @returns Mutation object containing methods and states for creating a property.
 */
export function useAddPropertyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_PROPERTY_INFO_KEY,
    mutationFn: async (body: PropertyInfoBody) => {
      const response = await addPropertyInfo(body);
      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to add property information."
        );
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useAddPropertyInfo } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = useAddPropertyInfo();
 *
 * mutate({
 *   name: "New Property",
 *   property_type: "Apartment",
 *   state: "CA",
 *   city: "Los Angeles",
 *   zip_code: "90001",
 *   street_address: "123 Main St",
 *   page_saved: 1,
 * });
 *
 */

/* add listing info mutation */

export const ADD_LISTING_INFO_KEY = ["add-listing-info"] as const;

/**
 * Custom hook to add listing information.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the listing list and the specific listing after a successful creation.
 *
 * @returns Mutation object containing methods and states for creating a listing.
 */
export function useAddListingInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_LISTING_INFO_KEY,
    mutationFn: async (body: ListingInfoBody) => {
      const response = await addListingInfo(body);
      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to add listing information."
        );
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

export const UPDATE_LISTING_INFO_KEY = ["update-listing-info"] as const;

/**
 * Custom hook to update listing information.
 *
 * This hook uses React Query's `useMutation` to handle the update process.
 * It directly updates the cache for the listing after a successful update.
 *
 * @returns Mutation object containing methods and states for updating a listing.
 */
export function useUpdateListingInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_LISTING_INFO_KEY,
    mutationFn: async ({
      propertyId,
      ...body
    }: ListingInfoBody & { propertyId: number }) => {
      const response = await updateListingInfo(propertyId, body);
      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to update listing information."
        );
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useAddListingInfo } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = useAddListingInfo();
 *
 * mutate({
 *   property: "property_id",
 *   listed_by: "user_id",
 *   total_bedrooms: "3",
 *   total_bathrooms: "2",
 *   square_footage: "1200",
 *   description: "Spacious and well-lit rooms.",
 *   other_pets: "yes",
 *   pet_types: "dog,cat",
 *   availability_duration: "12 months",
 *   showing_availability: "Weekends only",
 *   photo: [],
 *   page_saved: 1,
 * });
 *
 */

/* add rental detail mutation */

export const ADD_RENTAL_DETAIL_KEY = ["add-rental-detail"] as const;

/**
 * Custom hook to add rental details.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the rental detail list and the specific rental detail after a successful creation.
 *
 * @returns Mutation object containing methods and states for creating a rental detail.
 */

export function useAddRentalDetail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_RENTAL_DETAIL_KEY,
    mutationFn: async (body: RentalDetailBody) => {
      const response = await addRentalDetail(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to add rental detail.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

export const UPDATE_RENTAL_DETAIL_KEY = ["update-rental-detail"] as const;

/**
 * Custom hook to update rental details.
 *
 * This hook uses React Query's `useMutation` to handle the update process.
 * It directly updates the cache for the rental detail after a successful update.
 *
 * @returns Mutation object containing methods and states for updating rental details.
 */
export function useUpdateRentalDetail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_RENTAL_DETAIL_KEY,
    mutationFn: async ({
      propertyId,
      ...body
    }: RentalDetailBody & { propertyId: number }) => {
      const response = await updateRentalDetail(propertyId, body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to update rental detail.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}
/**
 * Usage example:
 *
 * import { useAddRentalDetail } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = useAddRentalDetail();
 *
 * mutate({
 *   property: 1,
 *   rental_type: "Apartment",
 *   rent: "1500",
 *   assigned_tenant: "tenant_id",
 *   available_from: "2023-10-01",
 *   available_to: "2024-10-01",
 *   security_deposit: "500",
 *   lease_start_date: "2023-10-01",
 *   lease_end_date: "2024-10-01",
 *   promote_special_offer: true,
 *   offer_start_date: "2023-11-01",
 *   offer_end_date: "2023-12-01",
 *   offer_percentage: "10",
 *   page_saved: 1,
 * });
 *
 */

/* add amenities mutation */

export const ADD_AMENITIES_KEY = ["add-amenities"] as const;

/**
 * Custom hook to add amenities to a property.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the amenities list and the specific property after a successful creation.
 *
 * @returns Mutation object containing methods and states for creating amenities.
 */

export function useAddAmenities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_AMENITIES_KEY,
    mutationFn: async (body: AmenitiesBody) => {
      const response = await addAmenities(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to add amenities.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}
/**
 * Usage example:
 *
 * import { useAddAmenities } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = useAddAmenities();
 *
 * mutate({
 *   property_id: 1,
 *   sub_amenities: [1, 2, 3],
 *   other_amenities: [{ name: "WiFi", description: "High-speed internet" }],
 *   page_saved: 1,
 * });
 *
 */

export const UPDATE_AMENITIES_KEY = ["update-amenities"] as const;

/**
 * Custom hook to update amenities for a property.
 *
 * This hook uses React Query's `useMutation` to handle the update process.
 * It directly updates the cache for the amenities after a successful update.
 *
 * @returns Mutation object containing methods and states for updating amenities.
 */
export function useUpdateAmenities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_AMENITIES_KEY,
    mutationFn: async ({
      propertyId,
      ...body
    }: AmenitiesBody & { propertyId: number }) => {
      const response = await updateAmenities(propertyId, body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to update amenities.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/* add cost-fee mutation */

export const ADD_COST_FEE_KEY = ["add-cost-fee"] as const;

/**
 * Custom hook to add cost fees to a property.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the cost fee list and the specific property after a successful creation.
 *
 * @returns Mutation object containing methods and states for creating cost fees.
 */

export function useAddCostFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_COST_FEE_KEY,
    mutationFn: async (body: CostFeeBody) => {
      const response = await addCostFee(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to add cost fee.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

export const UPDATE_COST_FEE_KEY = ["update-cost-fee"] as const;

/**
 * Custom hook to update cost fees for a property.
 *
 * This hook uses React Query's `useMutation` to handle the update process.
 * It directly updates the cache for the cost fees after a successful update.
 *
 * @returns Mutation object containing methods and states for updating cost fees.
 */
export function useUpdateCostFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_COST_FEE_KEY,
    mutationFn: async ({
      propertyId,
      ...body
    }: CostFeeBody & { propertyId: number }) => {
      const response = await updateCostFee(propertyId, body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to update cost fee.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useAddCostFee } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = useAddCostFee();
 *
 * mutate({
 *   property: 1,
 *   category_name: "Utilities",
 *   fees: [
 *     {
 *       fee_name: "Water",
 *       payment_frequency: "Monthly",
 *       fee_amount: 50,
 *       fee_type: "Fixed",
 *       is_required: "Yes",
 *       refundable_status: "No",
 *     },
 *   ],
 *   page_saved: 1,
 * });
 *
 */

/* add owner info mutation */

export const ADD_OWNER_INFO_KEY = ["add-owner-info"] as const;
/**
 * Custom hook to add owner information to a property.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the owner info list and the specific property after a successful creation.
 *
 * @returns Mutation object containing methods and states for creating owner info.
 */
export function useAddOwnerInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_OWNER_INFO_KEY,
    mutationFn: async (body: OwnerInfoBody) => {
      const response = await addOwnerInfo(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to add owner info.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

export const UPDATE_OWNER_INFO_KEY = ["update-owner-info"] as const;

/**
 * Custom hook to update owner information for a property.
 *
 * This hook uses React Query's `useMutation` to handle the update process.
 * It directly updates the cache for the owner info after a successful update.
 *
 * @returns Mutation object containing methods and states for updating owner info.
 */
export function useUpdateOwnerInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_OWNER_INFO_KEY,
    mutationFn: async (body: OwnerInfoBody) => {
      const response = await updateOwnerInfo(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to update owner info.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useAddOwnerInfo } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = useAddOwnerInfo();
 *
 * mutate({
 *   property: 1,
 *   email: "owner@example.com",
 *   name: "John Doe",
 *   phone: "123-456-7890",
 *   page_saved: 1,
 * });
 *
 */

/* add property document mutation */

export const ADD_PROPERTY_DOCUMENT_KEY = ["add-property-document"] as const;
/**
 * Custom hook to add property documents.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the property document list and the specific property after a successful creation.
 *
 * @returns Mutation object containing methods and states for creating property documents.
 */
export function useAddPropertyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_PROPERTY_DOCUMENT_KEY,
    mutationFn: async (body: PropertyDocumentBody) => {
      const response = await addPropertyDocuments(body);

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

// export const UPDATE_PROPERTY_DOCUMENT_KEY = [
//   "update-property-document",
// ] as const;

// /**
//  * Custom hook to update property documents.
//  *
//  * This hook uses React Query's `useMutation` to handle the update process.
//  * It directly updates the cache for the property documents after a successful update.
//  *
//  * @returns Mutation object containing methods and states for updating property documents.
//  */
// export function useUpdatePropertyDocument() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationKey: UPDATE_PROPERTY_DOCUMENT_KEY,
//     mutationFn: async ({
//       propertyId,
//       ...body
//     }: PropertyDocumentBody & { propertyId: number }) => {
//       const response = await updatePropertyDocuments(propertyId, body);
//       if (!response?.success) {
//         throw new Error(
//           response?.message || "Failed to update property document."
//         );
//       }

//       return response.data;
//     },
//     onSuccess: (response) => {
//
//     },
//     onError: (error) => {
//       toast.error(errorHandler(error));
//     },
//   });
// }

export const GET_PROPERTY_DOCUMENTS_KEY = ["get-property-documents"] as const;

export function useGetPropertyDocuments(
  propertyId: number,
  unitId?: number,
  q?: string,
  page?: number
): UseQueryResult<GetPropertyDocumentsResponse, unknown> {
  return useQuery({
    queryKey: [...GET_PROPERTY_DOCUMENTS_KEY, propertyId, unitId, q, page],
    queryFn: () => getPropertyDocuments(propertyId, unitId, q, page),
    // enabled: !!propertyId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

/* delete property document mutation */

export const DELETE_PROPERTY_DOCUMENT_KEY = [
  "delete-property-document",
] as const;
/**
 * Custom hook to delete a property document.
 *
 * This hook uses React Query's `useMutation` to handle the deletion process.
 * It invalidates the property documents cache after a successful deletion.
 *
 * @returns Mutation object containing methods and states for deleting a property document.
 */
export function useDeletePropertyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: DELETE_PROPERTY_DOCUMENT_KEY,
    mutationFn: async (documentId: number) => {
      const response = await deletePropertyDocument(documentId);

      return response.data;
    },
    onSuccess: (response) => {
      // Invalidate property documents queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: GET_PROPERTY_DOCUMENTS_KEY,
      });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useDeletePropertyDocument } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = useDeletePropertyDocument();
 *
 * mutate(documentId);
 *
 */

/**
 * Usage example:
 *
 * import { useAddPropertyDocument } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = useAddPropertyDocument();
 *
 * mutate({
 *   property: 1,
 *   document_type: "Lease Agreement",
 *   document_file: "base64_encoded_file",
 *   page_saved: 1,
 * });
 *
 */

/* publish property mutation */

export const PUBLISH_PROPERTY_QUERY_KEY = ["add-property-document"] as const;
/**
 * Custom hook to publish property.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the property document list and the specific property after a successful creation.
 *
 * @returns Mutation object containing methods and states for publishing property
 */
export function usePublishProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: PUBLISH_PROPERTY_QUERY_KEY,
    mutationFn: async ({
      propertyId,
      ...body
    }: PublishPropertyBody & { propertyId: number }) => {
      const response = await publishProperty(propertyId, body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to publish.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

export const POPULAR_PROPERTIES_QUERY_KEY = [
  "popular-property-document",
] as const;

export function useGetPopularProperties() {
  return useQuery({
    queryKey: POPULAR_PROPERTIES_QUERY_KEY,
    queryFn: async () => {
      const response = await getPopularProperties();
      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to fetch popular properties."
        );
      }

      return response.data;
    },
  });
}

/**
 * Usage example:
 *
 * import { usePublishProperty } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = usePublishProperty();
 *
 * mutate({
 *   published: true
 * });
 *
 */

/* add unit mutation */

export const ADD_UNIT_QUERY_KEY = ["add-unit"] as const;
/**
 * Custom hook to add unit.
 *
 * This hook uses React Query's `useMutation` to handle the creation process.
 * It directly creates the cache for the property document list and the specific unit after a successful creation.
 *
 * @returns Mutation object containing methods and states for adding unit
 */
export function useAddUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_UNIT_QUERY_KEY,
    mutationFn: async (body: AddExtraUnitBody) => {
      const response = await addExtraUnit(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to add.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

export const UPDATE_UNIT_QUERY_KEY = ["update-unit"] as const;

/**
 * Custom hook to update unit.
 *
 * This hook uses React Query's `useMutation` to handle the update process.
 * It directly updates the cache for the unit after a successful update.
 *
 * @returns Mutation object containing methods and states for updating unit
 */
export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_UNIT_QUERY_KEY,
    mutationFn: async ({
      unitId,
      ...body
    }: AddExtraUnitBody & { unitId: number; existing_photos?: number[] }) => {
      const response = await updateExtraUnit(unitId, body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to update unit.");
      }

      return response.data;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { usePublishProperty } from "@/hooks/api/use-properties";
 *
 * const { mutate, error, isPending } = usePublishProperty();
 *
 * mutate({
 *   published: true
 * });
 *
 */

export const GET_SINGLE_PROPERTY_QUERY_KEY = ["get-single-property"] as const;

export function useGetPropertyDetail(
  id: number
): UseQueryResult<GetSinglePropertyResponse, unknown> {
  return useQuery({
    queryKey: [...GET_SINGLE_PROPERTY_QUERY_KEY, id],
    queryFn: () => getSinglePropertyDetail(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useGetUnitDetail(
  id: number
): UseQueryResult<GetSingleUnitDetailResponse, unknown> {
  return useQuery({
    queryKey: [...GET_SINGLE_PROPERTY_QUERY_KEY, id],
    queryFn: () => getSingleUnitDetail(id),
    enabled: !!id,
  });
}

export function useGetAllUnitsByPropertyId(
  params: GetAllUnitsByPropertyIdParams & { propertyId: number }
): UseQueryResult<getAllUnitsByPropertyIdResponse, unknown> {
  return useQuery({
    queryKey: ["get-all-units", params],
    queryFn: () => getAllUnitsByPropertyId(params),
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: !!params.propertyId,
  });
}
export const GET_PROPERTY_METRICS_QUERY_KEY = ["get-property-metrics"] as const;

export function useGetPropertyMetrics(
  id: number
): UseQueryResult<GetPropertyMetricsResponse, unknown> {
  return useQuery({
    queryKey: [...GET_PROPERTY_METRICS_QUERY_KEY, id],
    queryFn: () => getPropertyMetrics(id),
    enabled: !!id,
  });
}

export const GET_COST_FEE_TYPES_QUERY_KEY = ["get-cost-fee-types"] as const;

export function useGetCostFeeTypes(
  id: number
): UseQueryResult<GetCostFeeTypesResponse, unknown> {
  return useQuery({
    queryKey: [GET_COST_FEE_TYPES_QUERY_KEY, id],
    queryFn: () => getCostFeeTypes(id),
    enabled: !!id,
  });
}

export const GET_DOCUMENT_TYPE = ["get_document_type"] as const;

export function useGetDocumentTypes(
  propertyId: number,
  unitId?: number
): UseQueryResult<GetDocumentsTypesResponse, unknown> {
  return useQuery({
    queryKey: [GET_DOCUMENT_TYPE, propertyId, unitId],
    queryFn: () => getDocumentTypes(propertyId, unitId),
    enabled: !!propertyId,
  });
}

export const POST_BULK_IMPORT = ["post_bulk_import"];

export const BULK_IMPORT_UNITS_KEY = ["bulk-import-units"] as const;

export function useBulkImportUnits() {
  const queryClient = useQueryClient();

  return useMutation<
    BulkImportUnitsResponse,
    unknown,
    BulkImportUnitsRequest & { onUploadProgress?: (progress: number) => void }
  >({
    mutationKey: BULK_IMPORT_UNITS_KEY,
    mutationFn: async ({ onUploadProgress, ...body }) => {
      const progressCallback = onUploadProgress
        ? (progressEvent: any) => {
            const percentCompleted = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            onUploadProgress(percentCompleted);
          }
        : undefined;

      const response = await bulkImportUnits(body, progressCallback);

      if (!response?.success) {
        throw new Error(response?.message || "Bulk import failed.");
      }

      return response;
    },
    onSuccess: (response) => {
      if (response?.success && response.data?.data.errors?.length === 0) {
        toast.success(
          response.message || "Bulk import completed successfully!"
        );
      }
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

export const PROPERTIES_QUERY_KEY = ["properties"] as const;

export const INFINITE_PROPERTIES_QUERY_KEY = ["infinite-properties"] as const;

/**
 * Custom hook to fetch and cache properties with infinite scrolling (pagination).
 *
 * This hook uses the `useInfiniteQuery` hook from React Query to fetch paginated properties.
 * It is useful for implementing infinite scroll UIs.
 *
 * @param params - The parameters to filter the list of properties (except page/limit).
 * @returns The infinite query result containing the list of properties.
 */

import type { UseInfiniteQueryResult } from "@tanstack/react-query";

export function useGetInfiniteProperties(
  params: Record<string, any> & { q?: string }
): UseInfiniteQueryResult<any, unknown> {
  return useInfiniteQuery({
    queryKey: [INFINITE_PROPERTIES_QUERY_KEY, params],
    queryFn: ({ pageParam = 1 }) =>
      getInfiniteProperties({ ...params, pageParam, q: params.q }),
    initialPageParam: 1,
    getNextPageParam: () => undefined,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}
