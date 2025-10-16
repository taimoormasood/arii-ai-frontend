import { NextPage } from "next";
import { Suspense } from "react";

import { UniversalDashboard } from "@/components/dashboard/universal-dashboard/universal-dashboard";

const UniversalDashboardPage: NextPage = () => {
  return (
    <Suspense>
      <UniversalDashboard />
    </Suspense>
  );
};

export default UniversalDashboardPage;
