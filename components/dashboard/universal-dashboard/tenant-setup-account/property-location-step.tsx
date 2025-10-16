"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import CustomRadioGroup from "@/components/ui/custom-radio-group";
import { useUpdateTenantProfile } from "@/hooks/api/use-tenants";
import { useTenantSetupStore } from "@/lib/stores/use-tenant-setup-store";

import { PropertyLocationFormType, propertyLocationSchema } from "./schema";

export function PropertyLocationStep() {
  const {
    propertyLocation,
    updatePropertyLocation,
    setCurrentStep,
    markStepCompleted,
  } = useTenantSetupStore();
  const { mutate: updateTenantProfile, isPending } = useUpdateTenantProfile();

  const methods = useForm<PropertyLocationFormType>({
    resolver: zodResolver(propertyLocationSchema),
    defaultValues: {
      propertyType: propertyLocation.propertyType,
      lengthOfStay: propertyLocation.lengthOfStay,
      utilityCostEstimates: propertyLocation.utilityCostEstimates,
      leaseTerm: propertyLocation.leaseTerm,
      preferredRentalPriceRange: propertyLocation.preferredRentalPriceRange,
      currentHomeValue: propertyLocation.currentHomeValue,
      interestInMoving: propertyLocation.interestInMoving || "within_6_months",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: PropertyLocationFormType) => {
    // Update the store with form data
    updatePropertyLocation(data);

    // Prepare payload for API
    const payload = {
      property_type: data.propertyType,
      length_of_stay: data.lengthOfStay,
      utility_cost_estimates: data.utilityCostEstimates,
      lease_term: data.leaseTerm,
      preferred_rental_price_range: data.preferredRentalPriceRange,
      current_home_value: data.currentHomeValue,
      interest_in_moving: data.interestInMoving,
      page_saved: 2, // Property location step is page 3
    };

    const onSuccess = () => {
      markStepCompleted(3);
      setCurrentStep(4);
      toast.success("Property & location insights saved successfully!");
    };

    // Always use update API for this step
    updateTenantProfile(payload, { onSuccess });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Property & Location Insights
        </h2>
        <p className="text-gray-600">
          Help us understand your housing preferences and current situation.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Property Type */}
            <div className="col-span-12 md:col-span-6">
              <CustomInput
                name="propertyType"
                label="Property Type"
                placeholder="Select"
                select
                options={[
                  { label: "Renting", value: "renting" },
                  { label: "Owning", value: "owning" },
                  {
                    label: "Living with Family/Friends",
                    value: "living_with_family/friends",
                  },
                ]}
              />
            </div>
            {/* Length of Stay */}
            <div className="col-span-12 md:col-span-6">
              <CustomInput
                name="lengthOfStay"
                label="Length of Stay"
                placeholder="Select"
                select
                options={[
                  { label: "Less than 1 year", value: "less_than_1_year" },
                  { label: "1-3 years", value: "1-3 years" },
                  { label: "3-5 years", value: "3-5 years" },
                  { label: "5+ years", value: "5+ years" },
                ]}
              />
            </div>
            {/* Utility Cost Estimates */}
            <div className="col-span-12">
              <CustomInput
                name="utilityCostEstimates"
                label="Utility Cost Estimates"
                placeholder="Select"
                select
                options={[
                  { label: "<$100", value: "<$100" },
                  { label: "$100-$200", value: "$100-$200" },
                  { label: "$200-$500", value: "$200-$500" },
                  { label: ">$300", value: ">$300" },
                ]}
              />
            </div>

            {/* Lease Term */}
            <div className="col-span-12">
              <CustomInput
                name="leaseTerm"
                label="Lease Term"
                placeholder="Enter amount"
                type="number"
                prefix="$"
              />
            </div>

            {/* Optional Fields */}
            <div className="col-span-12">
              <CustomInput
                name="preferredRentalPriceRange"
                label="Preferred Rental Price Range (Optional)"
                placeholder="Select"
                select
                options={[
                  { label: "$1000-$1500", value: "$1000-$1500" },
                  { label: "$1500-$2000", value: "$1500-$2000" },
                  { label: "$2000-$2500", value: "$2000-$2500" },
                  { label: "$2500+", value: "$2500+" },
                ]}
              />
            </div>

            <div className="col-span-12">
              <CustomInput
                name="currentHomeValue"
                label="Current Home Value (Optional)"
                placeholder="Enter amount"
                type="number"
                prefix="$"
              />
            </div>

            <div className="col-span-12">
              <CustomRadioGroup
                name="interestInMoving"
                label="Interest in Moving (Optional)"
                options={[
                  {
                    label: "Yes, in the next 6 months",
                    value: "within_6_months",
                  },
                  {
                    label: "No, not planning to move",
                    value: "not_planning_to_move",
                  },
                ]}
                direction="row"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          {/* Continue Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Continue"}
            </Button>
          </div>

          {/* Skip Button */}
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                markStepCompleted(3);
                setCurrentStep(4);
              }}
              className="text-gray-500 hover:text-gray-700 w-full"
              disabled={isPending}
            >
              Skip
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
