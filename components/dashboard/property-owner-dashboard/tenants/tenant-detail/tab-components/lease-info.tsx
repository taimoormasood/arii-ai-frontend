import { format } from "date-fns";
import { Calendar, DollarSign, FileText, User } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatText } from "@/helpers";

import { ConfirmationModal } from "../../confirmation-modal";
import RenewLeaseModal from "../../renew-lease-modal";
import useTenantDetail from "../use-tenant-detail";

interface LeaseInfoProps {
  leaseInfo?: {
    lease_amount: number;
    security_deposit: number;
    lease_start_date: string;
    lease_end_date: string;
    lease_agreement_url: string;
    lease_ended: boolean;
  };
  id: number;
}

function getStatusStyles(status: string): {
  bgColor: string;
  textColor: string;
} {
  switch (status?.toLowerCase()) {
    case "active":
      return {
        bgColor: "bg-primary-200",
        textColor: "text-primary-700",
      };
    case "expired":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-700",
      };

    default:
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
      };
  }
}

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return dateString;
  }
}

export default function LeaseInfo({ leaseInfo, id }: LeaseInfoProps) {
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isRenewLeaseModalOpen, setIsRenewLeaseModalOpen] = useState(false);
  const [isEndLeaseModalOpen, setIsEndLeaseModalOpen] = useState(false);

  const { handleLeaseUpdateStatus, isUpdatingLease } = useTenantDetail();

  const status = leaseInfo
    ? leaseInfo.lease_ended
      ? "expired"
      : "active"
    : "active";
  const statusStyles = getStatusStyles(status);

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-semibold text-gray-800">
            Lease Information
          </h1>
          <Button
            className="bg-primary-600 hover:bg-primary-700 text-white px-6"
            onClick={() => {
              if (leaseInfo?.lease_ended) {
                setSelectedTenant({ id: id });
                setIsRenewLeaseModalOpen(true);
              } else {
                setSelectedTenant({ id: id });
                setIsEndLeaseModalOpen(true);
              }
            }}
            disabled={isUpdatingLease}
          >
            {leaseInfo?.lease_ended ? "Renew Lease" : "End Lease"}
          </Button>
        </div>

        {/* Lease Details */}
        <div className="space-y-1">
          {/* Rent Amount */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-gray-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-gray-700 font-medium text-sm">
                Rent Amount
              </span>
            </div>
            <span className="text-gray-800 text-sm font-semibold">
              ${leaseInfo?.lease_amount?.toLocaleString() || "N/A"}
            </span>
          </div>

          {/* Security Deposit */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-gray-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-gray-700 font-medium text-sm">
                Security Deposit
              </span>
            </div>
            <span className="text-gray-800 text-sm font-semibold">
              ${leaseInfo?.security_deposit?.toLocaleString() || "N/A"}
            </span>
          </div>

          {/* Lease Start Date */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-gray-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-gray-700 font-medium text-sm">
                Lease Start Date
              </span>
            </div>
            <span className="text-gray-800 text-sm">
              {leaseInfo?.lease_start_date
                ? formatDate(leaseInfo.lease_start_date)
                : "N/A"}
            </span>
          </div>

          {/* Lease End Date */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-gray-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-gray-700 font-medium text-sm">
                Lease End Date
              </span>
            </div>
            <span className="text-gray-800 text-sm">
              {leaseInfo?.lease_end_date
                ? formatDate(leaseInfo.lease_end_date)
                : "N/A"}
            </span>
          </div>

          {/* Lease Status */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-gray-600">
                <User className="w-5 h-5" />
              </div>
              <span className="text-gray-700 font-medium text-sm">
                Lease Status
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles.bgColor} ${statusStyles.textColor}`}
            >
              {formatText(status)}
            </span>
          </div>

          {/* Lease Agreement */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-gray-600">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-gray-700 font-medium text-sm">
                Lease Agreement
              </span>
            </div>
            {leaseInfo?.lease_agreement_url ? (
              <a
                href={leaseInfo.lease_agreement_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                View Document
              </a>
            ) : (
              <span className="text-gray-500 text-sm">
                No document available
              </span>
            )}
          </div>
        </div>
      </CardContent>
      {/* End Lease Modal */}
      {isEndLeaseModalOpen && (
        <ConfirmationModal
          title="Are you sure you want to end this lease? This will terminate the current lease and mark the unit as available for listing."
          isOpen={isEndLeaseModalOpen}
          onClose={() => setIsEndLeaseModalOpen(false)}
          actions={[
            {
              text: "Cancel",
              variant: "outline",
              onClick: () => setIsEndLeaseModalOpen(false),
            },
            {
              text: "Confirm End Lease",
              variant: "default",
              onClick: () => {
                handleLeaseUpdateStatus(id, "end", () => {
                  setIsEndLeaseModalOpen(false);
                });
              },
              isLoading: isUpdatingLease,
            },
          ]}
        />
      )}

      {/* Renew Lease Modal */}
      {isRenewLeaseModalOpen && (
        <RenewLeaseModal
          open={isRenewLeaseModalOpen}
          onOpenChange={setIsRenewLeaseModalOpen}
          tenant={selectedTenant}
        />
      )}
    </Card>
  );
}
