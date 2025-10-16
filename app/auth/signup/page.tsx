import { Suspense } from "react";

import { SignUpPage } from "@/components/auth/sign-up-page";

export default function SignUpRoute() {
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  );
}
