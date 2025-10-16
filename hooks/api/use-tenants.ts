import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { errorHandler } from "@/helpers";
import {
  assignTaskToTenant,
  deleteTenant,
  getApplicationDetail,
  getInvitedTenantDetails,
  getTenantDetails,
  getTenantsList,
  inviteTenant,
  renewLease,
  resendInvitationToTenant,
  setupTenantProfile,
  submitRentalApplication,
  updateLeaseStatus,
  updateTenantBlockStatus,
  updateTenantProfile,
} from "@/services/tenant/tenant.service";
import {
  BlockTenantBody,
  GetApplicationDetailResponse,
  GetTenantsListParams,
  InviteTenantBody,
  RenewLeaseBody,
  ResendInvitationTenantBody,
  SetupTenantProfileBody,
  SubmitRentalApplicationBody,
  SubmitRentalApplicationResponse,
  UpdateLeaseStatusBody,
} from "@/services/tenant/types";

export const GET_TENANTS_LIST_QUERY_KEY = ["get-tenants-list"] as const;

/**
 * Custom hook to fetch and cache the list of tenants.
 *
 * This hook uses the `useQuery` hook from React Query to fetch the list of tenants
 * and cache the result. It ensures that the data is fetched only once and is not
 * refetched on mount, window focus, or reconnect.
 *
 * @param params - The parameters to filter the list of tenants.
 * @returns The query result containing the list of tenants.
 */

export interface GetTenantsListResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Tenant[];
  };
  error: string | null;
  success: boolean;
  message: string;
}

interface Tenant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  accepted: boolean;
  blocked: boolean;
  created_at: string;
  lease_ended?: boolean;
}

export interface GetInvitedTenantDetailsResponse {
  data: {
    basic_info: {
      full_name: string;
      phone_number: string;
      email: string;
      assignment_type: string;
      assignment_name: string;
      assignment_address: string;
      payment_due_date: string;
    };
    lease_info: {
      lease_amount: number;
      security_deposit: number;
      lease_start_date: string;
      lease_end_date: string;
      lease_agreement_url: string;
      lease_ended: boolean;
    };
  };
  error: string | null;
  success: boolean;
  message: string;
}

