import { NextPage } from "next";
import React, { Suspense } from "react";

import DashboardComponent from "@/components/dashboard";

const DashboardPage: NextPage = () => {
  return (
    <Suspense>
      <DashboardComponent />
    </Suspense>
  );
};

export default DashboardPage;
