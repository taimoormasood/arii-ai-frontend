"use client";
import React from "react";

import { EUserRole } from "@/layouts/dashboard-layout/sidebar-data";
import { useAuth } from "@/lib/contexts/auth-context";

import PropertyOwnerDashboard from "./property-owner-dashboard";
import TenantDashboardComponent from "./tenant-dashboard";
import { UniversalDashboard } from "./universal-dashboard/universal-dashboard";
import VendorDashboard from "./vendor-dashboard";

const DashboardComponent: React.FC = () => {
  const { currentUserRole } = useAuth();

  const role = currentUserRole || EUserRole.GENERAL;

  switch (role) {
    case EUserRole.GENERAL:
      return <UniversalDashboard />;
    case EUserRole.PROPERTY_OWNER:
      return <PropertyOwnerDashboard />;
    case EUserRole.VENDOR:
      return <VendorDashboard />;
    case EUserRole.TENANT:
      return <TenantDashboardComponent />;
    default:
      return <UniversalDashboard />;
  }
};

export default DashboardComponent;
