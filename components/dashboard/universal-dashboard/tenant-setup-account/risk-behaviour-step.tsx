"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { alertSuccess, guruSuccess } from "@/assets/images";
import { Button } from "@/components/ui/button";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import CustomInput from "@/components/ui/custom-input";
import CustomRadioGroup from "@/components/ui/custom-radio-group";
import { useUpdateTenantProfile } from "@/hooks/api/use-tenants";
import { useTenantSetupStore } from "@/lib/stores/use-tenant-setup-store";
import { cn } from "@/lib/utils";
import { showModal } from "@/utils/modal-config";

import { RiskBehaviorFormType, riskBehaviorSchema } from "./schema";

export function RiskBehaviorStep() {
  const router = useRouter();
  const { riskBehavior, updateRiskBehavior, markStepCompleted, resetStore } =
    useTenantSetupStore();
  const { mutate: updateTenantProfile, isPending } = useUpdateTenantProfile();

  const methods = useForm<RiskBehaviorFormType>({
    resolver: zodResolver(riskBehaviorSchema),
    defaultValues: {
      lateBillPaymentHistory: riskBehavior.lateBillPaymentHistory || "never",
      spendingHabits: riskBehavior.spendingHabits,
      monthlyBudgetAllocation: riskBehavior.monthlyBudgetAllocation,
      financialGoals: riskBehavior.financialGoals,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: RiskBehaviorFormType) => {
    // Update the store with form data
    updateRiskBehavior(data);

    // Prepare payload for API
    const payload = {
      late_bill_payment_history: data.lateBillPaymentHistory,
      spending_habits: data.spendingHabits,
      monthly_budget_allocations: data.monthlyBudgetAllocation,
      financial_goals: data.financialGoals?.join(","),
      page_saved: 3,
    };

    const onSuccess = () => {
      // Show AI recommendations modal
      showAIRecommendationsModal();
    };

    // Always use update API for this step
    updateTenantProfile(payload, { onSuccess });
  };

  const showAIRecommendationsModal = () => {
    showModal({
      title:
        "Would you like AI to generate personalized rental & financial recommendations?",
      image: guruSuccess,
      actions: [
        {
          text: "No",
          variant: "outline",
          onClick: () => handleAIRecommendationResponse(false),
        },
        {
          text: "Yes",
          onClick: () => handleAIRecommendationResponse(true),
        },
      ],
    });
  };

  const handleAIRecommendationResponse = (acceptAI: boolean) => {
    const payload = {
      ai_for_suggestions: acceptAI,
      page_saved: 4,
    };

    const onSuccess = () => {
      markStepCompleted(4);
      toast.success("Tenant profile completed successfully!");
      resetStore();

      showModal({
        title:
          "Your tenant profile has been completed successfully. You can now start browsing properties and connect with property owners.",
        image: alertSuccess,
        onClose: () => router.push("/universal-dashboard"),
        actions: [
          {
            text: "Go to Dashboard",
            onClick: () => router.push("/universal-dashboard"),
          },
        ],
      });
    };

    updateTenantProfile(payload, { onSuccess });
  };

  const handleSkip = () => {
    // Show AI recommendations modal when skipping as well
    showAIRecommendationsModal();
  };

  const handleFinancialGoalToggle = (goalValue: string) => {
    const currentGoals = methods.getValues("financialGoals") || [];
    const isSelected = currentGoals.includes(goalValue);

    if (isSelected) {
      methods.setValue(
        "financialGoals",
        currentGoals.filter((goal) => goal !== goalValue)
      );
    } else {
      methods.setValue("financialGoals", [...currentGoals, goalValue]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Risk & Behavior Profiling
        </h2>
        <p className="text-gray-600">
          Help us tailor insights by sharing your budgeting and spending
          patterns.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Late Bill Payment History */}
            <div className="col-span-12">
              <CustomRadioGroup
                name="lateBillPaymentHistory"
                label="Late Bill Payment History"
                required
                options={[
                  { label: "Never Missed a Payment", value: "never" },
                  {
                    label: "Occasionally Late (1-2 times a year)",
                    value: "occasionally",
                  },
                  {
                    label: "Frequently Late (3+ times a year)",
                    value: "frequently",
                  },
                ]}
                direction="row"
              />
            </div>

            {/* Spending Habits */}
            <div className="col-span-12">
              <CustomInput
                name="spendingHabits"
                label="Spending Habits"
                placeholder="Select"
                required
                select
                options={[
                  {
                    label: "I stick to a strict budget",
                    value: "strict",
                  },
                  {
                    label: "I track spending but make occasional impulse buys",
                    value: "moderate",
                  },
                  {
                    label: "I spend freely and adjust as needed",
                    value: "flexible",
                  },
                ]}
              />
            </div>

            {/* Monthly Budget Allocation */}
            <div className="col-span-12">
              <CustomInput
                name="monthlyBudgetAllocation"
                label="Monthly Budget Allocation"
                placeholder="Enter amount"
                prefix="$"
                type="number"
              />
            </div>

            {/* Financial Goals */}
            <div className="col-span-12">
              <div className="space-y-4">
                <label className="text-base font-medium text-gray-900">
                  Financial Goals{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {financialGoalOptions.map((goal) => {
                      const isSelected =
                        methods.watch("financialGoals")?.includes(goal.value) ||
                        false;

                      return (
                        <div
                          key={goal.value}
                          className={cn(
                            "flex items-center space-x-2 p-3 cursor-pointer"
                          )}
                          onClick={() => handleFinancialGoalToggle(goal.value)}
                        >
                          <CustomCheckbox
                            name="financialGoals"
                            value={goal.value}
                            stopPropagation
                          />
                          <span className="text-sm flex-1">{goal.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3"
              disabled={isPending}
            >
              {isPending ? "Completing Profile..." : "Continue"}
            </Button>
          </div>

          {/* Skip Button */}
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
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

const financialGoalOptions = [
  { label: "Pay Off Debt", value: "pay_off_debt" },
  { label: "Build an Emergency Fund", value: "build_an_emergency_fund" },
  { label: "Increase Investments", value: "increase_investments" },
];
