import { NextPage } from "next";
import React, { Suspense } from "react";

import RentalListing from "@/components/dashboard/universal-dashboard/rental-listing";

const RentalListingPage: NextPage = () => {
  return (
    <Suspense>
      <RentalListing />;
    </Suspense>
  );
};

export default RentalListingPage;
