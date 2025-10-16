import { NextPage } from "next";
import { Suspense } from "react";

import VendorManagementComponent from "@/components/dashboard/property-owner-dashboard/vendors";

const VendorManagementPage: NextPage = () => {
  return (
    <Suspense>
      <VendorManagementComponent />
    </Suspense>
  );
};

export default VendorManagementPage;
