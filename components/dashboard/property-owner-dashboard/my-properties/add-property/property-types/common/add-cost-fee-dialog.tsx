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

export default function AddParkingDetailsDialog({
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

  // Helper function to apply disabled state to options based on existing fees
  const applyDisabledState = (options: { value: string; label: string }[]) => {
    return options.map((option) => {
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

    // Apply disabled state using helper function
    return applyDisabledState(options);
  };

  // Static fee name options for edit mode (ensures existing values are always available)
  const getStaticFeeNameOptions = () => {
    switch (dialogType) {
      case "parking": {
        const baseOptions = [
          {
            value: "reserved_parking",
            label: "Reserved Parking",
          },
          { value: "street_parking", label: "Street Parking" },
          { value: "garage", label: "Garage" },
          {
            value: "covered_parking",
            label: "Covered Parking",
          },
          {
            value: "uncovered_parking",
            label: "Uncovered Parking",
          },
          { value: "parking_space", label: "Parking Space" },
          {
            value: "assigned_parking",
            label: "Assigned Parking",
          },
        ];

        return applyDisabledState(baseOptions);
      }
      case "utilities": {
        const baseOptions = [
          { value: "electricity", label: "Electricity" },
          { value: "water", label: "Water" },
          { value: "gas", label: "Gas" },
          { value: "trash", label: "Trash" },
          { value: "internet", label: "Internet" },
          { value: "sewer", label: "Sewer" },
          { value: "cable", label: "Cable" },
          { value: "heating", label: "Heating" },
          { value: "cooling", label: "Cooling" },
          {
            value: "electric_utilities",
            label: "Electric Utilities",
          },
          {
            value: "water_utilities",
            label: "Water Utilities",
          },
          { value: "gas_utilities", label: "Gas Utilities" },
          {
            value: "waste_management",
            label: "Waste Management",
          },
          { value: "recycling", label: "Recycling" },
          { value: "phone", label: "Phone" },
          { value: "satellite", label: "Satellite" },
          { value: "fiber_optic", label: "Fiber Optic" },
        ];

        return applyDisabledState(baseOptions);
      }
      case "other": {
        if (selectedCategory) {
          const staticOptions = {
            add_on: [
              {
                value: "smart_home_fee",
                label: "Smart Home Fee",
              },
              {
                value: "smart_lock_fee",
                label: "Smart Lock Fee",
              },
              {
                value: "solar_home_fee",
                label: "Solar Home Fee",
              },
              {
                value: "community_fee",
                label: "Community Fee",
              },
              {
                value: "electric_vehicle_charging_fee",
                label: "Electric Vehicle Charging Fee",
              },
              { value: "fence_fee", label: "Fence Fee" },
              { value: "gym_fee", label: "Gym Fee" },
              { value: "pool_fee", label: "Pool Fee" },
              { value: "spa_fee", label: "Spa Fee" },
              {
                value: "concierge_fee",
                label: "Concierge Fee",
              },
              { value: "amenity_fee", label: "Amenity Fee" },
              { value: "club_fee", label: "Club Fee" },
              { value: "resort_fee", label: "Resort Fee" },
              { value: "valet_fee", label: "Valet Fee" },
              { value: "doorman_fee", label: "Doorman Fee" },
              { value: "security_fee", label: "Security Fee" },
              {
                value: "maintenance_fee",
                label: "Maintenance Fee",
              },
              {
                value: "landscaping_fee",
                label: "Landscaping Fee",
              },
              {
                value: "snow_removal_fee",
                label: "Snow Removal Fee",
              },
              { value: "elevator_fee", label: "Elevator Fee" },
            ],
            deposits: [
              {
                value: "holding_deposit",
                label: "Holding Deposit",
              },
              {
                value: "last_month_base_rent",
                label: "Last Month's Base Rent",
              },
              {
                value: "security_deposit_alternative",
                label: "Security Deposit Alternative",
              },
              {
                value: "tenant_deposit",
                label: "Tenant Deposit",
              },
              {
                value: "pet_deposit",
                label: "Pet Deposit",
              },
              {
                value: "key_deposit",
                label: "Key Deposit",
              },
              {
                value: "damage_deposit",
                label: "Damage Deposit",
              },
              {
                value: "move_in_deposit",
                label: "Move In Deposit",
              },
              {
                value: "utility_deposit",
                label: "Utility Deposit",
              },
              {
                value: "cleaning_deposit",
                label: "Cleaning Deposit",
              },
            ],
            services: [
              { value: "cleaning_fee", label: "Cleaning Fee" },
              {
                value: "lawn_maintenance_fee",
                label: "Lawn Maintenance Fee",
              },
              {
                value: "pest_control_fee",
                label: "Pest Control Fee",
              },
              {
                value: "pool_maintenance_fee",
                label: "Pool Maintenance Fee",
              },
              {
                value: "housekeeping_fee",
                label: "Housekeeping Fee",
              },
              {
                value: "laundry_service_fee",
                label: "Laundry Service Fee",
              },
              {
                value: "dry_cleaning_fee",
                label: "Dry Cleaning Fee",
              },
              {
                value: "pet_grooming_fee",
                label: "Pet Grooming Fee",
              },
              {
                value: "pet_walking_fee",
                label: "Pet Walking Fee",
              },
              {
                value: "snow_removal_service_fee",
                label: "Snow Removal Service Fee",
              },
              {
                value: "hvac_maintenance_fee",
                label: "HVAC Maintenance Fee",
              },
              {
                value: "appliance_maintenance_fee",
                label: "Appliance Maintenance Fee",
              },
            ],
            storage: [
              {
                value: "bike_storage_fee",
                label: "Bike Storage Fee",
              },
              {
                value: "storage_locker_fee",
                label: "Storage Locker Fee",
              },
              {
                value: "storage_unit_fee",
                label: "Storage Unit Fee",
              },
              {
                value: "garage_storage_fee",
                label: "Garage Storage Fee",
              },
              {
                value: "attic_storage_fee",
                label: "Attic Storage Fee",
              },
              {
                value: "basement_storage_fee",
                label: "Basement Storage Fee",
              },
              {
                value: "closet_storage_fee",
                label: "Closet Storage Fee",
              },
              {
                value: "outdoor_storage_fee",
                label: "Outdoor Storage Fee",
              },
            ],
            technology: [
              { value: "cable_fee", label: "Cable Fee" },
              { value: "internet_fee", label: "Internet Fee" },
              {
                value: "technology_fee",
                label: "Technology Fee",
              },
              { value: "wifi_fee", label: "WiFi Fee" },
              {
                value: "streaming_service_fee",
                label: "Streaming Service Fee",
              },
              {
                value: "smart_home_technology_fee",
                label: "Smart Home Technology Fee",
              },
              {
                value: "security_system_fee",
                label: "Security System Fee",
              },
              {
                value: "home_automation_fee",
                label: "Home Automation Fee",
              },
              {
                value: "phone_service_fee",
                label: "Phone Service Fee",
              },
              {
                value: "satellite_tv_fee",
                label: "Satellite TV Fee",
              },
              {
                value: "fiber_internet_fee",
                label: "Fiber Internet Fee",
              },
              {
                value: "high_speed_internet_fee",
                label: "High Speed Internet Fee",
              },
            ],
          };

          const categoryOptions = staticOptions[selectedCategory as keyof typeof staticOptions] || [];
          
          return applyDisabledState(categoryOptions);
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
              value: "street_parking",
              label: "Street Parking",
              disabled: false,
            },
            { value: "garage", label: "Garage", disabled: false },
            {
              value: "covered_parking",
              label: "Covered Parking",
              disabled: false,
            },
            {
              value: "uncovered_parking",
              label: "Uncovered Parking",
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
            { value: "sewer", label: "Sewer", disabled: false },
            { value: "cable", label: "Cable", disabled: false },
          ];
        }
        case "other": {
          if (selectedCategory) {
            // Fallback options for other categories
            const fallbackOptions = {
              add_on: [
                {
                  value: "smart_home_fee",
                  label: "Smart home fee",
                  disabled: false,
                },
                {
                  value: "smart_lock_fee",
                  label: "Smart lock fee",
                  disabled: false,
                },
                {
                  value: "solar_home_fee",
                  label: "Solar home fee",
                  disabled: false,
                },
                {
                  value: "community_fee",
                  label: "Community fee",
                  disabled: false,
                },
                {
                  value: "electric_vehicle_charging_fee",
                  label: "Electric vehicle charging fee",
                  disabled: false,
                },
                { value: "fence_fee", label: "Fence fee", disabled: false },
                { value: "gym_fee", label: "Gym fee", disabled: false },
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
                  value: "tenant_deposit",
                  label: "Tenant deposit",
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
                  value: "lawn_maintenance_fee",
                  label: "Lawn maintenance fee",
                  disabled: false,
                },
                {
                  value: "pest_control_fee",
                  label: "Pest control fee",
                  disabled: false,
                },
                {
                  value: "pool_maintenance_fee",
                  label: "Pool maintenance fee",
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
                  value: "storage_locker_fee",
                  label: "Storage locker fee",
                  disabled: false,
                },
              ],
              technology: [
                { value: "cable_fee", label: "Cable fee", disabled: false },
                {
                  value: "internet_fee",
                  label: "Internet fee",
                  disabled: false,
                },
                {
                  value: "technology_fee",
                  label: "Technology fee",
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

        return applyDisabledState(options);
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

        return applyDisabledState(options);
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
