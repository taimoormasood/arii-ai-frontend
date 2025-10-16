"use client";

import { Check } from "lucide-react";
import { useEffect } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetTenantDetails } from "@/hooks/api/use-tenants";
import { useTenantSetupStore } from "@/lib/stores/use-tenant-setup-store";
import { cn } from "@/lib/utils";

import { FinancialEmploymentStep } from "./financial-employment-step";
import { PersonalInfoStep } from "./personal-info-step";
import { PropertyLocationStep } from "./property-location-step";
import { RiskBehaviorStep } from "./risk-behaviour-step";

export function TenantSetupAccount({
  onProfileSetupCompleted,
}: { onProfileSetupCompleted?: () => void } = {}) {
  const {
    currentStep,
    completedSteps,
    setCurrentStep,
    updateFinancialEmployment,
    updatePropertyLocation,
    updateRiskBehavior,
  } = useTenantSetupStore();

  const { data: tenantData } = useGetTenantDetails();

  // Auto-populate data if tenant profile exists
  useEffect(() => {
    if (tenantData?.data && tenantData.success) {
      const profile = tenantData.data;

      // Update financial employment data if it exists
      if (profile.job_title || profile.employment_status || profile.industry) {
        updateFinancialEmployment({
          jobTitle: profile.job_title || "",
          employmentStatus: profile.employment_status || "",
          industry: profile.industry || "",
          incomeRange: profile.income_range || "",
          mortgageAmount: profile.mortgage_amount || "",
          creditScoreRange: profile.credit_score_range || "",
          debtToIncomeRatio: profile.debt_to_income_ratio || "",
          investmentPreferences: profile.investment_preferences
            ? typeof profile.investment_preferences === "string"
              ? profile.investment_preferences.split(",")
              : Array.isArray(profile.investment_preferences)
                ? profile.investment_preferences
                : []
            : [],
        });
      }

      // Update property location data if it exists
      if (
        profile.property_type ||
        profile.length_of_stay ||
        profile.utility_cost_estimates
      ) {
        updatePropertyLocation({
          propertyType: profile.property_type || "",
          lengthOfStay: profile.length_of_stay || "",
          utilityCostEstimates: profile.utility_cost_estimates || "",
          leaseTerm: profile.lease_term || "",
          preferredRentalPriceRange: profile.preferred_rental_price_range || "",
          currentHomeValue: profile.current_home_value || "",
          interestInMoving: profile.interest_in_moving || "",
        });
      }

      // Update risk behavior data if it exists
      if (
        profile.late_bill_payment_history ||
        profile.spending_habits ||
        profile.monthly_budget_allocations
      ) {
        updateRiskBehavior({
          lateBillPaymentHistory: profile.late_bill_payment_history || "",
          spendingHabits: profile.spending_habits || "",
          monthlyBudgetAllocation: profile.monthly_budget_allocations || "",
          financialGoals: profile.financial_goals
            ? typeof profile.financial_goals === "string"
              ? profile.financial_goals.split(",")
              : Array.isArray(profile.financial_goals)
                ? profile.financial_goals
                : []
            : [],
        });
      }
    }
  }, [
    tenantData,
    updateFinancialEmployment,
    updatePropertyLocation,
    updateRiskBehavior,
  ]);

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
  const isStepCurrent = (stepId: number) => currentStep === stepId;

  // A step is accessible if:
  // 1. It's the current step
  // 2. It's already completed
  // 3. It's the next step after the last completed step
  const isStepAccessible = (stepId: number) => {
    if (isStepCompleted(stepId) || isStepCurrent(stepId)) {
      return true;
    }
    // Allow access to the next step if previous steps are completed
    const maxCompletedStep = Math.max(0, ...completedSteps);

    return stepId <= maxCompletedStep + 1;
  };

  const handleStepClick = (stepId: number) => {
    if (isStepAccessible(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <FinancialEmploymentStep />;
      case 3:
        return <PropertyLocationStep />;
      case 4:
        return <RiskBehaviorStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mx-auto">
        {/* Desktop Step Indicator */}
        <div className="hidden lg:flex items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center",
                  isStepAccessible(step.id)
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                )}
                onClick={() => handleStepClick(step.id)}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                    isStepCompleted(step.id)
                      ? "bg-primary-600 border-primary-600 text-white"
                      : isStepCurrent(step.id)
                        ? "bg-primary-600 border-primary-600 text-white"
                        : isStepAccessible(step.id)
                          ? "border-gray-300 text-gray-500 hover:border-primary-300"
                          : "border-gray-200 text-gray-300"
                  )}
                >
                  {isStepCompleted(step.id) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <div
                    className={cn(
                      "text-sm font-medium whitespace-nowrap",
                      isStepCompleted(step.id)
                        ? "text-primary-600"
                        : isStepCurrent(step.id)
                          ? "text-primary-600"
                          : isStepAccessible(step.id)
                            ? "text-gray-700"
                            : "text-gray-400"
                    )}
                  >
                    {step.title}
                  </div>
                </div>
                {index < steps?.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={cn(
                        "h-0.5 transition-colors w-12",
                        isStepCompleted(step.id)
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Step Indicator */}
        <div className="flex lg:hidden items-center space-x-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center space-x-1 cursor-pointer",
                isStepAccessible(step.id)
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              )}
              onClick={() => handleStepClick(step.id)}
            >
              {isStepCompleted(step.id) ? (
                <Check className="w-4 h-4 text-primary-600" />
              ) : (
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2",
                    isStepCurrent(step.id)
                      ? "bg-primary-600 border-primary-600"
                      : "border-gray-300"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isStepCompleted(step.id)
                    ? "text-primary-600"
                    : isStepCurrent(step.id)
                      ? "text-primary-600"
                      : "text-gray-400"
                )}
              >
                Step{step.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl w-full overflow-x-hidden mx-auto p-6 space-y-8">
        {/* Step Content */}
        <Card className="border-none shadow-none w-full">
          <CardHeader>
            {/* <CardTitle className="text-xl font-semibold">
              {steps.find((s) => s.id === currentStep)?.title}
            </CardTitle> */}
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}

const steps = [
  { id: 1, title: "Personal Info", description: "Basic personal information" },
  {
    id: 2,
    title: "Financial & Employment Data",
    description: "Job and income information",
  },
  {
    id: 3,
    title: "Property & Location Insights",
    description: "Housing preferences and situation",
  },
  {
    id: 4,
    title: "Risk & Behavior Profiling",
    description: "Financial behavior and goals",
  },
];
