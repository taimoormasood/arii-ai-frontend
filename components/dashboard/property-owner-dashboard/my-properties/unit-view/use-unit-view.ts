import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { errorHandler } from "@/helpers";
import { useGetPropertyDetail } from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import { publishUnit } from "@/services/properties/properties.service";

import { UnitPropertyType } from "../config/unit-steps";

const useUnitView = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { id } = useParams();

  const searchParams = useSearchParams();
  const propertyId = Number(searchParams.get("propertyId"));

  const propertyType = useMemo(
    () => searchParams.get("propertyType"),
    [searchParams]
  );
  const unitId = id;

  const router = useRouter();

  const { data, isPending, error, refetch } = useGetPropertyDetail(propertyId);

  const { setEditMode, setSelectedPropertyType, updateUnitStepData } =
    usePropertyStore();

  const unitRentalDetails = data?.data?.units.find((unit: any) => {
    return Number(unit?.rental_details?.unit) === Number(id);
  });

  const listingInfo = data?.data?.listing_info;

  const propertyUnitListingData = data?.data?.units || [];

  const allUnits = (data?.data as any)?.units || [];
  const currentUnitData = unitId
    ? allUnits.find((unit: any) => unit.detail.id === parseInt(unitId as any))
    : null;

  const currentPropertyStatus = currentUnitData?.detail?.published;

  const amenities = currentUnitData?.amenities || [];

  const flatAmenities: { id?: number; name: string; category: string }[] = [];

  const flatPets = data?.data?.listing_info?.pets_allowed
    ? [
        ...(data?.data?.listing_info.pet_types || []),
        ...(data?.data?.listing_info?.other_pets || []),
      ]
    : [];

  const additionalCostFeeData = data?.data?.cost_fees || [];

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

  const handlePropertyUnitStatus = async (
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
          toast.success(
            `${propertyType === "university_housing" ? "Room" : "Unit"} is now Active and visible to tenants.`
          );
        } else {
          toast.success(
            `${propertyType === "university_housing" ? "Room" : "Unit"} status updated to Inactive.`
          );
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
    unitId,
    data,
    isPending,
    error,
    activeTab,
    setActiveTab,
    propertyId,
    propertyType,
    listingInfo,
    flatPets,
    flatAmenities,
    additionalCostFeeData,
    unitRentalDetails,
    propertyUnitListingData,
    updatingStatus,
    handlePropertyUnitStatus,
    currentPropertyStatus,
    handleUnitEdit,
  };
};

export default useUnitView;
