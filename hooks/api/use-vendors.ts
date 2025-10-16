import {
  keepPreviousData,
  QueryObserverOptions,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { errorHandler } from "@/helpers";
import {
  BlockVendorBody,
  BulkImportVendorsRequest,
  BulkImportVendorsResponse,
  GetVendorsListParams,
  InviteVendorBody,
  ResendInvitationVendorBody,
} from "@/services/vendor/types";
import {
  assignTaskToVendor,
  bulkImportVendors,
  deleteVendor,
  getVendorDetails,
  getVendorRoles,
  getVendorsList,
  inviteVendor,
  resendInvitationToVendor,
  updateVendorBlockStatus,
} from "@/services/vendor/vendor.service";
export interface GetVendorDetailsResponse {
  data: {
    basic_info: {
      full_name: string;
      vendor_role: string;
      phone_number: string;
      email: string;
      description: string;
    };
    vendor_info: {
      years_of_experience: string;
      availability: string;
      emergency_services: boolean;
      languages: string;
      insurance_coverage: boolean;
      registration_type: string;
      business_name: string;
      business_website: string;
      business_address: string;
      business_type: string;
      registration_id: string;
      business_license: any[];
    };
    services: {
      [category: string]: string[];
    };
    certification_info: Array<{
      name: string;
      url: string;
    }>;
  };
  error: string | null;
  success: boolean;
  message: string;
}

export const GET_VENDOR_DETAILS_QUERY_KEY = ["get-vendor-details"] as const;

/**
 * Custom hook to fetch and cache vendor details by id.
 *
 * @param id - The vendor id to fetch details for.
 * @returns The query result containing the vendor details.
 */

export function useGetVendorDetails(
  id: number | string,
  options?: QueryObserverOptions<GetVendorDetailsResponse, unknown>
): UseQueryResult<GetVendorDetailsResponse, unknown> {
  return useQuery<GetVendorDetailsResponse, unknown>({
    queryKey: [...GET_VENDOR_DETAILS_QUERY_KEY, id],
    queryFn: () => getVendorDetails(id),
    ...(options || {}),
    refetchOnWindowFocus: false,
  });
}

export const GET_VENDOR_ROLES = ["get-vendor-roles"] as const;

/**
 * Custom hook to fetch and cache the list of vendor roles.
 *
 * This hook uses the `useQuery` hook from React Query to fetch the list of vendor roles
 * and cache the result. It ensures that the data is fetched only once and is not
 * refetched on mount, window focus, or reconnect.
 *
 * @returns The query result containing the list of vendor roles.
 */

export interface GetVendorRolesResponse {
  data: Array<{
    value: string;
    label: string;
  }>;
  error: string | null;
  success: boolean;
  message: string;
}

export function useGetVendorRoles(): UseQueryResult<
  GetVendorRolesResponse,
  unknown
> {
  return useQuery({
    queryKey: GET_VENDOR_ROLES,
    queryFn: () => getVendorRoles(),
  });
}

export const GET_VENDORS_LIST_QUERY_KEY = ["get-vendors-list"] as const;

/**
 * Custom hook to fetch and cache the list of vendors.
 *
 * This hook uses the `useQuery` hook from React Query to fetch the list of vendors
 * and cache the result. It ensures that the data is fetched only once and is not
 * refetched on mount, window focus, or reconnect.
 *
 * @param params - The parameters to filter the list of vendors.
 * @returns The query result containing the list of vendors.
 */

export interface GetVendorsListResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Vendor[];
  };
  error: string | null;
  success: boolean;
  message: string;
}

interface Vendor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  accepted: boolean;
  blocked: boolean;
  created_at: string;
}