export function useGetTenantsList(
  params: GetTenantsListParams
): UseQueryResult<GetTenantsListResponse, unknown> {
  return useQuery({
    queryKey: [...GET_TENANTS_LIST_QUERY_KEY, params],
    queryFn: () => getTenantsList(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

/**
 * Usage example:
 *
 * import { useGetTenantsList } from "@/hooks/api/use-tenants";
 *
 * const { data, error, isLoading } = useGetTenantsList({
 *   page: 1,
 *   q: "search query",
 *   accepted: "true",
 *   blocked: "false",
 * });
 *
 */

export const INVITE_TENANTS_QUERY_KEY = ["invite-tenants"] as const;

/**
 * Custom hook to invite tenant.
 *
 * This hook uses React Query's `useMutation` to handle the invitation process.
 * It directly creates the cache for the tenant list and the specific tenant after a successful invitation process.
 *
 * @returns Mutation object containing methods and states for inviting a tenant.
 */
export function useInviteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: INVITE_TENANTS_QUERY_KEY,
    mutationFn: async (body: InviteTenantBody) => {
      const response = await inviteTenant(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to invite tenant");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_TENANTS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useInviteTenant } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { mutate: inviteTenant, isLoading } = useInviteTenant();
 *
 *   const handleInvite = () => {
 *     inviteTenant({
 *       email: "tenant@example.com",
 *       first_name: "John",
 *       last_name: "Doe"
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleInvite} disabled={isLoading}>
 *       {isLoading ? "Inviting..." : "Invite Tenant"}
 *     </button>
 *   );
 * };
 */

export const BLOCK_TENANT_QUERY_KEY = ["block-tenant"] as const;

/**
 * Custom hook to block tenant.
 *
 * This hook uses React Query's `useMutation` to handle the block process.
 * It directly creates the cache for the tenant list and the specific tenant after a successful block process.
 *
 * @returns Mutation object containing methods and states for blocking a tenant.
 */
export function useUpdateTenantBlockStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: BLOCK_TENANT_QUERY_KEY,
    mutationFn: async (body: BlockTenantBody) => {
      const response = await updateTenantBlockStatus(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to block tenant");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_TENANTS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useUpdateTenantBlockStatus } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { mutate: blockTenant, isLoading } = useUpdateTenantBlockStatus();
 *
 *   const handleBlock = () => {
 *     blockTenant({
 *       invitation_id: 1,
 *       blocked: true
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleBlock} disabled={isLoading}>
 *       {isLoading ? "Blocking..." : "Block Tenant"}
 *     </button>
 *   );
 * };
 */

export const DELETE_TENANT_QUERY_KEY = ["delete-tenant"] as const;
/**
 * Custom hook to delete tenant.
 *
 * This hook uses React Query's `useMutation` to handle the deletion process.
 * It directly creates the cache for the tenant list and the specific tenant after a successful deletion process.
 *
 * @returns Mutation object containing methods and states for deleting a tenant.
 */
export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: DELETE_TENANT_QUERY_KEY,
    mutationFn: async (tenantId: number) => {
      const response = await deleteTenant(tenantId);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to delete tenant");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_TENANTS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useDeleteTenant } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { mutate: deleteTenant, isLoading } = useDeleteTenant();
 *
 *   const handleDelete = (tenantId: number) => {
 *     deleteTenant(tenantId);
 *   };
 *
 *   return (
 *     <button onClick={() => handleDelete(1)} disabled={isLoading}>
 *       {isLoading ? "Deleting..." : "Delete Tenant"}
 *     </button>
 *   );
 * };
 */

export const ASSIGN_TASK_TO_TENANT_QUERY_KEY = [
  "assign-task-to-tenant",
] as const;
/**
 * Custom hook to assign task to tenant.
 *
 * This hook uses React Query's `useMutation` to handle the assignment process.
 * It directly creates the cache for the tenant list and the specific tenant after a successful assignment process.
 *
 * @returns Mutation object containing methods and states for assigning task to a tenant.
 */
export function useAssignTaskToTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ASSIGN_TASK_TO_TENANT_QUERY_KEY,
    mutationFn: async ({
      tenantId,
      taskId,
    }: {
      tenantId: string;
      taskId: string;
    }) => {
      const response = await assignTaskToTenant(tenantId, taskId);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to assign task to tenant");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_TENANTS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useAssignTaskToTenant } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { mutate: assignTask, isLoading } = useAssignTaskToTenant();
 *
 *   const handleAssign = () => {
 *     assignTask({ tenantId: "1", taskId: "task_1" });
 *   };
 *
 *   return (
 *     <button onClick={handleAssign} disabled={isLoading}>
 *       {isLoading ? "Assigning..." : "Assign Task"}
 *     </button>
 *   );
 * };
 */

export const SETUP_TENANT_PROFILE_QUERY_KEY = ["setup-tenant-profile"] as const;

/**
 * Custom hook to setup tenant profile.
 *
 * This hook uses React Query's `useMutation` to handle the setup process.
 *
 * @returns Mutation object containing methods and states for setting up tenant profile.
 */
export function useSetupTenantProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: SETUP_TENANT_PROFILE_QUERY_KEY,
    mutationFn: async (body: SetupTenantProfileBody) => {
      const response = await setupTenantProfile(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to setup tenant profile");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_TENANTS_LIST_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useSetupTenantProfile } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { mutate: setupProfile, isLoading } = useSetupTenantProfile();
 *
 *   const handleSetup = () => {
 *     setupProfile({
 *       job_title: "Software Engineer",
 *       employment_status: "full-time",
 *       industry: "technology",
 *       income_range: "$70,000-$90,000"
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleSetup} disabled={isLoading}>
 *       {isLoading ? "Setting up..." : "Setup Profile"}
 *     </button>
 *   );
 * };
 */

export const GET_TENANT_DETAILS_QUERY_KEY = ["get-tenant-details"] as const;

/**
 * Custom hook to get tenant profile details.
 *
 * This hook uses React Query's `useQuery` to fetch tenant profile data.
 *
 * @returns Query object containing tenant profile data and states.
 */
export function useGetTenantDetails() {
  return useQuery({
    queryKey: GET_TENANT_DETAILS_QUERY_KEY,
    queryFn: () => getTenantDetails(),
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: 3,
  });
}

export const GET_INVITED_TENANT_DETAILS_QUERY_KEY = [
  "get-invited-tenant-details",
] as const;

/**
 * Custom hook to get invited tenant details.
 *
 * This hook uses React Query's `useQuery` to fetch invited tenant details including
 * basic information and lease information.
 *
 * @param tenantId - The ID of the tenant to fetch details for
 * @returns Query object containing invited tenant details and states.
 */
export function useGetInvitedTenantDetails(
  tenantId: number
): UseQueryResult<GetInvitedTenantDetailsResponse, unknown> {
  return useQuery({
    queryKey: [...GET_INVITED_TENANT_DETAILS_QUERY_KEY, tenantId],
    queryFn: () => getInvitedTenantDetails(tenantId),
    refetchOnWindowFocus: false,

    retry: 3,
    enabled: !!tenantId,
  });
}

export const UPDATE_TENANT_PROFILE_QUERY_KEY = [
  "update-tenant-profile",
] as const;

/**
 * Custom hook to update tenant profile.
 *
 * This hook uses React Query's `useMutation` to handle the update process.
 *
 * @returns Mutation object containing methods and states for updating tenant profile.
 */
export function useUpdateTenantProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_TENANT_PROFILE_QUERY_KEY,
    mutationFn: async (body: SetupTenantProfileBody) => {
      const response = await updateTenantProfile(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to update tenant profile");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_TENANTS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: GET_TENANT_DETAILS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useGetTenantDetails, useUpdateTenantProfile } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { data: tenantData, isLoading } = useGetTenantDetails();
 *   const { mutate: updateProfile, isPending } = useUpdateTenantProfile();
 *
 *   const handleUpdate = () => {
 *     updateProfile({
 *       job_title: "Senior Software Engineer",
 *       employment_status: "full-time",
 *       industry: "technology",
 *       income_range: "$70,000-$90,000"
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       {isLoading ? "Loading..." : JSON.stringify(tenantData)}
 *       <button onClick={handleUpdate} disabled={isPending}>
 *         {isPending ? "Updating..." : "Update Profile"}
 *       </button>
 *     </div>
 *   );
 * };
 */

export const RESEND_INVITATION_TENANT_QUERY_KEY = [
  "resend-invitation-tenant",
] as const;

/**
 * Custom hook to resend invitation to tenant.
 *
 * This hook uses React Query's `useMutation` to handle the resend invitation process.
 * It invalidates the tenants list cache after a successful resend.
 *
 * @returns Mutation object containing methods and states for resending invitation to a tenant.
 */
export function useResendInvitationToTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: RESEND_INVITATION_TENANT_QUERY_KEY,
    mutationFn: async (body: ResendInvitationTenantBody) => {
      const response = await resendInvitationToTenant(body);
      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to resend invitation to tenant"
        );
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_TENANTS_LIST_QUERY_KEY });
      toast.success("Invitation resent successfully");
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useResendInvitationToTenant } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { mutate: resendInvitation, isPending } = useResendInvitationToTenant();
 *
 *   const handleResend = () => {
 *     resendInvitation({
 *       invitation_id: 27,
 *       role: "tenant"
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleResend} disabled={isPending}>
 *       {isPending ? "Resending..." : "Resend Invitation"}
 *     </button>
 *   );
 * };
 */

export const UPDATE_LEASE_STATUS_QUERY_KEY = ["update-lease-status"] as const;

/**
 * Custom hook to update lease status for tenant.
 *
 * This hook uses React Query's `useMutation` to handle the lease status update process.
 * It invalidates the tenants list cache after a successful update.
 *
 * @returns Mutation object containing methods and states for updating lease status.
 */
export function useUpdateLeaseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_LEASE_STATUS_QUERY_KEY,
    mutationFn: async (body: UpdateLeaseStatusBody) => {
      const response = await updateLeaseStatus(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to update lease status");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_TENANTS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: GET_TENANT_DETAILS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: GET_INVITED_TENANT_DETAILS_QUERY_KEY,
      });
      toast.success("Lease status updated successfully");
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useUpdateLeaseStatus } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { mutate: updateLeaseStatus, isPending } = useUpdateLeaseStatus();
 *
 *   const handleEndLease = () => {
 *     updateLeaseStatus({
 *       invitation_id: 2,
 *       action: "end"
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleEndLease} disabled={isPending}>
 *       {isPending ? "Ending Lease..." : "End Lease"}
 *     </button>
 *   );
 * };
 */

export const RENEW_LEASE_QUERY_KEY = ["renew-lease"] as const;

/**
 * Custom hook to renew lease for tenant.
 *
 * This hook uses React Query's `useMutation` to handle the lease renewal process.
 * It invalidates the tenants list cache after a successful renewal.
 *
 * @returns Mutation object containing methods and states for renewing lease.
 */
export function useRenewLease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: RENEW_LEASE_QUERY_KEY,
    mutationFn: async (body: RenewLeaseBody) => {
      const response = await renewLease(body);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to renew lease");
      }

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GET_TENANTS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: GET_TENANT_DETAILS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: GET_INVITED_TENANT_DETAILS_QUERY_KEY,
      });
      toast.success("Lease renewed successfully");
    },
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useRenewLease } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { mutate: renewLease, isPending } = useRenewLease();
 *
 *   const handleRenewLease = () => {
 *     renewLease({
 *       invitation_id: 2,
 *       action: "renew",
 *       lease_start_date: "2025-02-01",
 *       lease_end_date: "2026-03-24",
 *       rent_amount: 2000,
 *       security_deposit: 4000,
 *       lease_agreement: fileObject
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleRenewLease} disabled={isPending}>
 *       {isPending ? "Renewing Lease..." : "Renew Lease"}
 *     </button>
 *   );
 * };
 */

export const SUBMIT_RENTAL_APPLICATION_QUERY_KEY = [
  "submit-rental-application",
] as const;

/**
 * Custom hook to submit rental application.
 *
 * This hook uses React Query's `useMutation` to handle the rental application submission process.
 *
 * @returns Mutation object containing methods and states for submitting rental application.
 */
export function useSubmitRentalApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: SUBMIT_RENTAL_APPLICATION_QUERY_KEY,
    mutationFn: async (body: SubmitRentalApplicationBody) => {
      const response = await submitRentalApplication(body);
      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to submit rental application"
        );
      }

      return response;
    },

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });
}

