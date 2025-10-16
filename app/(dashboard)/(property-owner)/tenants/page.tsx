import { NextPage } from "next";
import { Suspense } from "react";

import TenantManagementComponent from "@/components/dashboard/property-owner-dashboard/tenants";

const TenantManagementPage: NextPage = () => {
  return (
    <Suspense>
      <TenantManagementComponent />
    </Suspense>
  );
};

export default TenantManagementPage;