export function useGetVendorsList(
  params: GetVendorsListParams
): UseQueryResult<GetVendorsListResponse, unknown> {
  return useQuery({
    queryKey: [...GET_VENDORS_LIST_QUERY_KEY, params],
    queryFn: () => getVendorsList(params),
    placeholderData: keepPreviousData,
    // refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

/**
 * Usage example:
 *
 * import { useGetVendorsList } from "@/hooks/api/use-properties";
 *
 * const { data, error, isLoading } = useGetVendorsList({
 *   page: 1,
 *   q: "search query",
 *   accepted: "true",
 *   blocked: "false",
 * });
 *
 */

export const INVITE_VENDORS_QUERY_KEY = ["invite-vendors"] as const;

/**
 * Custom hook to invite vendor.
 *
 * This hook uses React Query's `useMutation` to handle the invitation process.
 * It directly creates the cache for the vendor list and the specific vendor after a successful invitation process.
 *
 * @returns Mutation object containing methods and states for inviting a vendor.
 */
export function useInviteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: INVITE_VENDORS_QUERY_KEY,
    mutationFn: async (body: InviteVendorBody) => {
      const response = await inviteVendor(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to invite vendor");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_VENDORS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useInviteVendor } from "@/hooks/api/use-properties";
 *
 * const Component = () => {
 *   const { mutate: inviteVendor, isLoading } = useInviteVendor();
 *
 *   const handleInvite = () => {
 *     inviteVendor({
 *       email: "vendor@example.com",
 *       first_name: "John",
 *       last_name: "Doe"
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleInvite} disabled={isLoading}>
 *       {isLoading ? "Inviting..." : "Invite Vendor"}
 *     </button>
 *   );
 * };
 */

export const BLOCK_VENDOR_QUERY_KEY = ["block-vendor"] as const;

/**
 * Custom hook to block vendor.
 *
 * This hook uses React Query's `useMutation` to handle the block process.
 * It directly creates the cache for the vendor list and the specific vendor after a successful block process.
 *
 * @returns Mutation object containing methods and states for blocking a vendor.
 */
export function useUpdateVendorBlockStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: BLOCK_VENDOR_QUERY_KEY,
    mutationFn: async (body: BlockVendorBody) => {
      const response = await updateVendorBlockStatus(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to add block vendor");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_VENDORS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useInviteVendor } from "@/hooks/api/use-properties";
 *
 * const Component = () => {
 *   const { mutate: inviteVendor, isLoading } = useInviteVendor();
 *
 *   const handleInvite = () => {
 *     inviteVendor({
 *       email: "vendor@example.com",
 *       first_name: "John",
 *       last_name: "Doe"
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleInvite} disabled={isLoading}>
 *       {isLoading ? "Inviting..." : "Invite Vendor"}
 *     </button>
 *   );
 * };
 */

export const DELETE_VENDOR_QUERY_KEY = ["delete-vendor"] as const;
/**
 * Custom hook to delete vendor.
 *
 * This hook uses React Query's `useMutation` to handle the deletion process.
 * It directly creates the cache for the vendor list and the specific vendor after a successful deletion process.
 *
 * @returns Mutation object containing methods and states for deleting a vendor.
 */
export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: DELETE_VENDOR_QUERY_KEY,
    mutationFn: async (vendorId: number) => {
      const response = await deleteVendor(vendorId);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to delete vendor");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_VENDORS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useDeleteVendor } from "@/hooks/api/use-properties";
 *
 * const Component = () => {
 *   const { mutate: deleteVendor, isLoading } = useDeleteVendor();
 *
 *   const handleDelete = (vendorId: number) => {
 *     deleteVendor(vendorId);
 *   };
 *
 *   return (
 *     <button onClick={() => handleDelete(1)} disabled={isLoading}>
 *       {isLoading ? "Deleting..." : "Delete Vendor"}
 *     </button>
 *   );
 * };
 */

export const ASSIGN_TASK_QUERY_KEY = ["assign-task"] as const;
/**
 * Custom hook to assign task to vendor.
 *
 * This hook uses React Query's `useMutation` to handle the assignment process.
 * It directly creates the cache for the vendor list and the specific vendor after a successful assignment process.
 *
 * @returns Mutation object containing methods and states for assigning task to a vendor.
 */
export function useAssignTaskToVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ASSIGN_TASK_QUERY_KEY,
    mutationFn: async ({
      vendorId,
      taskId,
    }: {
      vendorId: string;
      taskId: string;
    }) => {
      const response = await assignTaskToVendor(vendorId, taskId);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to assign task to vendor");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_VENDORS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useAssignTaskToVendor } from "@/hooks/api/use-properties";
 *
 * const Component = () => {
 *   const { mutate: assignTask, isLoading } = useAssignTaskToVendor();
 *
 *   const handleAssign = () => {
 *     assignTask(1, "task_1");
 *   };
 *
 *   return (
 *     <button onClick={handleAssign} disabled={isLoading}>
 *       {isLoading ? "Assigning..." : "Assign Task"}
 *     </button>
 *   );
 * };
 */

export const BULK_IMPORT_VENDORS_KEY = ["bulk-import-vendors"] as const;

export function useBulkImportVendors() {
  const queryClient = useQueryClient();

  return useMutation<
    BulkImportVendorsResponse,
    unknown,
    BulkImportVendorsRequest & { onUploadProgress?: (progress: number) => void }
  >({
    mutationKey: BULK_IMPORT_VENDORS_KEY,
    mutationFn: async ({ onUploadProgress, ...body }) => {
      const progressCallback = onUploadProgress
        ? (progressEvent: any) => {
            const percentCompleted = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            onUploadProgress(percentCompleted);
          }
        : undefined;

      const response = await bulkImportVendors(body, progressCallback);

      if (!response?.success) {
        throw new Error(response?.message || "Bulk import failed.");
      }

      return response;
    },
    onSuccess: (response) => {
      if (
        response?.success &&
        (!response.error || response.error.length === 0)
      ) {
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

export const RESEND_INVITATION_VENDOR_KEY = [
  "resend-invitation-vendor",
] as const;

export function useResendInvitationToVendor() {
  const queryClient = useQueryClient();

  return useMutation<any, unknown, ResendInvitationVendorBody>({
    mutationKey: RESEND_INVITATION_VENDOR_KEY,
    mutationFn: async (body: ResendInvitationVendorBody) => {
      const response = await resendInvitationToVendor(body);

      return response;
    },
    onSuccess: () => {
      toast.success("Invitation resent successfully!");
      queryClient.invalidateQueries({ queryKey: GET_VENDORS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}
