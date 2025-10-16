import { NextPage } from "next";
import React, { Suspense } from "react";

import { KycComponent } from "@/components/kyc";

const KycPage: NextPage = () => {
  return (
    <Suspense>
      <KycComponent />
    </Suspense>
  );
};

export default KycPage;
