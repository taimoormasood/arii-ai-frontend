export interface GetTenantsListParams {
  page?: number;
  limit?: number;
  q?: string;
  accepted?: boolean;
  blocked?: boolean;
}

export interface InviteTenantBody {
  first_name: string;
  last_name: string;
  email: string;
  assignment_id: number;
  assignment_type: string;
  tenant_type: string;
  lease_amount: number;
  security_deposit?: number;
  lease_start_date: Date | string | undefined;
  lease_end_date: Date | string | undefined;
  lease_agreement: File | null;
}

export interface BlockTenantBody {
  invitation_id: number;
  blocked: boolean;
}

export interface SetupTenantProfileBody {
  // Financial & Employment Data
  job_title?: string;
  employment_status?: string;
  industry?: string;
  income_range?: string;
  mortgage_amount?: number | string;
  credit_score_range?: string;
  debt_to_income_ratio?: string;
  investment_preferences?: string;

  // Property & Location Data
  property_type?: string;
  length_of_stay?: string;
  utility_cost_estimates?: string;
  lease_term?: number | undefined;
  preferred_rental_price_range?: string;
  current_home_value?: number | undefined;
  interest_in_moving?: string;

  // Risk & Behavior Data
  late_bill_payment_history?: string;
  spending_habits?: string;
  monthly_budget_allocations?: number | undefined;
  financial_goals?: string;

  // AI suggestions
  ai_for_suggestions?: boolean;

  // Page tracking
  page_saved?: number;
}

export interface ResendInvitationTenantBody {
  invitation_id: number;
  role: string;
}

export interface UpdateLeaseStatusBody {
  invitation_id: number;
  action: string;
}

export interface RenewLeaseBody {
  invitation_id: number;
  action: string;
  lease_start_date?: string;
  lease_end_date?: string;
  rent_amount?: number;
  security_deposit?: number;
  lease_agreement?: File;
}

export interface SubmitRentalApplicationBody {
  property: number;
  unit?: number;
  application_type: "self" | "someone_else";
  full_name: string;
  email: string;
  phone: string;
  current_address?: string;
  tenant_email?: string;
  tenant_phone?: string;
  relationship_to_tenant?: string;
  check_in_date: string;
  check_out_date: string;
  special_requirements?: string;
}

export interface SubmitRentalApplicationResponse {
  data: {
    id: number;
    property: number;
    unit?: number;
    property_name: string;
    unit_number?: string;
    application_type: "self" | "someone_else";
    status: string;
    full_name: string;
    email: string;
    phone: string;
    current_address: string | null;
    tenant_full_name: string | null;
    tenant_email: string | null;
    tenant_phone: string | null;
    relationship_to_tenant: string | null;
    check_in_date: string;
    check_out_date: string;
    special_requirements: string | null;
    created_at: string;
    updated_at: string;
  };
  error: string | null;
  success: boolean;
  message: string;
}

export interface GetApplicationDetailResponse {
  data: {
    id: string;
    property_name: string;
    property_address: string;
    unit_number?: string;
    application_date: string;
    check_in_date: string;
    check_out_date: string;
    status:
      | "Submitted"
      | "Approved"
      | "Payment Pending"
      | "Lease Active"
      | "Rejected";
    current_step: number;
    full_name: string;
    email: string;
    phone: string;
    current_address?: string;
    special_requirements?: string;
    created_at: string;
    updated_at: string;
  };
  error: string | null;
  success: boolean;
  message: string;
}
