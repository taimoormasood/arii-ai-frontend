"use client";
import { Mail, Phone } from "lucide-react";
import React, { FC } from "react";

import { ChatIcon } from "@/assets/icons";
import { girlAvatarImg } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetInvitedTenantDetails } from "@/hooks/api/use-tenants";

import PaymentsComponent from "../../vendors/vendor-detail/tab-components/payments-component";
import LeaseInfo from "./tab-components/lease-info";
import MaintenanceComponent from "./tab-components/maintenance-component";
import TabsSection from "./tabs-section";

interface TenantDetailComponentProps {
  tenantId: number;
}

const TenantDetailComponent: FC<TenantDetailComponentProps> = ({
  tenantId,
}) => {
  const {
    data: tenantData,
    isLoading,
    error,
  } = useGetInvitedTenantDetails(tenantId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tenant details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Failed to load tenant details</p>
        </div>
      </div>
    );
  }

  const basicInfo = tenantData?.data?.basic_info;
  const leaseInfo = tenantData?.data?.lease_info;

  return (
    <React.Fragment>
      <div className="flex-1 space-y-6">
        <Card>
          <CardContent className="pt-6">
            {/* Tenant Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={girlAvatarImg.src}
                    alt={basicInfo?.full_name || "Tenant"}
                  />
                  <AvatarFallback>
                    {basicInfo?.full_name
                      ? basicInfo.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div>
                    <h1 className="text-lg font-semibold">
                      {basicInfo?.full_name || "N/A"}
                    </h1>
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="text-gray-500 text-sm">
                          Assigned Property
                        </span>
                        <p className="text-gray-700 font-medium text-sm">
                          {basicInfo?.assignment_name || "N/A"}
                        </p>
                      </div>
                      <div className="w-px bg-gray-200"></div>
                      <div>
                        <span className="text-gray-500 text-sm">
                          Payment Due Date
                        </span>
                        <p className="text-gray-700 font-medium text-sm">
                          {basicInfo?.payment_due_date || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-right">
                <div className="flex items-center justify-end space-x-2 text-sm text-gray-700">
                  <Phone className="h-4 w-4" />
                  <span>{basicInfo?.phone_number || "N/A"}</span>
                </div>
                <div className="flex items-center justify-end space-x-2 text-sm text-gray-700">
                  <Mail className="h-4 w-4" />
                  <span>{basicInfo?.email || "N/A"}</span>
                </div>

                <Button className="bg-primary-600 hover:bg-primary-700">
                  <ChatIcon className="h-4 w-4 mr-2" />
                  Chat with Tenant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <TabsSection
          tabs={[
            {
              label: "Lease Information",
              value: "lease-info",
              content: <LeaseInfo leaseInfo={leaseInfo} id={tenantId} />,
            },
            {
              label: "Maintenance",
              value: "maintenance",
              content: <MaintenanceComponent />,
            },

            {
              label: "Payments",
              value: "payments",
              content: (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PaymentsComponent />
                  </CardContent>
                </Card>
              ),
            },
          ]}
          defaultValue="lease-info"
        />
      </div>
    </React.Fragment>
  );
};

export default TenantDetailComponent;
