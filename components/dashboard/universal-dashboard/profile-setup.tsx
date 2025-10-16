"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import OwnerSetupAccount from "@/components/auth/owner-setup-account";
import { VendorSetupAccount } from "@/components/auth/vendor-setup-account";

import { TenantSetupAccount } from "./tenant-setup-account";

// Define valid roles as constants for better maintainability
const VALID_ROLES = {
  PROPERTY_OWNER: "property_owner",
  VENDOR: "vendor",
  TENANT: "tenant", // Added tenant role for clarity
} as const;

type ValidRole = (typeof VALID_ROLES)[keyof typeof VALID_ROLES];

// Role mapping from URL parameters to component roles
const ROLE_MAPPING = {
  "property-manager": VALID_ROLES.PROPERTY_OWNER,
  vendor: VALID_ROLES.VENDOR,
  tenant: VALID_ROLES.TENANT, // Added tenant mapping
} as const;

// Loading component for Suspense boundary
function SetupAccountLoading() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

// Main component logic extracted for easier testing
function SetupAccountContent() {
  const searchParams = useSearchParams();
  const [forceRerender, setForceRerender] = useState(0);

  // Listen for popstate events to trigger re-renders when URL changes
  useEffect(() => {
    const handlePopState = () => {
      setForceRerender((prev) => prev + 1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const role = searchParams.get("role")?.toLowerCase().trim();

  // Map the role from URL to component role
  const mappedRole = role
    ? ROLE_MAPPING[role as keyof typeof ROLE_MAPPING]
    : null;

  switch (mappedRole) {
    case VALID_ROLES.PROPERTY_OWNER:
      return <OwnerSetupAccount />;

    case VALID_ROLES.VENDOR:
      return <VendorSetupAccount />;

    case VALID_ROLES.TENANT:
      // If the role is tenant, we can render a specific component or message
      return <TenantSetupAccount />;

    default:
      // If no valid role is provided, show a simple message
      return (
        <div className="flex flex-col items-center justify-center min-h-96 p-8">
          <div className="bg-white rounded-lg p-8 max-w-max border border-gray-200 w-full text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Invalid Role
            </h2>
            <p className="text-gray-600">
              Please go back and select a valid role to continue.
            </p>
          </div>
        </div>
      );
  }
}

// Main exported component with Suspense boundary
export default function ProfileSetup() {
  return (
    <Suspense fallback={<SetupAccountLoading />}>
      <div className="min-h-screen flex flex-col">
        <main className="w-full  mx-auto">
          <SetupAccountContent />
        </main>
      </div>
    </Suspense>
  );
}
