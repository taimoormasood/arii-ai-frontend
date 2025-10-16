import { NextPage } from "next";
import React, { Suspense } from "react";

import SetupAccountComponent from "@/components/auth/setup-account";

const SetupAccountPage: NextPage = () => {
  return (
    <Suspense>
      <SetupAccountComponent />
    </Suspense>
  );
};

export default SetupAccountPage;
