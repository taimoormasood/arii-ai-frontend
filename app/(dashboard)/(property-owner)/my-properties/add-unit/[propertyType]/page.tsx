"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import AddUnitComponent from "@/components/dashboard/property-owner-dashboard/my-properties/add-unit";
import { UnitStepper } from "@/components/dashboard/property-owner-dashboard/my-properties/add-unit/unit-stepper";
import {
  type UnitPropertyType,
  unitStepsConfig,
} from "@/components/dashboard/property-owner-dashboard/my-properties/config/unit-steps";
import { usePropertyStore } from "@/lib/stores/use-property-store";

export default function AddUnitPage() {
  const { propertyType } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // const propertyType = params?.propertyType; // ← 'senior_living'

  const propertyId = searchParams.get("propertyType");

  // const propertyType = useMemo(
  //   () => searchParams.get("propertyType") as UnitPropertyType,
  //   [searchParams]
  // );

  const { setSelectedPropertyType, selectedPropertyType } = usePropertyStore();

  // useEffect(() => {
  //   if (!propertyType || !unitStepsConfig[propertyType]) {
  //     router.push("/my-properties");

  //     return;
  //   }

  //   if (selectedPropertyType !== propertyType) {
  //     setSelectedPropertyType(propertyType);
  //   }
  // }, [propertyType, selectedPropertyType, setSelectedPropertyType, router]);

  if (!propertyType || !unitStepsConfig[propertyType as UnitPropertyType]) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnitStepper propertyType={propertyType as UnitPropertyType} />
      <div className="bg-white rounded-lg">
        <AddUnitComponent propertyType={propertyType as UnitPropertyType} />
      </div>
    </div>
  );
}
