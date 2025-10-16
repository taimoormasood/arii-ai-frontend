"use client";

import { HomeIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Logo } from "@/assets/images";

import { Button } from "../ui/button";
import OwnerSetupAccount from "./owner-setup-account";
import { VendorSetupAccount } from "./vendor-setup-account";

// Define valid roles as constants for better maintainability
const VALID_ROLES = {
  PROPERTY_OWNER: "property_owner",
  VENDOR: "vendor",
} as const;

type ValidRole = (typeof VALID_ROLES)[keyof typeof VALID_ROLES];

// Role selection component for invalid/missing roles
function RoleSelectionFallback() {
  const [selectedRole, setSelectedRole] = useState<ValidRole | null>(null);
  const searchParams = useSearchParams();

  const handleRoleSelection = (selectedRole: ValidRole) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("role", selectedRole);

    // Update URL without page reload
    const newUrl = `${window.location.pathname}?${current.toString()}`;
    window.history.pushState({}, "", newUrl);

    // Trigger a re-render by updating the URL
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleContinue = () => {
    if (selectedRole) {
      handleRoleSelection(selectedRole);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8">
      <div className="bg-white rounded-lg p-8 max-w-max border border-gray-200 w-full">
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          Please select your role to continue
        </h2>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Property Owner Option */}
          <button
            onClick={() => setSelectedRole(VALID_ROLES.PROPERTY_OWNER)}
            className={`w-full p-6 border rounded-lg transition-colors duration-200 ${
              selectedRole === VALID_ROLES.PROPERTY_OWNER
                ? "border-primary-600 bg-primary-50"
                : "border-gray-200 hover:border-primary-500 hover:bg-primary-50"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-6 h-6">
                <HomeIcon
                  className={`text-gray-700 font-medium ${selectedRole === VALID_ROLES.PROPERTY_OWNER ? "text-primary-500" : "text-gray-700"}`}
                />
              </div>
              <span
                className={`text-gray-700 font-medium ${selectedRole === VALID_ROLES.PROPERTY_OWNER ? "text-primary-500" : "text-gray-700"}`}
              >
                I'm a Property Owner
              </span>
            </div>
          </button>

          {/* Vendor Option */}
          <button
            onClick={() => setSelectedRole(VALID_ROLES.VENDOR)}
            className={`w-full p-6 border rounded-lg transition-colors duration-200 ${
              selectedRole === VALID_ROLES.VENDOR
                ? "border-primary-600 bg-primary-50"
                : "border-gray-200 hover:border-primary-500 hover:bg-primary-50"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-6 h-6">
                <UserIcon
                  className={`text-gray-700 font-medium ${selectedRole === VALID_ROLES.VENDOR ? "text-primary-500" : "text-gray-700"}`}
                />
              </div>
              <span
                className={`text-gray-700 font-medium ${selectedRole === VALID_ROLES.VENDOR ? "text-primary-500" : "text-gray-700"}`}
              >
                I'm a Vendor
              </span>
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full mt-6"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

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

  // Validate and normalize role
  const normalizedRole = role as ValidRole | null;

  switch (normalizedRole) {
    case VALID_ROLES.PROPERTY_OWNER:
      return <OwnerSetupAccount />;

    case VALID_ROLES.VENDOR:
      return <VendorSetupAccount />;

    default:
      return <RoleSelectionFallback />;
  }
}

// Main exported component with Suspense boundary
export default function SetupAccountComponent() {
  return (
    <Suspense fallback={<SetupAccountLoading />}>
      <div className="min-h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <Image src={Logo} width={146} height={57} alt="Logo" />
          </Link>
        </div>
        <main className="w-full py-12 mx-auto">
          <SetupAccountContent />
        </main>
      </div>
    </Suspense>
  );
}
