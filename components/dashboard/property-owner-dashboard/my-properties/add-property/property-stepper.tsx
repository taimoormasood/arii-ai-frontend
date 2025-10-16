"use client";

import { ChevronRight, HomeIcon } from "lucide-react";

import { formatText } from "@/helpers";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import { cn } from "@/lib/utils";

import {
  propertyStepsConfig,
  type PropertyType,
} from "../config/property-steps";

interface PropertyStepperProps {
  propertyType: PropertyType;
}

export function PropertyStepper({ propertyType }: PropertyStepperProps) {
  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    canNavigateToStep,
    selectedPropertyType,
    isEditMode,
  } = usePropertyStore();

  const steps = propertyStepsConfig[propertyType];

  const handleStepClick = (stepId: number) => {
    if (canNavigateToStep(stepId, propertyType)) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div className="">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <HomeIcon />
        <ChevronRight size={14} />
        <span>Dashboard</span>
        <ChevronRight size={14} />
        <span>Properties</span>
        <ChevronRight size={14} />
        <span className="text-gray-800">
          {isEditMode ? "Edit property" : "Add new property"}
        </span>
      </div>

      {/* Header */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? "Edit" : "Add"} {formatText(selectedPropertyType!)}{" "}
          Property
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Please update the details for this property"
            : "Please fill the detail to add a property"}
        </p>
      </div>

      {/* Stepper */}
      <div className="p-1 md:p-3 mb-4">
        <div className="flex flex-wrap gap-4">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isClickable = canNavigateToStep(step.id, propertyType);
            const isLocked = isCompleted && !step.editable;

            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isClickable || isLocked}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full border text-sm font-semibold transition-all duration-200",
                    isCurrent && "border-primary-600 text-primary-600 bg-primary-50",
                    isCompleted &&
                      !isCurrent &&
                      step.editable &&
                      "bg-primary-600 border-primary-600 text-white hover:bg-primary-700",
                    isCompleted &&
                      !isCurrent &&
                      !step.editable &&
                      "bg-gray-400 border-gray-400 text-white",
                    !isCurrent &&
                      !isCompleted &&
                      "bg-white border-gray-300 text-gray-500",
                    !isClickable && "cursor-not-allowed opacity-50",
                    isClickable &&
                      !isCurrent &&
                      !isCompleted &&
                      "hover:border-primary-300",
                    isClickable &&
                      isCompleted &&
                      step.editable &&
                      "cursor-pointer"
                  )}
                >
                  {isCompleted && !isCurrent ? "✓" : step.id}
                </button>

                {/* Step Label */}
                <div className="ml-3">
                  <span
                    className={cn(
                      "text-sm font-medium transition-all duration-200",
                      isCurrent && "text-primary-600",
                      isCompleted && step.editable && "text-primary-600",
                      isCompleted && !step.editable && "text-gray-500",
                      !isCurrent && !isCompleted && "text-gray-500"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
