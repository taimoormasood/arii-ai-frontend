import { serializeParams } from "@/helpers/serialize-params";
import axiosInstance from "@/lib/axios";

import {
  BlockTenantBody,
  GetTenantsListParams,
  InviteTenantBody,
  RenewLeaseBody,
  ResendInvitationTenantBody,
  SetupTenantProfileBody,
  SubmitRentalApplicationBody,
  UpdateLeaseStatusBody,
} from "./types";

export const getTenantsList = async ({
  q = "",
  accepted,
  blocked,
  page,
}: GetTenantsListParams) => {
  try {
    const params = {
      q,
      ...(page !== undefined ? { page } : {}),
      accepted,
      blocked,
    };
    const queryString = serializeParams(params);

    const res = await axiosInstance.get(
      `/invite-tenant/${queryString ? `?${queryString}` : ""}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const inviteTenant = async (body: InviteTenantBody) => {
  try {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const res = await axiosInstance.post("/invite-tenant/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateTenantBlockStatus = async (body: BlockTenantBody) => {
  try {
    const res = await axiosInstance.patch("/invite-tenant/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTenant = async (tenantId: number) => {
  try {
    const res = await axiosInstance.delete(`/invite-tenant/${tenantId}/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const assignTaskToTenant = async (tenantId: string, taskId: string) => {
  try {
    const res = await axiosInstance.post(`/assign-task/`, {
      tenantId,
      taskId,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const setupTenantProfile = async (payload: SetupTenantProfileBody) => {
  try {
    const formData = new FormData();

    // Financial & Employment Data
    if (payload.job_title) formData.append("job_title", payload.job_title);
    if (payload.employment_status)
      formData.append("employment_status", payload.employment_status);
    if (payload.industry) formData.append("industry", payload.industry);
    if (payload.income_range)
      formData.append("income_range", payload.income_range);
    if (payload.mortgage_amount !== undefined)
      formData.append("mortgage_amount", String(payload.mortgage_amount));
    if (payload.credit_score_range)
      formData.append("credit_score_range", payload.credit_score_range);
    if (payload.debt_to_income_ratio)
      formData.append("debt_to_income_ratio", payload.debt_to_income_ratio);
    if (payload.investment_preferences)
      formData.append("investment_preferences", payload.investment_preferences);

    // Page tracking
    if (payload.page_saved !== undefined)
      formData.append("page_saved", String(payload.page_saved));

    const response = await axiosInstance.post("/tenant-profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getTenantDetails = async () => {
  try {
    const res = await axiosInstance.get("/tenant-profile/");

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateTenantProfile = async (payload: SetupTenantProfileBody) => {
  try {
    const formData = new FormData();

    // Financial & Employment Data
    if (payload.job_title) formData.append("job_title", payload.job_title);
    if (payload.employment_status)
      formData.append("employment_status", payload.employment_status);
    if (payload.industry) formData.append("industry", payload.industry);
    if (payload.income_range)
      formData.append("income_range", payload.income_range);
    if (payload.mortgage_amount !== undefined)
      formData.append("mortgage_amount", String(payload.mortgage_amount));
    if (payload.credit_score_range)
      formData.append("credit_score_range", payload.credit_score_range);
    if (payload.debt_to_income_ratio)
      formData.append("debt_to_income_ratio", payload.debt_to_income_ratio);
    if (payload.investment_preferences)
      formData.append("investment_preferences", payload.investment_preferences);

    // Property & Location Data (from screenshots)
    if (payload.property_type)
      formData.append("property_type", payload.property_type);
    if (payload.length_of_stay)
      formData.append("length_of_stay", payload.length_of_stay);
    if (payload.utility_cost_estimates)
      formData.append("utility_cost_estimates", payload.utility_cost_estimates);
    if (payload.lease_term)
      formData.append("lease_term", String(payload.lease_term));
    if (payload.preferred_rental_price_range)
      formData.append(
        "preferred_rental_price_range",
        payload.preferred_rental_price_range
      );
    if (payload.current_home_value)
      formData.append("current_home_value", String(payload.current_home_value));
    if (payload.interest_in_moving)
      formData.append("interest_in_moving", payload.interest_in_moving);

    // Risk & Behavior Data (from screenshots)
    if (payload.late_bill_payment_history)
      formData.append(
        "late_bill_payment_history",
        payload.late_bill_payment_history
      );
    if (payload.spending_habits)
      formData.append("spending_habits", payload.spending_habits);
    if (payload.monthly_budget_allocations)
      formData.append(
        "monthly_budget_allocations",
        String(payload.monthly_budget_allocations)
      );
    if (payload.financial_goals)
      formData.append("financial_goals", payload.financial_goals);

    // AI suggestions flag
    if (payload.ai_for_suggestions !== undefined)
      formData.append("ai_for_suggestions", String(payload.ai_for_suggestions));

    // Page tracking
    if (payload.page_saved !== undefined)
      formData.append("page_saved", String(payload.page_saved));

    const response = await axiosInstance.patch("/tenant-profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const resendInvitationToTenant = async (
  payload: ResendInvitationTenantBody
) => {
  try {
    const res = await axiosInstance.post("/resend-invitation/", payload);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateLeaseStatus = async (payload: UpdateLeaseStatusBody) => {
  try {
    const formData = new FormData();

    formData.append("invitation_id", String(payload.invitation_id));
    formData.append("action", payload.action);

    const res = await axiosInstance.put("/manage-lease/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const renewLease = async (payload: RenewLeaseBody) => {
  try {
    const formData = new FormData();

    formData.append("invitation_id", String(payload.invitation_id));
    formData.append("action", payload.action);

    if (payload.lease_start_date) {
      formData.append("lease_start_date", payload.lease_start_date);
    }
    if (payload.lease_end_date) {
      formData.append("lease_end_date", payload.lease_end_date);
    }
    if (payload.rent_amount !== undefined) {
      formData.append("rent_amount", String(payload.rent_amount));
    }
    if (payload.security_deposit !== undefined) {
      formData.append("security_deposit", String(payload.security_deposit));
    }
    if (payload.lease_agreement) {
      formData.append("lease_agreement", payload.lease_agreement);
    }

    const res = await axiosInstance.put("/manage-lease/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getInvitedTenantDetails = async (tenantId: number) => {
  try {
    const res = await axiosInstance.get(`/invited-tenant-details/${tenantId}/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const submitRentalApplication = async (
  payload: SubmitRentalApplicationBody
) => {
  try {
    const res = await axiosInstance.post("/rental-application/apply/", payload);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getApplicationDetail = async (applicationId: string) => {
  try {
    const res = await axiosInstance.get(
      `/rental-application/detail/${applicationId}/`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};
