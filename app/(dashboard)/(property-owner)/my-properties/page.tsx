import { Suspense } from "react";

import MyPropertiesComponent from "@/components/dashboard/property-owner-dashboard/my-properties";

const MyPropertiesPage = () => {
  return (
    <Suspense>
      <MyPropertiesComponent />
    </Suspense>
  );
};

export default MyPropertiesPage;
