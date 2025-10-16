"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import CustomRadioGroup from "@/components/ui/custom-radio-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetCostFeeTypes } from "@/hooks/api/use-properties";

const categoryOptions = [
  { value: "add_on", label: "Add-On" },
  { value: "deposits", label: "Deposits" },
  { value: "services", label: "Services" },
  { value: "storage", label: "Storage" },
  { value: "technology", label: "Technology" },
];

const refundableFeeOptions = [
  { value: "non_refundable", label: "Non-refundable" },
  { value: "partially_refundable", label: "Partially refundable" },
  { value: "refundable", label: "Refundable" },
];

const requiredFeeOptions = [
  { value: "in_rent", label: "Included in Base Rent" },
  { value: "required", label: "Required" },
  { value: "optional", label: "Optional" },
];

const feeTypeOptions = [
  { value: "flat_fee", label: "Flat Fee" },
  { value: "flat_fee_per_item", label: "Flat Fee Per Item" },
  { value: "fee_range", label: "Fee Range" },
];

const paymentFrequencyOptions = [
  { value: "one_time", label: "One Time" },
  { value: "monthly", label: "Monthly" },
  { value: "per_use", label: "Per Use" },
];

const createFeeSchema = (dialogType: string) =>
  z.object({
    category:
      dialogType === "other"
        ? z.string().min(1, "Category is required")
        : z.string().optional(),
    feeName: z.string().min(1, "Fee name is required"),
    paymentFrequency: z.string().min(1, "Payment frequency is required"),
    feeAmount: z.coerce
      .number()
      .min(0.01, "Fee amount must be greater than 0")
      .refine(
        (val) => {
          const decimalStr = val.toString().split(".")[1] || "";

          return decimalStr.length <= 2;
        },
        { message: "Fee amount cannot have more than 2 decimal places" }
      ),
    feeType: z.string().min(1, "Fee type is required"),
    requiredFee: z.enum(["in_rent", "required", "optional"], {
      required_error: "Required fee selection is required",
    }),
    refundableFee: z
      .enum(["non_refundable", "partially_refundable", "refundable"])
      .optional(),
  });

export type FeeFormType = z.infer<ReturnType<typeof createFeeSchema>> & {
  id?: number; // Add id field for existing fees
};

interface AddFeeDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  dialogType: "parking" | "utilities" | "other";
  currentFeeRecord: FeeFormType | null;
  onAddFee: (data: FeeFormType) => void;
  propertyId: number | undefined;
  existingFees?: FeeFormType[];
}

