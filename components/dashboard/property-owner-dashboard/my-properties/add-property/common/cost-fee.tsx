"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import PlusGreenIcon from "@/assets/icons/plus-green-icon";
import { Button } from "@/components/ui/button";
import {
  useAddCostFee,
  useGetPropertyDetail,
} from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";

import AddParkingDetailsDialog, {
  FeeFormType,
} from "../property-types/common/add-cost-fee-dialog";
import FeeCard from "../property-types/common/fee-card";
import UniversityCostFeeDialog from "../property-types/common/university-cost-fee-dialog";

const categories = ["Parking", "Utilities", "Other Categories"];

interface CostFeeProps {
  pageSaved: number;
  nextCurrentStep: number;
  stepToMarkComplete: number;
  isUnit?: boolean;
  isUniversityHousing?: boolean;
}

const CostFee = ({
  pageSaved = 5,
  nextCurrentStep = 6,
  stepToMarkComplete = 5,
  isUnit = false,
  isUniversityHousing = false,
}: CostFeeProps) => {
  const [open, setOpen] = React.useState(false);
  const [currentDialogType, setCurrentDialogType] = React.useState<
    "parking" | "utilities" | "other"
  >("parking");
  const [feeRecords, setFeeRecords] = React.useState<FeeFormType[]>([]);
  const [currentFeeRecord, setCurrentFeeRecord] =
    React.useState<FeeFormType | null>(null);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);

  const {
    getStepData,
    updateStepData,
    setCurrentStep,
    setCurrentUnitStep,
    currentUnitStep,
    markStepCompleted,
    markUnitStepCompleted,
    clearAllFormData,
    currentStep,
    getUnitStepData,
    isEditMode,
    editingPropertyId,
  } = usePropertyStore();
  const { mutate: addCostFee, isPending: isSubmitting } = useAddCostFee();

  const searchParams = useSearchParams();

  const searchedUnitId = searchParams.get("unitId");

  // Get property ID - prioritize editingPropertyId, then store data
  const storePropertyId = getStepData("propertyInfo")?.id;
  const currentPropertyId = editingPropertyId || storePropertyId;
  const unitId = isUnit
    ? getUnitStepData("unitInfo")?.id
    : searchedUnitId
      ? searchedUnitId
      : undefined;
  const router = useRouter();

  // Fetch property details when we have a property ID
  const { data: propertyDetailResponse, isPending: isLoadingPropertyDetail } =
    useGetPropertyDetail(currentPropertyId || 0);

  // Extract cost fee details from property detail response
  const propertyData = propertyDetailResponse?.data;
  const allUnits = (propertyData as any)?.units || [];
  const currentUnitData = unitId
    ? allUnits.find((unit: any) => unit.detail.id === unitId)
    : null;

  const apiCostFeeDetails = isUnit
    ? currentUnitData?.cost_fees
    : propertyData?.cost_fees;

  // Load existing cost fee data from API when available
  useEffect(() => {
    if (apiCostFeeDetails && feeRecords.length === 0) {
      // Transform API cost fee data to FeeFormType[] format
      const transformedFees: FeeFormType[] = apiCostFeeDetails.flatMap(
        (categoryGroup: any) =>
          categoryGroup.fees.map((fee: any) => ({
            id: fee.id, // Include the id field for existing fees from API
            category: categoryGroup.category_name,
            feeName: fee.fee_name,
            paymentFrequency: fee.payment_frequency,
            feeAmount: Number(fee.fee_amount),
            feeType: fee.fee_type,
            requiredFee: fee.is_required as "in_rent" | "required" | "optional",
            refundableFee: fee.refundable_status as
              | "non_refundable"
              | "partially_refundable"
              | "refundable",
          }))
      );

      setFeeRecords(transformedFees);
    }
  }, [apiCostFeeDetails, feeRecords.length]);

  // Also load from store data when navigating between steps (fallback)
  useEffect(() => {
    if (!apiCostFeeDetails && isEditMode && feeRecords.length === 0) {
      const costFeeData = getStepData("costFee");

      if (costFeeData?.fees && costFeeData.fees.length > 0) {
        // Transform store data back to FeeFormType[] format
        const transformedFees: FeeFormType[] = costFeeData.fees.map(
          (fee: any, index: number) => {
            // Get the category for this fee
            // If fee.category exists, use it; otherwise, try to get from the category array
            let feeCategory = fee.category;
            if (
              !feeCategory &&
              costFeeData.category &&
              costFeeData.category.length > index
            ) {
              feeCategory = costFeeData.category[index];
            }
            // If we still don't have a category, try to infer it from the fee name
            if (!feeCategory) {
              // Try to map fee name to category
              if (
                fee.fee_name &&
                [
                  "reserved_parking",
                  "street_parking",
                  "garage",
                  "covered_parking",
                  "uncovered_parking",
                  "parking_space",
                  "assigned_parking",
                ].includes(fee.fee_name)
              ) {
                feeCategory = "parking";
              } else if (
                fee.fee_name &&
                [
                  "electricity",
                  "water",
                  "gas",
                  "trash",
                  "internet",
                  "sewer",
                  "cable",
                  "heating",
                  "cooling",
                  "electric_utilities",
                  "water_utilities",
                  "gas_utilities",
                  "waste_management",
                  "recycling",
                  "phone",
                  "satellite",
                  "fiber_optic",
                ].includes(fee.fee_name)
              ) {
                feeCategory = "utilities";
              } else {
                feeCategory = "other";
              }
            }

            const transformedFee = {
              id: (fee as any).id, // Include the id field for existing fees
              category: feeCategory,
              feeName: (fee as any).fee_name,
              paymentFrequency: (fee as any).payment_frequency,
              feeAmount: Number((fee as any).fee_amount),
              feeType: (fee as any).fee_type,
              requiredFee: (fee as any).is_required as
                | "in_rent"
                | "required"
                | "optional",
              refundableFee: (fee as any).refundable_status as
                | "non_refundable"
                | "partially_refundable"
                | "refundable",
            };

            return transformedFee;
          }
        );

        setFeeRecords(transformedFees);
      }
    }
  }, [isEditMode, feeRecords.length]);

  const handleAddClick = (category: string) => {
    let dialogType: "parking" | "utilities" | "other";

    switch (category.toLowerCase()) {
      case "parking":
        dialogType = "parking";
        break;
      case "utilities":
        dialogType = "utilities";
        break;
      case "other categories":
        dialogType = "other";
        break;
      default:
        dialogType = "other";
    }

    setCurrentDialogType(dialogType);
    setCurrentFeeRecord(null);
    setEditIndex(null);
    setOpen(true);
  };

  const handleAddFee = (data: FeeFormType) => {
    // Determine the category based on dialog type
    let categoryValue: string;

    if (currentDialogType === "parking") {
      categoryValue = "parking";
    } else if (currentDialogType === "utilities") {
      categoryValue = "utilities";
    } else {
      // For "other" type, use the selected category from the form
      categoryValue = data.category || "other";
    }

    const feeWithCategory = {
      ...data,
      category: categoryValue,
    };

    if (editIndex !== null) {
      // Update existing record - preserve the original ID
      setFeeRecords((prev) =>
        prev.map((record, index) => {
          if (index === editIndex) {
            // Preserve the original ID when updating
            const updatedRecord = {
              ...feeWithCategory,
              id: (record as any).id, // Keep the original ID
            };

            return updatedRecord;
          }

          return record;
        })
      );
    } else {
      // Add new record
      setFeeRecords((prev) => [...prev, feeWithCategory]);
    }

    // Reset states
    setCurrentFeeRecord(null);
    setEditIndex(null);
    setOpen(false);
  };

  const handleDeleteFee = (index: number) => {
    setFeeRecords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditFee = (index: number, item: FeeFormType) => {
    setCurrentFeeRecord(item);
    setEditIndex(index);

    // Determine dialog type based on category
    let dialogType: "parking" | "utilities" | "other";

    if (item.category === "parking") {
      dialogType = "parking";
    } else if (item.category === "utilities") {
      dialogType = "utilities";
    } else {
      dialogType = "other";
    }

    setCurrentDialogType(dialogType);
    setOpen(true);
  };

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);
    if (!openState) {
      setCurrentFeeRecord(null);
      setEditIndex(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFees(false);
  };

  const handleSaveAndExit = () => {
    submitFees(true);
  };

  const submitFees = (saveAndExit: boolean) => {
    if (!currentPropertyId) {
      return;
    }

    // Group feeRecords by category
    const groupedFees = feeRecords.reduce<Record<string, FeeFormType[]>>(
      (acc, item) => {
        if (!item.category) return acc;
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);

        return acc;
      },
      {}
    );

    const cost_fees = Object.entries(groupedFees).map(([category, items]) => ({
      category_name: category,
      fees: items.map((item, index) => {
        const feePayload: any = {
          fee_name: item.feeName,
          payment_frequency: item.paymentFrequency,
          fee_amount: item.feeAmount,
          fee_type: item.feeType,
          is_required: item.requiredFee,
          refundable_status: item.refundableFee || "non_refundable",
        };

        // If we have an id in the item (for existing fees), include it
        if ((item as any).id) {
          feePayload.id = (item as any).id;
        }

        return feePayload;
      }),
    }));

    const payload = {
      property: currentPropertyId as number,
      unit: unitId as number | undefined,
      cost_fees,
      page_saved: pageSaved,
    };

    const mutationOptions = {
      onSuccess: (response: any) => {
        // Store the API response data in the store
        const responseData = response?.data || response;

        // Update store with the latest data from API response
        updateStepData("costFee", {
          property: currentPropertyId as number,
          category: cost_fees.map((cat) => cat.category_name),
          page_saved: pageSaved,
          fees: responseData.cost_fees
            ? responseData.cost_fees.flatMap((categoryGroup: any) =>
                categoryGroup.fees.map((fee: any) => ({
                  id: fee.id, // Important: Include the ID from response
                  fee_name: fee.fee_name,
                  payment_frequency: fee.payment_frequency,
                  fee_amount: Number(fee.fee_amount),
                  fee_type: fee.fee_type,
                  is_required: fee.is_required,
                  refundable_status: fee.refundable_status,
                  category: categoryGroup.category_name,
                }))
              )
            : // Fallback to the submitted data if response doesn't contain cost_fees
              cost_fees.flatMap((cat) => cat.fees),
        });

        if (saveAndExit) {
          clearAllFormData();
          router.push("/my-properties");
        } else {
          if (isUnit) {
            markUnitStepCompleted(stepToMarkComplete);
            setCurrentUnitStep(nextCurrentStep);
          } else {
            markStepCompleted(stepToMarkComplete);
            setCurrentStep(nextCurrentStep);
          }
        }
      },
    };

    // Always use create endpoint - backend handles both creation and updates via ID tracking
    addCostFee(payload, mutationOptions);
  };

  const getCategoryKey = (category: string) => {
    switch (category.toLowerCase()) {
      case "parking":
        return "parking";
      case "utilities":
        return "utilities";
      default:
        return "other";
    }
  };

  if (isLoadingPropertyDetail) return <div>Loading...</div>;

  return (
    <div className="w-full mx-auto">
      <div className="bg-white lg:p-6 p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 leading-7">
          Cost & Fees
        </h2>
        <p className="mt-4 lg:text-lg text-sm text-gray-900">
          What additional costs and fees do you charge?
        </p>

        {/* Loading state */}
        {isLoadingPropertyDetail && currentPropertyId && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">
              Loading cost fee details...
            </div>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {categories.map((category) => {
            const categoryKey = getCategoryKey(category);

            const items = feeRecords.filter((r) => {
              if (categoryKey === "other") {
                return (
                  r.category && !["parking", "utilities"].includes(r.category)
                );
              }

              return r.category === categoryKey;
            });

            return (
              <div key={category}>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm font-medium text-gray-900">
                    {category}
                  </span>
                  <Button
                    type="button"
                    onClick={() => handleAddClick(category)}
                    className="bg-white hover:bg-gray-100 flex items-center space-x-1 text-primary-600 font-medium"
                  >
                    <span className="text-sm font-semibold">ADD</span>
                    <PlusGreenIcon />
                  </Button>
                </div>

                {items.length > 0 && (
                  <ul className="mt-2 space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, idx) => {
                      const actualIndex = feeRecords.findIndex(
                        (record) => record === item
                      );

                      return (
                        <li
                          key={actualIndex}
                          className="bg-gray-50 lg:p-4 p-2 rounded-lg shadow-sm border border-gray-200"
                        >
                          <FeeCard
                            index={actualIndex}
                            item={item}
                            onEdit={() => handleEditFee(actualIndex, item)}
                            onDelete={() => handleDeleteFee(actualIndex)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        {/* Buttons Row */}
        <div className="flex flex-wrap justify-between mt-6 w-full gap-1">
          <Button
            type="button"
            className="lg:px-6 px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-md font-semibold"
            onClick={() => {
              if (isUnit) {
                setCurrentUnitStep(currentUnitStep - 1);
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
          >
            Back
          </Button>

          <div className="flex space-x-3">
            <Button
              type="button"
              className="lg:px-6 px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-md font-semibold"
              onClick={handleSaveAndExit}
              disabled={isSubmitting}
            >
              Save & Exit
            </Button>

            <Button
              type="button"
              className="lg:px-6 px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Next"}
            </Button>
          </div>
        </div>
      </div>

      {open && !isUniversityHousing && (
        <AddParkingDetailsDialog
          currentFeeRecord={currentFeeRecord}
          open={open}
          onOpenChange={handleOpenChange}
          dialogType={currentDialogType}
          onAddFee={handleAddFee}
          propertyId={currentPropertyId}
          existingFees={feeRecords}
        />
      )}

      {open && isUniversityHousing && (
        <UniversityCostFeeDialog
          currentFeeRecord={currentFeeRecord}
          open={open}
          onOpenChange={handleOpenChange}
          dialogType={currentDialogType}
          onAddFee={handleAddFee}
          propertyId={currentPropertyId}
          existingFees={feeRecords}
        />
      )}
    </div>
  );
};

export default CostFee;
