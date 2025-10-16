import { NextPage } from "next";
import React, { Suspense } from "react";

import ResetPassword from "@/components/auth/reset-password";

const ResetPasswordPage: NextPage = () => {
  return (
    <Suspense>
      <ResetPassword />;
    </Suspense>
  );
};

export default ResetPasswordPage;
