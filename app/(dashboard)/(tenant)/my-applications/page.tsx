import { NextPage } from "next";
import React, { Suspense } from "react";

import MyApplications from "@/components/dashboard/tenant-dashboard/my-applications";

const MyApplicationsPage: NextPage = () => {
  return (
    <Suspense>
      <MyApplications />;
    </Suspense>
  );
};

export default MyApplicationsPage;