/**
 * Usage example:
 *
 * import { useSubmitRentalApplication } from "@/hooks/api/use-tenants";
 *
 * const Component = () => {
 *   const { mutate: submitApplication, isPending } = useSubmitRentalApplication();
 *
 *   const handleSubmit = () => {
 *     submitApplication({
 *       property: 46,
 *       unit: 153,
 *       application_type: "someone_else",
 *       full_name: "John Doe",
 *       email: "john.doe@example.com",
 *       phone: "123-456-7890",
 *       current_address: "123 Main St, City, State 12345",
 *       tenant_email: "jane.smith@example.com",
 *       tenant_phone: "123-456-7891",
 *       relationship_to_tenant: "spouse",
 *       check_in_date: "2025-03-01",
 *       check_out_date: "2026-03-01",
 *       special_requirements: "Wheelchair accessible unit required"
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleSubmit} disabled={isPending}>
 *       {isPending ? "Submitting..." : "Submit Application"}
 *     </button>
 *   );
 * };
 */

export const GET_APPLICATION_DETAIL_QUERY_KEY = [
  "get-application-detail",
] as const;

/**
 * Custom hook to get application detail.
 *
 * This hook uses React Query's `useQuery` to fetch application detail data.
 *
 * @param applicationId - The ID of the application to fetch details for
 * @returns Query object containing application detail data and states.
 */
export function useGetApplicationDetail(
  applicationId: string
): UseQueryResult<GetApplicationDetailResponse, unknown> {
  return useQuery({
    queryKey: [...GET_APPLICATION_DETAIL_QUERY_KEY, applicationId],
    queryFn: () => getApplicationDetail(applicationId),
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: !!applicationId,
  });
}

/**
 * Usage example:
 *
 * import { useGetApplicationDetail } from "@/hooks/api/use-tenants";
 *
 * const Component = ({ applicationId }) => {
 *   const { data, isLoading, error } = useGetApplicationDetail(applicationId);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error loading application details</div>;
 *
 *   return (
 *     <div>
 *       <h1>{data?.data.property_name}</h1>
 *       <p>Status: {data?.data.status}</p>
 *     </div>
 *   );
 * };
 */
