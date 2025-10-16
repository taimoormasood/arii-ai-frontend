"use client";

import { useRouter } from "next/navigation";

import { HomePropertyIcon, HomeRentIcon, VendorIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/auth-context";

export function FeatureCards() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleRoleSelection = (
    role: "tenant" | "property_owner" | "vendor"
  ) => {
    if (!isAuthenticated) {
      // If not logged in, redirect to login
      router.push(
        "/auth/login?redirect=" + encodeURIComponent(`/kyc?role=${role}`)
      );

      return;
    }

    // If logged in but KYC not verified, redirect to KYC
    if (user?.kyc_request?.status !== "approved") {
      router.push(`/kyc?role=${role}`);

      return;
    }

    router.push("/dashboard");
  };

  return (
    <section className="md:py-15 py-10 md:px-20 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cardsData.map((item) => (
          <div
            className="bg-primary-50 rounded-xl md:p-6 p-3 flex flex-col h-full"
            key={item.id}
          >
            <div className="mb-4">{<item.icon />}</div>
            <h2 className="text-xl font-semibold mt-3 text-gray-800">
              {item.title}
            </h2>
            <p className="text-gray-700 text-sm grow mt-1">
              {item.description}
            </p>
            <Button
              variant="outline"
              className="w-full mt-8 text-base font-semibold border-primary-500 shadow text-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() =>
                handleRoleSelection(
                  item.role as "tenant" | "property_owner" | "vendor"
                )
              }
            >
              {item.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

const cardsData = [
  {
    id: 1,
    icon: HomeRentIcon,
    title: "Rent",
    role: "tenant",
    buttonText: "Find a Property",
    description:
      "Choose from a variety of styles and sizes to suit your lifestyle, all with modern amenities and convenient access to transportation, shopping, and dining.",
  },
  {
    id: 2,
    icon: VendorIcon,
    title: "Vendors",
    role: "vendor",
    buttonText: "Browse Vendors",
    description:
      "Reliable vendors offering high-quality products and services to meet your business or personal needs. From local suppliers to specialized providers, find trusted partners to help you succeed.",
  },
  {
    id: 3,
    icon: HomePropertyIcon,
    title: "Properties",
    role: "property_owner",
    buttonText: "Find Options",
    description:
      "Explore a wide range of properties for sale or rent, including residential, commercial, and investment opportunities. Find the perfect space to live, work, or grow your portfolio.",
  },
];
