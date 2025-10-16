import axiosInstance from "@/lib/axios";

import {
  type ForgotPasswordBody,
  type LoginBody,
  type LogoutBody,
  RefreshTokenBody,
  type ResendBody,
  type ResetPasswordBody,
  type SetupOwnerProfile,
  type SetupVendorProfileBody,
  type SignupBody,
  type VerifPasswordBody,
  type VerifyKyc,
  type VerifyOtp,
} from "./types";

export const refreshToken = async (body: RefreshTokenBody) => {
  try {
    const res = await axiosInstance.post("/token/refresh/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (body: SignupBody) => {
  try {
    const res = await axiosInstance.post("/signup/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (body: VerifyOtp) => {
  try {
    const res = await axiosInstance.post(`/otp-verify/`, body);

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (body: LoginBody) => {
  try {
    const res = await axiosInstance.post("/token/", body);

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const reSendOtp = async (body: ResendBody) => {
  try {
    const res = await axiosInstance.post("/otp/", body);

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (body: ForgotPasswordBody) => {
  try {
    const res = await axiosInstance.post("/forgot-password/", body);

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (body: ResetPasswordBody) => {
  try {
    const res = await axiosInstance.post("/reset-password/", body);

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const requestOTP = async (body: ResendBody) => {
  try {
    const res = await axiosInstance.post("/request-otp", body);

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const verifyPassword = async (body: VerifPasswordBody) => {
  try {
    const res = await axiosInstance.post("/verify-password", body);

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (body: LogoutBody) => {
  try {
    const res = await axiosInstance.post("/logout", body);

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const verifyKyc = async (body: VerifyKyc) => {
  try {
    const formData = new FormData();

    formData.append("id_type", body.id_type);
    formData.append("front_image", body.front_image);
    formData.append("back_image", body.back_image || "");
    formData.append("notes", body.notes);

    const res = await axiosInstance.post("/kyc-request/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const setupOwnerProfile = async (body: SetupOwnerProfile) => {
  try {
    const formData = new FormData();

    formData.append("registration_type", body.registration_type);
    formData.append("business_name", body.business_name);
    formData.append("business_website", body.business_website);
    formData.append("business_address", body.business_address);
    formData.append(
      "company_registration_number",
      body.company_registration_number
    );
    formData.append("business_type", body.business_type);
    formData.append("profile_image_path", body.profile_image_path);
    formData.append("business_license", body.business_license);
    formData.append("user_id", String(body.user_id));

    const res = await axiosInstance.post("/property-owner-profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const setupVendorProfile = async (payload: SetupVendorProfileBody) => {
  try {
    const formData = new FormData();

    // Basic vendor profile fields
    if (payload.services_offered)
      formData.append("services_offered", payload.services_offered);
    if (payload.service_area)
      formData.append("service_area", payload.service_area);
    if (payload.years_of_experience)
      formData.append("years_of_experience", payload.years_of_experience);
    if (payload.availability)
      formData.append("availability", payload.availability);
    if (payload.daily_availability)
      formData.append("daily_availability", payload.daily_availability);
    if (payload.emergency_services)
      formData.append("emergency_services", payload.emergency_services);
    if (payload.languages) formData.append("languages", payload.languages);
    if (payload.insurance_coverage)
      formData.append("insurance_coverage", payload.insurance_coverage);
    if (payload.description)
      formData.append("description", payload.description);

    // Business info fields
    if (payload.vendor_role)
      formData.append("vendor_role", payload.vendor_role);
    if (payload.registration_type)
      formData.append("registration_type", payload.registration_type);
    if (payload.business_name)
      formData.append("business_name", payload.business_name);
    if (payload.business_website)
      formData.append("business_website", payload.business_website);
    if (payload.business_address)
      formData.append("business_address", payload.business_address);
    if (payload.company_registration_number)
      formData.append(
        "company_registration_number",
        payload.company_registration_number
      );
    if (payload.business_type)
      formData.append("business_type", payload.business_type);

    // File uploads
    if (payload.profile_image_path)
      formData.append("profile_image_path", payload.profile_image_path);
    if (payload.business_license)
      formData.append("business_license", payload.business_license);

    // Conditionally append insurance_years_of_experience if coverage is true and data exists
    if (
      payload.insurance_coverage === "true" &&
      payload.insurance_years_of_experience
    ) {
      formData.append(
        "insurance_years_of_experience",
        payload.insurance_years_of_experience
      );
    }

    // Append each certificate file for 'other_certificates'
    // The backend should be configured to handle multiple files under this key
    if (payload.other_certificates && payload.other_certificates.length > 0) {
      payload.other_certificates.forEach((file) => {
        formData.append("other_certificates", file, file.name);
      });
    }

    const response = await axiosInstance.post("/vendor-profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data;
  } catch (error) {
    // You might want to handle specific error structures from your API here
    // or let the calling component handle it.
    // For now, re-throwing the error to be caught by the component:
    throw error;
  }
};

export const updateVendorProfile = async (payload: SetupVendorProfileBody) => {
  try {
    const formData = new FormData();

    // Business info fields
    if (payload.vendor_role)
      formData.append("vendor_role", payload.vendor_role);
    if (payload.registration_type)
      formData.append("registration_type", payload.registration_type);
    if (payload.business_name)
      formData.append("business_name", payload.business_name);
    if (payload.business_website)
      formData.append("business_website", payload.business_website);
    if (payload.business_address)
      formData.append("business_address", payload.business_address);
    if (payload.company_registration_number)
      formData.append(
        "company_registration_number",
        payload.company_registration_number
      );
    if (payload.business_type)
      formData.append("business_type", payload.business_type);

    // File uploads
    if (payload.profile_image_path)
      formData.append("profile_image_path", payload.profile_image_path);
    if (payload.business_license)
      formData.append("business_license", payload.business_license);

    const response = await axiosInstance.patch(`/vendor-profile/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getInvitationDetails = async (
  invitationId: string,
  role: "vendor" | "tenant"
) => {
  try {
    const res = await axiosInstance.get(
      `/invitation/${invitationId}/?${role}=true`
    );

    return res?.data;
  } catch (error) {
    throw error;
  }
};
