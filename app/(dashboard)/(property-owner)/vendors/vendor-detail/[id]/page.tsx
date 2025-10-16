import React, { Suspense } from "react";

import VendorDetailComponent from "@/components/dashboard/property-owner-dashboard/vendors/vendor-detail";

const VendorDetailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="text-center py-8">Loading vendor details...</div>
      }
    >
      <VendorDetailComponent />
    </Suspense>
  );
};

export default VendorDetailPage;
