import React from "react";

import { useUpdateLeaseStatus } from "@/hooks/api/use-tenants";

const useTenantDetail = () => {
  const { mutate: updateLeaseStatus, isPending: isUpdatingLease } =
    useUpdateLeaseStatus();

  const handleLeaseUpdateStatus = (
    tenantId: number,
    action: string,
    successCallback?: () => void
  ) => {
    updateLeaseStatus(
      {
        invitation_id: tenantId,
        action: action,
      },
      {
        onSuccess: () => {
          successCallback?.();
        },
      }
    );
  };

  return { isUpdatingLease, handleLeaseUpdateStatus };
};

export default useTenantDetail;
