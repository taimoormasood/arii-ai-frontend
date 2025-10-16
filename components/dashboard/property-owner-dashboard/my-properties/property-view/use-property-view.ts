import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { errorHandler } from "@/helpers";
import { useGetPropertyDetail } from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import {
  publishProperty,
  publishUnit,
} from "@/services/properties/properties.service";

import { UnitPropertyType } from "../config/unit-steps";

const usePropertyView = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { setEditMode, setSelectedPropertyType, updateUnitStepData } =
    usePropertyStore();

  const params = useParams();
  const searchParams = useSearchParams();

  const router = useRouter();

  const propertyId = useMemo(() => Number(params?.id), [params]);

  const propertyType = useMemo(
    () => searchParams.get("propertyType"),
    [searchParams]
  );

  const { data, isPending, error, refetch } = useGetPropertyDetail(propertyId);

  const listingInfo = data?.data?.listing_info;

  const currentPropertyStatus = data?.data?.detail?.published;

  const activeUnits =
    data?.data?.units?.filter((unit: any) => unit?.detail?.published) ?? [];

  const hasActiveUnits = activeUnits.length > 0;

  const hasUnits = (data?.data?.units || []).length > 0 || hasActiveUnits;

  const propertyListingData = {
    listing_info: data?.data?.listing_info,
    detail: data?.data?.detail,
    rental_details: data?.data?.rental_details,
  };

  const ownersData = data?.data?.owners || [];

  const additionalCostFeeData = data?.data?.cost_fees || [];

  const amenities = data?.data?.amenities || [];
  const careServices = data?.data?.listing_info?.care_services || [];

  const flatAmenities: { id?: number; name: string; category: string }[] = [];

  const flatPets = data?.data?.listing_info?.pets_allowed
    ? [
        ...(data?.data?.listing_info.pet_types || []),
        ...(data?.data?.listing_info?.other_pets || []),
      ]
    : [];

  for (const [category, items] of Object.entries(amenities)) {
    if (category === "other_amenities") {
      // Flatten and push each string individually
      if (Array.isArray(items)) {
        const flattened = Array.isArray(items[0]) ? items.flat() : items;
        flattened.forEach((value) => {
          let name: string;
          if (typeof value === "string") {
            name = value;
          } else if (
            typeof value === "object" &&
            value !== null &&
            "name" in value
          ) {
            name = (value as { name: string }).name;
          } else {
            return;
          }
          flatAmenities.push({ category, name });
        });
      }
    } else {
      (items as Array<{ id: number; name: string }>).forEach(({ id, name }) => {
        flatAmenities.push({ id, name, category });
      });
    }
  }

  const handlePropertyStatus = async (
    id: number | null,
    status: "active" | "inactive"
  ) => {
    if (!id) return;
    setUpdatingStatus(true);
    // Set published true if activating, false if deactivating
    const published = status === "active";
    try {
      const res = await publishProperty(id, { published });

      if (res?.success) {
        if (published) {
          toast.success("Property is now Active and visible to tenants.");
        } else {
          toast.success("Property status updated to Inactive.");
        }
      }
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      refetch();
      setUpdatingStatus(false);
    }
  };

  const handleUnitStatus = async (
    id: number | null,
    status: "active" | "inactive"
  ) => {
    if (!id) return;
    setUpdatingStatus(true);
    // Set published true if activating, false if deactivating
    const published = status === "active";
    try {
      const res = await publishUnit(id, { published });

      if (res?.success) {
        if (published) {
          toast.success("Unit is now Active and visible to tenants.");
        } else {
          toast.success("Unit status updated to Inactive.");
        }
      }
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      refetch();
      setUpdatingStatus(false);
    }
  };

  const handleUnitEdit = (unitId: any) => {
    setSelectedPropertyType(propertyType as UnitPropertyType);
    // Set edit mode with the property ID from params
    setEditMode(true, parseInt(propertyId as any));

    // Update unit step data with unit ID
    updateUnitStepData("unitInfo", {
      id: unitId,
    });

    // Navigate to unit edit page
    router.push(`/my-properties/add-unit/${propertyType}?unitId=${unitId}`);
  };

  return {
    data,
    isPending,
    error,
    activeTab,
    setActiveTab,
    propertyId,
    propertyType,
    listingInfo,
    flatAmenities,
    flatPets,
    careServices,
    propertyListingData,
    ownersData,
    additionalCostFeeData,
    handlePropertyStatus,
    updatingStatus,
    currentPropertyStatus,
    activeUnits,
    handleUnitStatus,
    handleUnitEdit,
    hasUnits,
    hasActiveUnits,
  };
};

export default usePropertyView;
