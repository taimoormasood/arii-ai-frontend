import { NextPage } from "next";
import React, { Suspense } from "react";

import VerifyOtpComponent from "@/components/auth/verify-otp";

const VerifyOtpPage: NextPage = () => {
  return (
    <Suspense>
      <VerifyOtpComponent />
    </Suspense>
  );
};

export default VerifyOtpPage;
