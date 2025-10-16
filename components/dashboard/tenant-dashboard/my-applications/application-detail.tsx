"use client";

import { Check, Clock, FileText, Home } from "lucide-react";

import {
  ApplicationApprovalIcon,
  LeaseActiveIcon,
  PaymentPendingIcon,
} from "@/assets/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetApplicationDetail } from "@/hooks/api/use-tenants";

interface ApplicationData {
  id: string;
  propertyName: string;
  address: string;
  applicationDate: string;
  checkInDate: string;
  checkOutDate: string;
  status:
    | "Submitted"
    | "Approved"
    | "Payment Pending"
    | "Lease Active"
    | "Rejected";
  currentStep: number;
}

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  applicationId?: string;
}

export default function ApplicationDetail({
  open,
  onOpenChange,
  applicationId,
}: Props) {
  // API call to get application details
  const {
    data: apiData,
    isLoading,
    error,
  } = useGetApplicationDetail(applicationId || "");

  // Dummy data as fallback
  const dummyData: ApplicationData = {
    id: applicationId || "ID787689544",
    propertyName: "Unit1 - Sunrise Apartment",
    address: "4140 Parker Rd, Allentown, New Mexico 31134",
    applicationDate: "12/04/2025",
    checkInDate: "17/07/2025",
    checkOutDate: "17/09/2025",
    status: "Submitted",
    currentStep: 1,
  };

  // Use API data if available, otherwise use dummy data
  const applicationData: ApplicationData = apiData?.data
    ? {
        id: apiData.data.id,
        propertyName: apiData.data.property_name,
        address: apiData.data.property_address,
        applicationDate: apiData.data.application_date,
        checkInDate: apiData.data.check_in_date,
        checkOutDate: apiData.data.check_out_date,
        status: apiData.data.status,
        currentStep: apiData.data.current_step || 1,
      }
    : dummyData;

  const applicationSteps = [
    {
      id: 1,
      title: "Application Submitted",
      subtitle: "Submitted on 14/05/2025",
      status: "completed" as const,
      icon: FileText,
    },
    {
      id: 2,
      title: "Application Approval",
      subtitle: "Pending",
      status: "pending" as const,
      icon: ApplicationApprovalIcon,
    },
    {
      id: 3,
      title: "Payment",
      subtitle: "Pending",
      status: "pending" as const,
      icon: PaymentPendingIcon,
    },
    {
      id: 4,
      title: "Lease Activation",
      subtitle: "Pending",
      status: "pending" as const,
      icon: LeaseActiveIcon,
    },
  ];

  const getStepIcon = (step: (typeof applicationSteps)[0]) => {
    const IconComponent = step.icon;

    if (step.status === "completed") {
      return (
        <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-primary-600" />
        </div>
      );
    }

    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <IconComponent className="w-5 h-5 text-gray-500" />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[80vw] mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 py-4">
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading application details...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">
              Failed to load application details. Using offline data.
            </div>
          </div>
        ) : null}

        <div className="space-y-6">
          {/* Property Details Section */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Property Details
                </CardTitle>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {applicationData.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Application ID
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {applicationData.id}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">
                      Property Name
                    </label>
                    <p className="text-sm font-medium text-blue-600">
                      {applicationData.propertyName}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">
                      Check in Date
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {applicationData.checkInDate}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Application Date
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {applicationData.applicationDate}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Address</label>
                    <p className="text-sm font-medium text-gray-900">
                      {applicationData.address}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">
                      Check out Date
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {applicationData.checkOutDate}
                    </p>
                  </div>
                </div>
              </div>
              {/* Application Tracker Section */}
              <CardTitle className="text-base font-semibold text-gray-900">
                Application Tracker
              </CardTitle>
              <div className="space-y-1">
                {applicationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    {/* Step Icon */}
                    <div className="flex flex-col items-center">
                      {getStepIcon(step)}
                      {/* Connector Line */}
                      {index < applicationSteps.length - 1 && (
                        <div className="w-px h-12 bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
