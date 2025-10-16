"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import AddPropertyComponent from "@/components/dashboard/property-owner-dashboard/my-properties/add-property";
import { PropertyStepper } from "@/components/dashboard/property-owner-dashboard/my-properties/add-property/property-stepper";
import {
  propertyStepsConfig,
  type PropertyType,
} from "@/components/dashboard/property-owner-dashboard/my-properties/config/property-steps";
import { useGetPropertyDetail } from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";

export default function AddPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyType = params.propertyType as PropertyType;
  const {
    setSelectedPropertyType,
    selectedPropertyType,
    setEditMode,
    setCurrentStep,
    updateStepData,
    markStepCompleted,
  } = usePropertyStore();

  // Check if we're in edit mode
  const isEditMode = searchParams.get("edit") === "true";
  const propertyId = searchParams.get("id");

  // Track if we've already set the initial step for this property
  const hasSetInitialStep = useRef<string | null>(null);

  // Fetch property details for navigation calculation (only in edit mode)
  const { data: propertyDetailData } = useGetPropertyDetail(
    isEditMode && propertyId ? parseInt(propertyId) : 0
  );

  useEffect(() => {
    if (!propertyType || !propertyStepsConfig[propertyType]) {
      router.push("/my-properties");

      return;
    }

    if (selectedPropertyType !== propertyType) {
      setSelectedPropertyType(propertyType);
    }

    // Set edit mode and property ID
    if (isEditMode && propertyId) {
      setEditMode(true, parseInt(propertyId));

      // Populate propertyInfo with basic data so other components work
      updateStepData("propertyInfo", {
        id: parseInt(propertyId),
      });
    }

    // Handle step navigation for edit mode (only set initial step once)
    if (
      isEditMode &&
      propertyDetailData?.success &&
      propertyDetailData.data &&
      propertyId &&
      hasSetInitialStep.current !== propertyId
    ) {
      const published = propertyDetailData.data.detail.published;
      const pageSaved = (propertyDetailData.data.detail as any).page_saved;

      if (published) {
        // Active property - mark all steps as completed and go to step 2 (first editable step)
        const totalSteps = propertyStepsConfig[propertyType].length;
        for (let step = 1; step <= totalSteps; step++) {
          markStepCompleted(step);
        }
        setCurrentStep(2);
      } else {
        // Inactive property - mark completed steps based on page_saved and go to where they left off
        for (let step = 1; step < (pageSaved || 1); step++) {
          markStepCompleted(step);
        }
        setCurrentStep(pageSaved || 1);
      }

      // Mark that we've set the initial step for this property
      hasSetInitialStep.current = propertyId;
    }
  }, [
    propertyType,
    selectedPropertyType,
    setSelectedPropertyType,
    isEditMode,
    propertyId,
    setEditMode,
    setCurrentStep,
    updateStepData,
    propertyDetailData,
    router,
  ]);

  if (!propertyType || !propertyStepsConfig[propertyType]) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PropertyStepper propertyType={propertyType} />
      <div className="bg-white rounded-lg">
        <AddPropertyComponent propertyType={propertyType} />
      </div>
    </div>
  );
}
