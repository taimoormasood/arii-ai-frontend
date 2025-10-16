"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import {
  useGetTenantDetails,
  useSetupTenantProfile,
  useUpdateTenantProfile,
} from "@/hooks/api/use-tenants";
import { useTenantSetupStore } from "@/lib/stores/use-tenant-setup-store";

import {
  FinancialEmploymentFormType,
  financialEmploymentSchema,
} from "./schema";

export function FinancialEmploymentStep() {
  const {
    financialEmployment,
    updateFinancialEmployment,
    setCurrentStep,
    markStepCompleted,
  } = useTenantSetupStore();
  const { mutate: setupTenantProfile, isPending: isCreating } =
    useSetupTenantProfile();
  const { mutate: updateTenantProfile, isPending: isUpdating } =
    useUpdateTenantProfile();
  const { data: tenantData } = useGetTenantDetails();

  const isPending = isCreating || isUpdating;
  const hasExistingData = tenantData?.data && tenantData.success;

  const methods = useForm<FinancialEmploymentFormType>({
    resolver: zodResolver(financialEmploymentSchema),
    defaultValues: {
      jobTitle: financialEmployment.jobTitle,
      employmentStatus: financialEmployment.employmentStatus,
      industry: financialEmployment.industry,
      incomeRange: financialEmployment.incomeRange,
      mortgageAmount: financialEmployment.mortgageAmount,
      creditScoreRange: financialEmployment.creditScoreRange,
      debtToIncomeRatio: financialEmployment.debtToIncomeRatio,
      investmentPreferences: financialEmployment.investmentPreferences,
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: FinancialEmploymentFormType) => {
    // Update the store with form data
    updateFinancialEmployment(data);

    // Prepare payload for API
    const payload = {
      job_title: data.jobTitle,
      employment_status: data.employmentStatus,
      industry: data.industry,
      income_range: data.incomeRange,
      mortgage_amount: data.mortgageAmount,
      credit_score_range: data.creditScoreRange,
      debt_to_income_ratio: data.debtToIncomeRatio,
      investment_preferences: data.investmentPreferences?.join(","),
      page_saved: 1, // Financial step is step 2
    };

    const onSuccess = () => {
      markStepCompleted(2);
      setCurrentStep(3);
      toast.success("Financial & employment data saved successfully!");
    };

    // Use update API if data exists, otherwise use create API
    if (hasExistingData) {
      updateTenantProfile(payload, { onSuccess });
    } else {
      setupTenantProfile(payload, { onSuccess });
    }
  };

  const handleInvestmentPreferenceToggle = (preference: string) => {
    const current = financialEmployment.investmentPreferences;
    const updated = current.includes(preference)
      ? current.filter((p) => p !== preference)
      : [...current, preference];
    updateFinancialEmployment({ investmentPreferences: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">{"Let's Talk Finances"}</h2>
        <p className="text-gray-600">
          A few details about your job and income will help us provide
          personalized recommendations.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title */}
          <div className="space-y-2">
            <CustomInput
              name="jobTitle"
              label="Job Title"
              placeholder="Enter job title"
            />
          </div>

          {/* Employment Status and Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <CustomInput
                name="employmentStatus"
                label="Employment Status"
                placeholder="Select"
                select
                options={[
                  { value: "full-time", label: "Full-Time" },
                  { value: "part-time", label: "Part-Time" },
                  { value: "self-employed", label: "Self-Employed" },
                  { value: "unemployed", label: "Unemployed" },
                  { value: "student", label: "Student" },
                  { value: "retired", label: "Retired" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <CustomInput
                name="industry"
                label="Industry"
                placeholder="Select"
                select
                options={[
                  { value: "technology", label: "Technology" },
                  { value: "finance", label: "Finance" },
                  { value: "healthcare", label: "Healthcare" },
                  { value: "education", label: "Education" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>
          </div>

          {/* Income Range */}
          <div className="space-y-2">
            <CustomInput
              name="incomeRange"
              label="Income Range"
              placeholder="Select"
              select
              options={[
                { value: "<$50,000", label: "<$50,000" },
                { value: "$50,000-$70,000", label: "$50,000-$70,000" },
                { value: "$70,000-$90,000", label: "$70,000-$90,000" },
                { value: ">$90,000", label: ">$90,000" },
              ]}
            />
          </div>

          {/* Mortgage Amount */}
          <div className="space-y-2">
            <CustomInput
              name="mortgageAmount"
              label="Mortgage Amount"
              placeholder="Enter amount"
              type="number"
              prefix="$"
            />
          </div>

          {/* Credit Score Range */}
          <div className="space-y-2">
            <CustomInput
              name="creditScoreRange"
              label="Credit Score Range (Optional)"
              placeholder="Select"
              select
              options={[
                { value: "700-750", label: "700-750" },
                { value: "500-600", label: "500-600" },
                { value: "600-700", label: "600-700" },
                { value: "750+", label: "750+" },
              ]}
            />
          </div>

          {/* Debt-to-Income Ratio */}
          <div className="space-y-2">
            <CustomInput
              name="debtToIncomeRatio"
              label="Debt-to-Income Ratio"
              placeholder="Enter ratio"
            />
          </div>

          {/* Investment Preferences */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Investment Preferences{" "}
              <span className="text-gray-500">(Optional)</span>
            </Label>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {[
                { value: "stocks", label: "Stocks" },
                { value: "real_estate", label: "Real Estate" },
                { value: "cryptocurrencies", label: "Cryptocurrencies" },
                { value: "bonds", label: "Bonds" },
              ].map((preference) => (
                <div
                  key={preference.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={preference.value}
                    checked={financialEmployment.investmentPreferences.includes(
                      preference.value
                    )}
                    onCheckedChange={() =>
                      handleInvestmentPreferenceToggle(preference.value)
                    }
                  />
                  <Label htmlFor={preference.value} className="text-sm">
                    {preference.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

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
                markStepCompleted(2);
                setCurrentStep(3);
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
