import { format } from "date-fns";

import {
  AttachmentDocumentIcon,
  CalendarIcon,
  ClockBlackIcon,
  EmailIcon,
  LeaseStatusIcon,
  PhoneIcon,
  SecurityDepositIcon,
  TenantBlueFile,
  TenantIcon,
} from "@/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatText } from "@/helpers";
import {
  GetSinglePropertyResponse,
  SinglePropertyView,
} from "@/services/properties/types";

interface AssignTenantCardProps {
  data: SinglePropertyView["rental_details"] | undefined;
}

export default function AssignTenantCard({ data }: AssignTenantCardProps) {
  const tenantData = data;

  const tenantDetails = [
    {
      icon: <TenantIcon />,
      label: "Tenant Name",
      value: formatText(String(tenantData?.assigned_tenant || "")) || "N/A",
      isBold: true,
    },
    {
      icon: <EmailIcon />,
      label: "Email",
    },
    {
      icon: <PhoneIcon />,
      label: "Phone",
      value: "N/A",
    },
    {
      icon: <CalendarIcon />,
      label: "Lease Start Date",
      value: (
        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-2xl">
          <ClockBlackIcon />
          <span className="text-sm">
            {tenantData?.lease_start_date
              ? format(new Date(tenantData.lease_start_date), "PPP")
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      icon: <CalendarIcon />,
      label: "Lease End Date",
      value: (
        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-2xl">
          <ClockBlackIcon />
          <span className="text-sm">
            {tenantData?.lease_end_date
              ? format(new Date(tenantData.lease_end_date), "PPP")
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      icon: <LeaseStatusIcon />,
      label: "Lease Status",
      value: (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        >
          {tenantData?.promote_special_offer
            ? "Offer Active"
            : "Standard Lease"}
        </Badge>
      ),
    },
    {
      icon: <SecurityDepositIcon />,
      label: "Security Deposit",
      value: tenantData?.security_deposit
        ? `$ ${tenantData.security_deposit}`
        : "N/A",
      isBold: true,
    },
  ];

  return (
    <div className="w-full  mx-auto">
      <h2 className="md:py-6 py-2 md:text-xl text-lg font-semibold pb-2">
        Assigned Tenant
      </h2>

      <Card className="w-full border border-gray-100">
        <CardContent className="md:p-6 p-2 space-y-6">
          {tenantDetails.map((detail, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {detail.icon}
                <span className="text-sm font-medium text-muted-foreground">
                  {detail.label}
                </span>
              </div>
              <span
                className={`text-sm capitalize ${detail.isBold ? "font-semibold" : ""}`}
              >
                {detail?.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
