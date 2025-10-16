"use client";

import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { z } from "zod";

import {
  AmVendorIcon,
  ChatAiIcon,
  CommunicationIcon,
  PropertyManagerIcon,
  TenantIcon,
  ViewMarketplaceIcon,
  ViewPaymentIcon,
  ViewRentalIcon,
  WarningIcon,
} from "@/assets/icons";
import { guruLogo } from "@/assets/images";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetPopularProperties } from "@/hooks/api/use-properties";
import { useAuth } from "@/lib/contexts/auth-context";

import { KycComponent } from "./kyc-component";
import PopularPropertyCard from "./popular-property-card";
import ProfileSetup from "./profile-setup";
import RentalListing from "./rental-listing";

// Enums for search parameters
enum DashboardView {
  ROLE_SELECTION = "role-selection",
  KYC_FORM = "kyc-form",
  PROFILE_SETUP = "profile-setup",
  DASHBOARD = "dashboard",
}

enum UserRole {
  NONE = "",
  PROPERTY_MANAGER = "property-manager",
  VENDOR = "vendor",
  TENANT = "tenant",
}

export function UniversalDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as UserRole) || null;
  const view = (searchParams.get("view") as DashboardView) || null;
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    UserRole.PROPERTY_MANAGER
  );
  const { data } = useGetPopularProperties();
  const { user, updateUser } = useAuth();
  const [skippedProfile, setSkippedProfile] = useState(false);
  const [showProfileAlert, setShowProfileAlert] = useState(true);

  const updateSearchParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });
    router.push(`?${newSearchParams.toString()}`);
  };

  const isProfileCompleted = user?.roles?.length;

  const roles = [
    {
      id: UserRole.PROPERTY_MANAGER,
      title: "I'm a Property Manager",
      description:
        "Manage properties, collect rent, and find trusted tenants – your rental empire starts here",
      icon: PropertyManagerIcon,
      badge: "KYC Required",
      highlighted: true,
    },
    {
      id: UserRole.VENDOR,
      title: "I'm a Vendor",
      description:
        "Offer your services to verified landlords, receive job requests, and grow your client base.",
      icon: AmVendorIcon,
      badge: "KYC Required",
      highlighted: false,
    },
    {
      id: UserRole.TENANT,
      title: "I'm a Tenant",
      description:
        "Browse listings, apply for rentals, and manage your lease – no paperwork needed to get started!",
      icon: TenantIcon,
      badge: null,
      highlighted: false,
    },
  ];

  const quickLinks = [
    {
      title: "View Rental",
      icon: ViewRentalIcon,
      color: "text-primary-600",
      locked: false,
    },
    {
      title: "View Marketplace",
      icon: ViewMarketplaceIcon,
      color: "text-primary-600",
      locked: false,
    },
    {
      title: "View Payment",
      icon: ViewPaymentIcon,
      color: "text-primary-600",
      locked: false,
    },
    {
      title: "Chat with AI",
      icon: ChatAiIcon,
      color: "text-primary-600",
      locked: false,
    },
    {
      title: "Communication",
      icon: CommunicationIcon,
      color: "text-primary-600",
      locked: false,
    },
  ];

  const handleRoleSelection = () => {
    if (selectedRole) {
      if (user?.kyc_request?.status === "rejected") {
        updateSearchParams({
          role: selectedRole,
          view: DashboardView.KYC_FORM,
          action: "resubmit",
        });
      } else {
        updateSearchParams({
          role: selectedRole,
          view:
            user?.kyc_request === null
              ? DashboardView.KYC_FORM
              : DashboardView.DASHBOARD,
        });
      }
    }
  };

  const handleCompleteProfileClick = () => {
    updateSearchParams({
      view: DashboardView.PROFILE_SETUP,
      role: role || selectedRole || UserRole.PROPERTY_MANAGER,
    });
  };

  const getMainComponent = () => {
    if (role === UserRole.TENANT) {
      return DashboardView.PROFILE_SETUP;
    }
    if (view === DashboardView.PROFILE_SETUP) {
      return DashboardView.PROFILE_SETUP;
    }

    if (view === DashboardView.DASHBOARD) {
      return "properties";
    }

    if (!role) {
      return DashboardView.ROLE_SELECTION;
    }

    if (role === UserRole.PROPERTY_MANAGER || role === UserRole.VENDOR) {
      const kycStatus = user?.kyc_request?.status;

      if (!kycStatus || kycStatus === "pending") {
        return "kyc-form";
      }

      if (kycStatus === "rejected") {
        return "kyc-form";
      }

      if (kycStatus === "approved") {
        if (isProfileCompleted === 0) {
          // if (!isProfileCompleted()) {
          return "profile-setup";
        }

        return "properties";
      }
    }

    return "role-selection";
  };

  const renderKycStatus = () => {
    const status = user?.kyc_request?.status;

    switch (status) {
      case "pending":
        return (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            {/* <Clock className="h-4 w-4 text-yellow-600" /> */}
            <WarningIcon className="text-yellow-800" />

            <AlertDescription className="text-yellow-700 flex flex-col">
              <h5 className="text-yellow-800 font-semibold">
                Your KYC is under review. You'll be notified once approved.
              </h5>
              <h3 className="text-yellow-700">
                Submitted on{" "}
                {user?.kyc_request?.created_at
                  ? format(user.kyc_request.created_at, "MM/dd/yyyy")
                  : ""}
              </h3>
            </AlertDescription>
          </Alert>
        );
      case "rejected":
        return (
          <Alert
            variant={"error"}
            className="mb-4 flex justify-between items-center gap-3"
          >
            <div className="flex flex-col space-y-2">
              <AlertTitle variant={"error"}>KYC Rejected</AlertTitle>
              <AlertDescription className="flex flex-col">
                Your KYC verification is rejected due to:{" "}
                {user?.kyc_request?.review_notes}
                <h3 className="">
                  Submitted on{" "}
                  {user?.kyc_request?.created_at
                    ? format(user.kyc_request.created_at, "MM/dd/yyyy")
                    : ""}
                </h3>
              </AlertDescription>
            </div>
            <AlertAction>
              <Button
                className="bg-red-700 hover:bg-red-800 text-xs px-2 py-1"
                onClick={() => handleRoleSelection()}
              >
                Resubmit KYC
              </Button>
            </AlertAction>
          </Alert>
        );
      case "approved":
        return (
          <Alert className="mb-6 border-primary-200 bg-primary-50">
            <AlertTitle className="text-primary-800">
              Your KYC is approved!
            </AlertTitle>
            <AlertDescription className="text-primary-700">
              You now have full access to all features.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  const QuickLinksCard = () => (
    <Card className="shadow-sm h-fit border border-gray-200 max-w-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickLinks.map((link, index) => {
          const IconComponent = link.icon;

          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors group border border-gray-200 svg-primary-700"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg  p-2">
                  <IconComponent className="h-4 w-4 text-primary-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {link.title}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  const PropertiesCards = () => {
    useEffect(() => {
      // if (view === DashboardView.DASHBOARD && !isProfileCompleted()) {
      if (view === DashboardView.DASHBOARD && !isProfileCompleted) {
        setSkippedProfile(true);
      }
    }, [view]);

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full">
          {renderKycStatus()}
          {skippedProfile && showProfileAlert && (
            <div className="mb-6 p-6 border border-gray-200 bg-white rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">
                    Next Best Step
                  </h4>
                  <p className="text-gray-600">
                    Complete your profile to unlock AI features faster.
                  </p>
                </div>
                <Button
                  onClick={handleCompleteProfileClick}
                  className="bg-white font-medium text-gray-600 border border-gray-200 hover:bg-gray-100"
                >
                  Complete Your Profile
                </Button>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    You're 60% setup! Only 2 steps left to go
                  </span>
                  <span className="text-sm font-medium text-gray-700">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          )}

          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-500 mr-2 h-10 w-10 rounded-lg">
                  <Image
                    src={guruLogo}
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </span>
                <span className="font-medium text-gray-700">
                  Average Rent in Your Area:
                </span>
              </div>
              <span className="font-bold text-gray-900">$2,150/month</span>
            </div>
          </div>

          <RentalListing />
        </div>
      </div>
    );
  };

  const RoleSelection = () => {
    const { user } = useAuth();

    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Please select your role to continue
          </CardTitle>
          <CardDescription className="text-gray-600">
            Choose how you'd like to get started – we'll guide you from there.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {roles.map((roleItem) => {
              const IconComponent = roleItem.icon;
              const isSelected = selectedRole === roleItem.id;

              return (
                <div
                  key={roleItem.id}
                  onClick={() => setSelectedRole(roleItem.id)}
                  className={`cursor-pointer rounded-lg border-2 p-6 transition-all hover:border-primary-300 ${
                    isSelected
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div
                        // className={`rounded-lg p-2 `}
                        className={`rounded-lg p-2 ${isSelected ? "bg-primary-100" : "bg-gray-100"}`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${isSelected ? "text-primary-600" : "text-gray-600"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${isSelected ? "text-primary-700" : "text-gray-700"}`}
                        >
                          {roleItem.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {roleItem.description}
                        </p>
                      </div>
                    </div>
                    {roleItem.badge && user?.kyc_request === null && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      >
                        {roleItem.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-4">
            <Button
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 text-base font-medium"
              disabled={!selectedRole}
              onClick={() => handleRoleSelection()}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const mainComponent = getMainComponent();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full">
        <div className="mb-8 text-center lg:text-left">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl lg:text-5xl bg-gradient-to-r from-primary-500 to-[#4ECDC4] bg-clip-text text-transparent">
            Welcome to Rental Guru!
          </h1>

          {mainComponent === DashboardView.ROLE_SELECTION && (
            <p className="text-gray-600 text-lg">
              Let's get started by choosing your role.
            </p>
          )}
        </div>

        {mainComponent === "properties" && <PropertiesCards />}

        {mainComponent !== "properties" && (
          <React.Fragment>
            {mainComponent === "kyc-form" && <KycComponent />}
            {mainComponent === DashboardView.PROFILE_SETUP && <ProfileSetup />}
          </React.Fragment>
        )}

        {mainComponent !== "properties" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_300px] min-h-full">
            <div className="grid-cols-8">
              {mainComponent === DashboardView.ROLE_SELECTION && (
                <RoleSelection />
              )}
            </div>
            {mainComponent !== DashboardView.PROFILE_SETUP &&
              mainComponent !== "kyc-form" && (
                <div className="grid-cols-4">
                  <QuickLinksCard />
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
