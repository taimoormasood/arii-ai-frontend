"use client";

import { Activity, MapPin, MoreVertical, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PropertyBuildingIcon } from "@/assets/icons";
import ArrowUpRightGreen from "@/assets/icons/arrow-up-right-green";
import UnitCardStatusIcon from "@/assets/icons/unit-card-status-icon";
import PropertyStatusIcon from "@/assets/icons/universal-dashboard/property-status-icon";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDefaultTrigger,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatText } from "@/helpers";

interface PropertyData {
  id: number;
  property_owner: number;
  rent: number | null;
  photos: Array<{
    id: number;
    photo: string;
  }>;
  number_of_units: number | null;
  name: string;
  property_type: string;
  state: string;
  city: string;
  zip_code: string | null;
  street_address: string;
  status: string;
  other_amenities: string[] | null;
  page_saved: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PropertyCardProps {
  propertyData: PropertyData;
  isRentalListing?: boolean;
}

export default function PopularPropertyCard({
  propertyData,
  isRentalListing,
}: PropertyCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "occupied":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "vacant":
        return "bg-primary-200 text-primary-800 border-green-200";
      case "maintenance":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPropertyTypeDisplay = (type: string) => {
    return formatText(type.replace("_", " "));
  };

  const getFullAddress = () => {
    const parts = [
      propertyData.street_address,
      propertyData.city,
      propertyData.state,
      propertyData.zip_code,
    ].filter(Boolean);

    return parts.join(", ");
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 relative transition hover:shadow-md">
        {/* Image Section */}
        <div className="relative w-full h-48 overflow-hidden mb-4">
          <Image
            fill
            priority
            src={
              propertyData.photos[0]?.photo ||
              "https://placehold.co/400x300?text=No+Image"
            }
            alt={propertyData.name || "Property Image"}
            className="rounded-xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="w-full flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 leading-tight">
              {propertyData.name}
            </h3>
            {/* Dropdown Menu */}
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuDefaultTrigger
                    aria-label="Open property menu"
                    className="bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white/90 cursor-pointer"
                  >
                    <MoreVertical
                      size={16}
                      className="text-gray-600 cursor-pointer"
                    />
                  </DropdownMenuDefaultTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white border-none"
                >
                  <DropdownMenuItem
                    className="hover:bg-gray-100"
                    onClick={() =>
                      router.push(`/my-properties/edit/${propertyData.id}`)
                    }
                  >
                    Edit Property
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100">
                    {propertyData.published ? "Unpublish" : "Publish"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100">
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-gray-100"
                    onClick={() =>
                      router.push(
                        `/universal-dashboard/rental-listing?propertyId=${propertyData.id}&action=apply`
                      )
                    }
                  >
                    Apply for rent
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                    Delete Property
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Property Name */}

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin
              size={16}
              className=" mt-0.5 flex-shrink-0 text-primary-600"
            />
            <span className="text-gray-600 text-sm leading-relaxed">
              {getFullAddress()}
            </span>
          </div>

          {/* Property Type */}
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-500 text-sm gap-2">
              <User size={16} className="text-gray-400" />
              Owner
            </span>
            <span className="text-gray-700 text-sm font-medium">
              {getPropertyTypeDisplay(propertyData?.name)}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-500 text-sm gap-2">
              <PropertyStatusIcon className="text-gray-400 h-4 w-4" />
              Status
            </span>
            <Badge
              className={`capitalize text-xs px-3 py-1 rounded-full ${getStatusColor(propertyData.status || "vacant")}`}
            >
              {propertyData.status || "Vacant"}
            </Badge>
          </div>

          {/* Units (if multi-family) */}
          {propertyData.number_of_units && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm flex items-center gap-x-2">
                <PropertyBuildingIcon className="text-gray-400 h-4 w-4" />
                <span className="">Units</span>
              </span>
              <span className="text-gray-700 text-sm font-medium">
                {propertyData.number_of_units}
              </span>
            </div>
          )}

          {/* Rent and Explore Link */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="text-2xl font-bold text-gray-900">
              {propertyData.rent !== null &&
                propertyData.rent !== undefined && (
                  <>
                    ${propertyData.rent}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      /month
                    </span>
                  </>
                )}
            </span>
            <Link
              href={`/my-properties/property-detail/${propertyData.id}`}
              className="text-primary-600 font-semibold flex items-center gap-1 hover:underline text-sm"
            >
              Explore
              <ArrowUpRightGreen className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