export default function UniversityCostFeeDialog({
  open,
  onOpenChange,
  dialogType,
  currentFeeRecord,
  onAddFee,
  propertyId,
  existingFees = [],
}: AddFeeDialogProps) {
  const { data: costFeeTypesData, isLoading: isLoadingCostFeeTypes } =
    useGetCostFeeTypes(propertyId!);

  const methods = useForm<FeeFormType>({
    resolver: zodResolver(createFeeSchema(dialogType)),
    defaultValues: {
      category: currentFeeRecord?.category || "",
      feeName: currentFeeRecord?.feeName || "",
      paymentFrequency: currentFeeRecord?.paymentFrequency || "",
      feeAmount: currentFeeRecord?.feeAmount || 0,
      feeType: currentFeeRecord?.feeType || "",
      requiredFee: currentFeeRecord?.requiredFee || "in_rent",
      refundableFee: currentFeeRecord?.refundableFee || "non_refundable",
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const selectedCategory = watch("category");
  const selectedFeeName = watch("feeName");

  // Reset form when dialog opens/closes or when currentFeeRecord changes
  useEffect(() => {
    if (currentFeeRecord) {
      methods.reset({
        category: currentFeeRecord.category || "",
        feeName: currentFeeRecord.feeName || "",
        paymentFrequency: currentFeeRecord.paymentFrequency || "",
        feeAmount: currentFeeRecord.feeAmount || 0,
        feeType: currentFeeRecord.feeType || "",
        requiredFee: currentFeeRecord.requiredFee || "in_rent",
        refundableFee: currentFeeRecord.refundableFee || "non_refundable",
      });
    } else {
      methods.reset({
        category: "",
        feeName: "",
        paymentFrequency: "",
        feeAmount: 0,
        feeType: "",
        requiredFee: "in_rent",
        refundableFee: "non_refundable",
      });
    }
  }, [currentFeeRecord, methods, open]);

  // Clear fee name when category changes (for other categories dialog)
  useEffect(() => {
    if (dialogType === "other" && selectedCategory && selectedFeeName) {
      // In edit mode, use static options; in add mode, use API options
      const isEditMode = currentFeeRecord !== null;
      let categoryFeeOptions;

      if (isEditMode) {
        // Use static options in edit mode
        categoryFeeOptions = getStaticFeeNameOptions();
      } else {
        // Use API options in add mode
        categoryFeeOptions = getCategoryFeeOptions(selectedCategory);
      }

      const isValidFeeName = categoryFeeOptions.some(
        (option) => option.value === selectedFeeName
      );

      if (!isValidFeeName) {
        setValue("feeName", "");
      }
    }
  }, [
    selectedCategory,
    dialogType,
    setValue,
    selectedFeeName,
    currentFeeRecord,
  ]);

  const onSubmit = (data: FeeFormType) => {
    onAddFee(data);
    methods.reset();
    onOpenChange(false);
  };

  // Helper function to get fee options for a specific category
  const getCategoryFeeOptions = (category: string) => {
    if (!costFeeTypesData?.data) {
      return [];
    }

    const categoryData =
      costFeeTypesData.data[category as keyof typeof costFeeTypesData.data];
    if (!categoryData) {
      return [];
    }

    // Convert string array to option objects
    const options = Array.isArray(categoryData)
      ? categoryData.map((feeName: string) => ({
          value: feeName,
          label: feeName
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }))
      : [];

    // Return all options but mark existing ones as disabled
    return options.map((option: { value: string; label: string }) => {
      const isExistingFee = existingFees.some(
        (existingFee) =>
          existingFee.feeName === option.value &&
          existingFee !== currentFeeRecord
      );

      return {
        ...option,
        disabled: isExistingFee,
      };
    });
  };

  // Static fee name options for edit mode (ensures existing values are always available)
  const getStaticFeeNameOptions = () => {
    switch (dialogType) {
      case "parking": {
        return [
          {
            value: "reserved_parking",
            label: "Reserved Parking",
            disabled: false,
          },
          {
            value: "student_lot",
            label: "Student Lot",
            disabled: false,
          },
          {
            value: "bicycle_parking",
            label: "Bicycle Parking",
            disabled: false,
          },
          {
            value: "garage_parking",
            label: "Garage Parking",
            disabled: false,
          },
        ];
      }
      case "utilities": {
        return [
          { value: "electricity", label: "Electricity", disabled: false },
          { value: "water", label: "Water", disabled: false },
          { value: "gas", label: "Gas", disabled: false },
          { value: "trash", label: "Trash", disabled: false },
          { value: "internet", label: "Internet", disabled: false },
        ];
      }
      case "other": {
        if (selectedCategory) {
          const staticOptions = {
            add_on: [
              {
                value: "smart_lock_fee",
                label: "Smart lock fee",
                disabled: false,
              },
              {
                value: "meal_plan_add_on",
                label: "Meal Plan Add-on",
                disabled: false,
              },
              {
                value: "community_fee",
                label: "Community fee",
                disabled: false,
              },
              {
                value: "recreation_center_fee",
                label: "Recreation Center Fee",
                disabled: false,
              },
              {
                value: "gym_fee",
                label: "Gym fee",
                disabled: false,
              },
            ],
            deposits: [
              {
                value: "holding_deposit",
                label: "Holding deposit",
                disabled: false,
              },
              {
                value: "last_month_base_rent",
                label: "Last month's base rent",
                disabled: false,
              },
              {
                value: "security_deposit_alternative",
                label: "Security deposit alternative",
                disabled: false,
              },
              {
                value: "equipment_deposit",
                label: "Equipment Deposit",
                disabled: false,
              },
            ],
            services: [
              {
                value: "cleaning_fee",
                label: "Cleaning fee",
                disabled: false,
              },
              {
                value: "laundry_service_fee",
                label: "Laundry Service Fee",
                disabled: false,
              },
              {
                value: "mailroom_service_fee",
                label: "Mailroom Service Fee",
                disabled: false,
              },
              {
                value: "health_center_access",
                label: "Health Center Access",
                disabled: false,
              },
            ],
            storage: [
              {
                value: "bike_storage_fee",
                label: "Bike storage fee",
                disabled: false,
              },
              {
                value: "luggage_locker_fee",
                label: "Luggage Locker Fee",
                disabled: false,
              },
              {
                value: "semester_storage",
                label: "Semester Storage",
                disabled: false,
              },
            ],
            technology: [
              {
                value: "campus_cable_fee",
                label: "Campus Cable Fee",
                disabled: false,
              },
              {
                value: "internet_fee",
                label: "Internet Fee",
                disabled: false,
              },
              {
                value: "tech_maintenance_fee",
                label: "Tech Maintenance Fee",
                disabled: false,
              },
              {
                value: "student_portal_access_fee",
                label: "Student Portal Access Fee",
                disabled: false,
              },
            ],
          };

          return (
            staticOptions[selectedCategory as keyof typeof staticOptions] || []
          );
        }

        return [];
      }
      default:
        return [];
    }
  };

  // Get fee name options based on dialog type and selected category
  const getFeeNameOptions = () => {
    if (isLoadingCostFeeTypes) {
      return [];
    }

    // In edit mode, use static options to ensure stored values are available
    const isEditMode = currentFeeRecord !== null;

    if (isEditMode) {
      // Use static options in edit mode to ensure existing values are available
      return getStaticFeeNameOptions();
    }

    // If no data from API, provide fallback options
    if (!costFeeTypesData?.data) {
      // Fallback options based on dialog type
      switch (dialogType) {
        case "parking": {
          return [
            {
              value: "reserved_parking",
              label: "Reserved Parking",
              disabled: false,
            },
            {
              value: "student_lot",
              label: "Student Lot",
              disabled: false,
            },
            {
              value: "bicycle_parking",
              label: "Bicycle Parking",
              disabled: false,
            },
            {
              value: "garage_parking",
              label: "Garage Parking",
              disabled: false,
            },
          ];
        }
        case "utilities": {
          return [
            { value: "electricity", label: "Electricity", disabled: false },
            { value: "water", label: "Water", disabled: false },
            { value: "gas", label: "Gas", disabled: false },
            { value: "trash", label: "Trash", disabled: false },
            { value: "internet", label: "Internet", disabled: false },
          ];
        }
        case "other": {
          if (selectedCategory) {
            // Fallback options for other categories
            const fallbackOptions = {
              add_on: [
                {
                  value: "smart_lock_fee",
                  label: "Smart lock fee",
                  disabled: false,
                },
                {
                  value: "meal_plan_addon",
                  label: "Meal Plan Add-on",
                  disabled: false,
                },
                {
                  value: "community_fee",
                  label: "Community fee",
                  disabled: false,
                },
                {
                  value: "recreation_center_fee",
                  label: "Recreation Center Fee",
                  disabled: false,
                },
                {
                  value: "gym_fee",
                  label: "Gym fee",
                  disabled: false,
                },
              ],

              deposits: [
                {
                  value: "holding_deposit",
                  label: "Holding deposit",
                  disabled: false,
                },
                {
                  value: "last_months_base_rent",
                  label: "Last month's base rent",
                  disabled: false,
                },
                {
                  value: "security_deposit_alternative",
                  label: "Security deposit alternative",
                  disabled: false,
                },
                {
                  value: "equipment_deposit",
                  label: "Equipment Deposit",
                  disabled: false,
                },
              ],

              services: [
                {
                  value: "cleaning_fee",
                  label: "Cleaning fee",
                  disabled: false,
                },
                {
                  value: "laundry_service_fee",
                  label: "Laundry Service Fee",
                  disabled: false,
                },
                {
                  value: "mailroom_service_fee",
                  label: "Mailroom Service Fee",
                  disabled: false,
                },
                {
                  value: "health_center_access",
                  label: "Health Center Access",
                  disabled: false,
                },
              ],

              storage: [
                {
                  value: "bike_storage_fee",
                  label: "Bike storage fee",
                  disabled: false,
                },
                {
                  value: "luggage_locker_fee",
                  label: "Luggage Locker Fee",
                  disabled: false,
                },
                {
                  value: "semester_storage",
                  label: "Semester Storage",
                  disabled: false,
                },
              ],

              technology: [
                {
                  value: "campus_cable_fee",
                  label: "Campus Cable Fee",
                  disabled: false,
                },
                {
                  value: "internet_fee",
                  label: "Internet Fee",
                  disabled: false,
                },
                {
                  value: "tech_maintenance_fee",
                  label: "Tech Maintenance Fee",
                  disabled: false,
                },
                {
                  value: "student_portal_access_fee",
                  label: "Student Portal Access Fee",
                  disabled: false,
                },
              ],
            };

            return (
              fallbackOptions[
                selectedCategory as keyof typeof fallbackOptions
              ] || []
            );
          }

          return [];
        }
        default:
          return [];
      }
    }

    // Use API data if available
    switch (dialogType) {
      case "parking": {
        // For parking, use the dedicated parking category from API
        const parkingOptions = costFeeTypesData.data.parking || [];

        // Convert string array to option objects
        const options = parkingOptions.map((feeName: string) => ({
          value: feeName,
          label: feeName
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }));

        return options.map((option: { value: string; label: string }) => {
          const isExistingFee = existingFees.some(
            (existingFee) =>
              existingFee.feeName === option.value &&
              existingFee !== currentFeeRecord
          );

          return {
            ...option,
            disabled: isExistingFee,
          };
        });
      }
      case "utilities": {
        // Use the dedicated utilities category from API
        const utilityOptions = costFeeTypesData.data.utilities || [];

        // Convert string array to option objects
        const options = utilityOptions.map((feeName: string) => ({
          value: feeName,
          label: feeName
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }));

        return options.map((option: { value: string; label: string }) => {
          const isExistingFee = existingFees.some(
            (existingFee) =>
              existingFee.feeName === option.value &&
              existingFee !== currentFeeRecord
          );

          return {
            ...option,
            disabled: isExistingFee,
          };
        });
      }
      case "other": {
        if (selectedCategory) {
          return getCategoryFeeOptions(selectedCategory);
        }

        return [];
      }
      default: {
        return [];
      }
    }
  };

  const getDialogTitle = () => {
    const isEditing = currentFeeRecord !== null;

    switch (dialogType) {
      case "parking":
        return isEditing ? "Edit Parking Fee" : "Add Parking Fee";
      case "utilities":
        return isEditing ? "Edit Utility Fee" : "Add Utility Fee";
      case "other":
        return isEditing ? "Edit Other Category Fee" : "Add Other Category Fee";
      default:
        return isEditing ? "Edit Fee" : "Add Fee";
    }
  };

  const getFeeNamePlaceholder = () => {
    if (isLoadingCostFeeTypes) {
      return "Loading options...";
    }

    const feeNameOptions = getFeeNameOptions();
    const allOptionsDisabled =
      feeNameOptions.length > 0 &&
      feeNameOptions.every((option) => option.disabled);

    if (allOptionsDisabled) {
      return "All options already created";
    }

    switch (dialogType) {
      case "parking":
        return "Select parking fee";
      case "utilities":
        return "Select utility fee";
      case "other":
        return selectedCategory ? "Select fee name" : "Select category first";
      default:
        return "Select fee name";
    }
  };

  const feeNameOptions = getFeeNameOptions();

  const allOptionsDisabled =
    feeNameOptions.length > 0 &&
    feeNameOptions.every((option) => option.disabled);
  const isFeeNameDisabled =
    (dialogType === "other" && !selectedCategory) ||
    isLoadingCostFeeTypes ||
    allOptionsDisabled;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[1056px] mx-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category field - only show for "other" dialog type */}
            {dialogType === "other" && (
              <div className="grid grid-cols-1 gap-6">
                <CustomInput
                  name="category"
                  label="Category"
                  placeholder="Select category"
                  options={categoryOptions}
                  required
                  select
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fee Name */}
              <div>
                <CustomInput
                  name="feeName"
                  label="Fee name"
                  placeholder={getFeeNamePlaceholder()}
                  options={feeNameOptions}
                  required
                  select
                  disabled={isFeeNameDisabled}
                />
              </div>

              {/* Fee Type */}
              <div>
                <CustomInput
                  name="feeType"
                  label="Fee type"
                  placeholder="Select fee type"
                  options={feeTypeOptions}
                  required
                  select
                />
              </div>

              {/* Fee Amount */}
              <div>
                <CustomInput
                  name="feeAmount"
                  label="Fee Amount"
                  placeholder="Enter fee amount"
                  type="number"
                  prefix="$"
                  required
                />
              </div>

              {/* Payment Frequency */}
              <div>
                <CustomInput
                  name="paymentFrequency"
                  label="Payment frequency"
                  placeholder="Select frequency"
                  options={paymentFrequencyOptions}
                  required
                  select
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Required Fee */}
              <CustomRadioGroup
                name="requiredFee"
                label="Is this fee required?"
                required
                options={requiredFeeOptions}
              />

              {/* Refundable Fee */}
              <CustomRadioGroup
                name="refundableFee"
                label="Is this fee refundable?"
                options={refundableFeeOptions}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                className="border border-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white"
                disabled={isLoadingCostFeeTypes}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
