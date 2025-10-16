"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import LocationIcon from "@/assets/icons/location-icon";
import { guruLogoGif, guruLogoText, homeImage } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/auth-context";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";
import { Input } from "../ui/input";
import { FiltersSidebar } from "./filters-sidebar";

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<"rent" | "vendors">("rent");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { user } = useAuth();

  const router = useRouter();

  const isAlertVisisble =
    user?.kyc_request?.status === "pending" ||
    user?.kyc_request?.status === "rejected" ||
    user?.kyc_request?.status === "approved";

  return (
    <section
      className={`w-full min-h-[544px] pb-12 md:pb-24 px-4 md:px-16 rounded-3xl ${isAlertVisisble ? "pt-4" : "pt-12 md:pt-24"}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(119, 184, 0, 0.10) 0%, rgba(78, 205, 196, 0.10) 100%)",
      }}
    >
      {user && user?.kyc_request && user?.kyc_request?.status === "pending" && (
        <Alert variant={"error"} className="mb-4 shadow">
          <AlertTitle variant={"error"}>KYC Pending</AlertTitle>
          <AlertDescription>
            Your KYC verification is pending. We’ll notify you once reviewed.
          </AlertDescription>
        </Alert>
      )}

      {user &&
        user?.kyc_request &&
        user?.kyc_request?.status === "rejected" && (
          <Alert
            variant={"error"}
            className="mb-4 flex justify-between items-center gap-3 shadow"
          >
            <div className="flex flex-col space-y-2">
              <AlertTitle variant={"error"}>KYC Rejected</AlertTitle>
              <AlertDescription>
                Your KYC verification is rejected. Click below to view details.
              </AlertDescription>
            </div>
            <AlertAction>
              <Button
                className="bg-red-700 hover:bg-red-800 text-xs px-2 py-1"
                onClick={() => router.push(`/kyc?action=resubmit`)}
              >
                Resubmit KYC
              </Button>
            </AlertAction>
          </Alert>
        )}

      {user &&
        user?.kyc_request &&
        user?.kyc_request?.status === "approved" &&
        user?.property_owner_profile === null && (
          <Alert
            variant={"error"}
            className="mb-4 flex justify-between items-center gap-3 shadow"
          >
            <div className="flex flex-col space-y-2">
              <AlertTitle>KYC Accepted</AlertTitle>
              <AlertDescription>
                Your KYC verification is approved. Please setup your profile to
                continue.
              </AlertDescription>
            </div>
            <AlertAction>
              <Button
                className="bg-green-700 hover:bg-green-800 text-xs px-2 py-1"
                onClick={() => router.push(`/setup-account`)}
              >
                Setup Account
              </Button>
            </AlertAction>
          </Alert>
        )}
      <div className="relative flex w-full lg:justify-start justify-center">
        {/* Hero Content */}

        <div className=" items-end flex  gap-12">
          <div className="flex flex-col items-center lg:items-start lg:justify-start justify-center w-full max-w-lg">
            <Image src={guruLogoText} alt="Guru logo text" className="mb-6" />

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center lg:text-left">
              The Smart Rental System
            </h2>
            <p className="text-4 text-gray-600 mb-8 text-centenvr lg:text-left xl:max-w-3xl lg:max-w-72">
              Explore listings, assign vendors, and manage everything in one
              universal dashboard.
            </p>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200">
              <div className="flex flex-col xl:flex-row  gap-2">
                <input
                  type="text"
                  placeholder="Enter an address, neighborhood, or city"
                  className="flex-grow px-4 py-3 rounded-md focus:outline-none  placeholder:text-xs outline-none border-none"
                />
                <div className="flex items-center md:justify-center  gap-2">
                  <div className=" flex items-center justify-center gap-2 ">
                    <LocationIcon />{" "}
                    <span className="text-[14px] font-semibold flex-1">
                      {" "}
                      Locate Me
                    </span>
                  </div>
                  {/* </Button> */}
                  <Button className="flex-1 bg-primary-500 hover:bg-primary-700 text-white w-full md:w-auto transition-all duration-300 transform hover:scale-105 shadow-lg ">
                    Find Listing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}

        {/* Content */}
        <div className="absolute -bottom-[35%] -right-36 z-20 hidden lg:block h-full shrink-0 text-center px-4 md:px-0 w-full max-w-xl ">
          <div className="relative">
            <Image
              src={guruLogoGif}
              alt="Guru gif"
              className="w-20 h-20 lg:w-32 lg:h-32 object-contain absolute z-30  top-[78px] right-[20%] "
            />
            <Image
              width={359}
              height={400}
              src={homeImage}
              alt="Home Image"
              className=" absolute w-[280px] h-[237px] lg:w-[450px]  lg:h-[400px] object-fill"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
