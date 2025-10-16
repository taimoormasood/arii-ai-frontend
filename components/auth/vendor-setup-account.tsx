"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/contexts/auth-context";
import { useVendorSetupStore } from "@/lib/stores/use-vendor-setup-store";
import { cn } from "@/lib/utils";

import { BusinessInfoStep } from "./vendor-setup-steps/business-info-step";
import { PersonalInfoStep } from "./vendor-setup-steps/personal-info-step";
import { ServicesAndDocumentsStep } from "./vendor-setup-steps/services-and-documents-step";

export function VendorSetupAccount({
  onProfileSetupCompleted,
}: { onProfileSetupCompleted?: () => void } = {}) {
  const { user } = useAuth();
  const { currentStep, completedSteps, setCurrentStep } = useVendorSetupStore();
  const [isLoading, setIsLoading] = useState(false);

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
        return <ServicesAndDocumentsStep />;
      case 3:
        return <BusinessInfoStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  // Show loading if user is not available yet
  if (!user) {
    return (
      <div className="p-6 space-y-8">
        {/* <div className="max-w-4xl mx-auto p-6"> */}
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mx-auto">
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
                  isStepCompleted(step.id) || isStepCurrent(step.id)
                    ? "bg-primary-600 border-primary-600 text-white"
                    : isStepAccessible(step.id)
                      ? "border-gray-300 text-gray-500 hover:border-blue-300"
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
                    isStepCompleted(step.id) || isStepCurrent(step.id)
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
      <div className="max-w-3xl w-full overflow-x-hidden mx-auto p-6 space-y-8">
        {/* Step Content */}
        <Card className="border-none shadow-none w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {steps.find((s) => s.id === currentStep)?.title}
            </CardTitle>
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
    title: "Services and Documents",
    description: "Service details and certifications",
  },
  {
    id: 3,
    title: "Business and Registration Info",
    description: "Business details and registration",
  },
];
