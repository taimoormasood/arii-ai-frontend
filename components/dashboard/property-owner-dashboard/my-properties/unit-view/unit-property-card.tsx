import { MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import ArrowUpRightGreen from "@/assets/icons/arrow-up-right-green";
import TenantAvatar from "@/assets/icons/tenant-avatar";
import UnitCardStatusIcon from "@/assets/icons/unit-card-status-icon";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDefaultTrigger,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatText } from "@/helpers";

interface Action {
  text: string;
  onClick: () => void;
}

export default function UnitPropertyCard({
  unitData,
  selectedTab,
  actions = [],
}: {
  unitData: any;
  selectedTab: string;
  actions?: Action[];
}) {
  const searchParams = useSearchParams();
  const propertyType = useMemo(
    () => searchParams.get("propertyType"),
    [searchParams]
  );
  const { id } = useParams();

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-3 flex flex-col relative transition hover:shadow-md">
      {/* Image Section */}
      <div className="relative w-full h-44 overflow-hidden">
        <Image
          fill
          priority
          src={
            unitData?.photos?.[0]?.photo ||
            "https://placehold.co/400x200?text=No+Image"
          }
          alt={unitData?.number || "Unit Image"}
          className="rounded-xl rounded-b-none object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col gap-1 px-1 pt-3 pb-2">
        {/* Unit Number + More Menu */}
        <div className="font-semibold relative text-xl text-gray-900 mb-1 flex items-center justify-between">
          {unitData?.number || "Unit"}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DropdownMenuDefaultTrigger aria-label="Open unit menu">
                <MoreVertical size={18} className="text-gray-500" />
              </DropdownMenuDefaultTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border-none"
            >
              {actions?.map((action) => (
                <DropdownMenuItem key={action.text} onClick={action.onClick}>
                  {action.text}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Unit Type */}
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center text-gray-400 text-xs gap-1">
            Unit Type
          </span>
          <span className="text-gray-700 text-xs font-medium ml-1">
            {formatText(unitData?.type) || "N/A"}
          </span>
        </div>

        {/* Tenant */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="flex items-center text-gray-400 text-xs gap-1">
            <TenantAvatar className="text-gray-400 w-4 h-4" /> Tenant
          </span>
          <span className="text-gray-700 text-xs font-medium ml-1">
            {formatText(unitData?.tenants) || "No Tenant Assigned"}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="flex items-center text-gray-400 text-xs gap-1">
            <UnitCardStatusIcon className="text-gray-400 w-4 h-4" /> Status
          </span>
          <Badge className="bg-yellow-100 capitalize text-yellow-800 hover:bg-yellow-100 border-yellow-200 text-xs px-3 py-1 rounded-full">
            {unitData?.status || "Unknown"}
          </Badge>
        </div>

        {/* Rent and View Link */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">
            ${unitData?.rent || "N/A"}
          </span>
          <Link
            href={`/my-properties/property-unit-detail/${unitData?.id}?propertyType=${propertyType}&propertyId=${id}`}
            className="text-primary-600 font-semibold flex items-center gap-1 hover:underline text-sm"
          >
            View details
            <ArrowUpRightGreen className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
