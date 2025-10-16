import { serializeParams } from "@/helpers/serialize-params";
import axiosInstance from "@/lib/axios";

import {
  BlockVendorBody,
  BulkImportVendorsRequest,
  BulkImportVendorsResponse,
  GetVendorsListParams,
  InviteVendorBody,
  ResendInvitationVendorBody,
} from "./types";

export const getVendorDetails = async (id: number | string) => {
  try {
    const res = await axiosInstance.get(`/invited-vendor-details/${id}/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceCategories = async () => {
  try {
    const res = await axiosInstance.get("/service-categories/");

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceSubCategories = async () => {
  try {
    const res = await axiosInstance.get("/service-subcategories/");

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getVendorsList = async ({
  q = "",
  accepted,
  blocked,
  page,
}: GetVendorsListParams) => {
  try {
    const params = {
      q,
      ...(page !== undefined ? { page } : {}),
      accepted,
      blocked,
    };
    const queryString = serializeParams(params);

    const res = await axiosInstance.get(
      `/invite-vendor/${queryString ? `?${queryString}` : ""}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getVendorRoles = async () => {
  try {
    const res = await axiosInstance.get("/vendor-roles/");

    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const inviteVendor = async (body: InviteVendorBody) => {
  try {
    const res = await axiosInstance.post("/invite-vendor/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateVendorBlockStatus = async (body: BlockVendorBody) => {
  try {
    const res = await axiosInstance.patch("/invite-vendor/", body);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteVendor = async (vendorId: number) => {
  try {
    const res = await axiosInstance.delete(`/invite-vendor/${vendorId}/`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const assignTaskToVendor = async (vendorId: string, taskId: string) => {
  try {
    const res = await axiosInstance.post(`/assign-task/`, {
      vendorId,
      taskId,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const bulkImportVendors = async (
  body: BulkImportVendorsRequest,
  onUploadProgress?: (progressEvent: any) => void
): Promise<BulkImportVendorsResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", body.file);
    const res = await axiosInstance.post("/invite-vendor-bulk/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const resendInvitationToVendor = async (
  payload: ResendInvitationVendorBody
) => {
  try {
    const res = await axiosInstance.post("/resend-invitation/", payload);

    return res.data;
  } catch (error) {
    throw error;
  }
};
