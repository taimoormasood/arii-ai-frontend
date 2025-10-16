import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getInvitationDetails } from "@/services/auth/auth.service";

export const GET_INVITATION_DETAILS = ["get-invitation-details"] as const;

/**
 * Custom hook to fetch and cache the invitation details.
 *
 * This hook uses the `useQuery` hook from React Query to fetch the invitation details
 * and cache the result. It ensures that the data is fetched only once and is not
 * refetched on mount, window focus, or reconnect.
 *
 * @param params - The parameters to get the invitation details.
 * @returns The query result containing the invitation details.
 */

export interface InvitationDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  expired_at: string;
  sender?: string;
  sender_name?: string;
  lease_start_date: string;
  lease_end_date: string;
  lease_agreement_url: string;
  lease_ended: boolean;
}

export interface GetInvitationResponse {
  data: InvitationDetails;
  error: string | null;
  success: boolean;
  message: string;
}

export function useGetInvitationDetail(
  invitation_id: string,
  role: "vendor" | "tenant"
): UseQueryResult<GetInvitationResponse, unknown> {
  return useQuery({
    queryKey: [...GET_INVITATION_DETAILS, invitation_id],
    queryFn: () => getInvitationDetails(invitation_id, role),
    enabled: !!invitation_id,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

/**
 * Usage example:
 *
 * import { useGetInvitationDetail } from "@/hooks/api/use-invitation";
 *
 * const { data, error, isLoading } = useGetInvitationDetail("123");
 * });
 *
 */
