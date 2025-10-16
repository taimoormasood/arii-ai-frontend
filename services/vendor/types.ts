export interface GetVendorsListParams {
  page?: number;
  limit?: number;
  q?: string;
  accepted?: boolean;
  blocked?: boolean;
}

export interface InviteVendorBody {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface BlockVendorBody {
  invitation_id: number;
  blocked: boolean;
}

// Bulk Import Types
export interface BulkImportVendorsRequest {
  file: File;
}

export interface BulkImportVendorsResponse {
  data: string;
  error: string[];
  success: boolean;
  message: string;
}

export interface ResendInvitationVendorBody {
  invitation_id: number;
  role: string;
}
