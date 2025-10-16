import React, { Suspense } from "react";

import PropertyDetailView from "@/components/dashboard/property-owner-dashboard/my-properties/property-view";

const PropertyDetailPage = () => {
  return (
    <Suspense>
      <PropertyDetailView />
    </Suspense>
  );
};

export default PropertyDetailPage;
