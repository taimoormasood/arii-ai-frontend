"use client";

import { ChevronRight, HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { formatText } from "@/helpers";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import { cn } from "@/lib/utils";

import { type UnitPropertyType, unitStepsConfig } from "../config/unit-steps";

interface UnitStepperProps {
  propertyType: UnitPropertyType;
}

export function UnitStepper({ propertyType }: UnitStepperProps) {
  const {
    currentUnitStep,
    setCurrentUnitStep,
    completedUnitSteps,
    canNavigateToUnitStep,
    selectedPropertyType,
  } = usePropertyStore();

  const steps = unitStepsConfig[propertyType];

  const router = useRouter();

  const handleStepClick = (stepId: number) => {
    // if (canNavigateToUnitStep(stepId, propertyType)) {
    setCurrentUnitStep(stepId);
    // }
  };

  return (
    <div className="">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <HomeIcon />
        <ChevronRight size={14} />
        <span
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </span>
        <ChevronRight size={14} />
        <span
          className="cursor-pointer"
          onClick={() => router.push("/my-properties")}
        >
          Properties
        </span>
        <ChevronRight size={14} />
        <span className="text-gray-800">Add new property</span>
        <ChevronRight size={14} />
        <span className="text-gray-800">Add unit</span>
      </div>

      {/* Header */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add {formatText(selectedPropertyType!)}
        </h1>
        <p className="text-gray-600">Please fill the detail to add unit</p>
      </div>

      {/* Stepper */}
      <div className="p-1 md:p-3 mb-4">
        <div className="flex flex-wrap gap-4">
          {steps?.map((step) => {
            const isCompleted = true;
            const isCurrent = currentUnitStep === step.id;
            const isClickable = canNavigateToUnitStep(step.id, propertyType);
            const isLocked = !step.editable;

            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(step.id)}
                  // disabled={isLocked}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full border text-sm font-semibold transition-all duration-200 ",
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
                    !isClickable && "opacity-50",
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
