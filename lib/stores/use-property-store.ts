import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  propertyStepsConfig,
  PropertyType,
} from "@/components/dashboard/property-owner-dashboard/my-properties/config/property-steps";
import {
  UnitPropertyType,
  unitStepsConfig,
} from "@/components/dashboard/property-owner-dashboard/my-properties/config/unit-steps";
import type { SinglePropertyView } from "@/services/properties/types";

import {
  calculateCompletedSteps,
  calculateCurrentStep,
  transformPropertyDataForStore,
  transformUnitDataForStore,
} from "./property-data-transformer";
import { PropertyFormData, UnitFormData } from "./types";

interface PropertyStore {
  // Property type and steps
  selectedPropertyType: PropertyType | null;
  setSelectedPropertyType: (type: PropertyType) => void;

  // Edit mode tracking
  isEditMode: boolean;
  editingPropertyId: number | null;
  setEditMode: (isEdit: boolean, propertyId?: number) => void;

  // Current step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  currentUnitStep: number;
  setCurrentUnitStep: (step: number) => void;

  // Form data organized by semantic keys
  formData: PropertyFormData;
  unitFormData: UnitFormData;

  // Update specific step data using semantic key
  updateStepData: <T extends keyof PropertyFormData>(
    stepKey: T,
    data: PropertyFormData[T]
  ) => void;

  updateUnitStepData: <T extends keyof UnitFormData>(
    stepKey: T,
    data: UnitFormData[T]
  ) => void;

  // Get specific step data using semantic key
  getStepData: <T extends keyof PropertyFormData>(
    stepKey: T
  ) => PropertyFormData[T];

  // Get specific step data using semantic key
  getUnitStepData: <T extends keyof UnitFormData>(
    stepKey: T
  ) => UnitFormData[T];

  // Check if step has data (implies it's valid since we only save valid data)
  hasStepData: (stepKey: keyof PropertyFormData) => boolean;
  hasUnitStepData: (stepKey: keyof UnitFormData) => boolean;

  // Get all form data flattened (for API submission)
  getAllFormData: () => Record<string, any>;
  getAllUnitFormData: () => Record<string, any>;

  // Step completion tracking
  completedSteps: number[];
  completedUnitSteps: number[];

  markStepCompleted: (step: number) => void;
  markUnitStepCompleted: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
  isUnitStepCompleted: (step: number) => boolean;

  // Enhanced navigation helpers
  canNavigateToStep: (step: number, propertyType: PropertyType) => boolean;
  canNavigateToUnitStep: (
    step: number,
    propertyType: UnitPropertyType
  ) => boolean;
  getNextIncompleteStep: () => number | null;
  getNextIncompleteUnitStep: () => number | null;

  // Populate store from API data for editing
  populateFromApiData: (apiData: SinglePropertyView) => void;

  // Populate unit store from API data for editing a unit
  populateUnitFromApiData: (unitApiData: any) => void;

  // Reset store
  resetStore: () => void;

  // Clear specific step data
  clearStepData: (stepKey: keyof PropertyFormData) => void;
  clearUnitStepData: (stepKey: keyof UnitFormData) => void;

  // Clear all form data (keep navigation state)
  clearAllFormData: () => void;
  clearAllUnitFormData: () => void;

  // Store step data in the correct form data object based on context
  setFormDataByContext: (
    context: "property" | "unit",
    stepKey: string,
    data: any
  ) => void;
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      selectedPropertyType: null,
      setSelectedPropertyType: (type) => {
        set({ selectedPropertyType: type });
        // set({ currentStep: 1 });
      },

      // Edit mode management
      isEditMode: false,
      editingPropertyId: null,
      setEditMode: (isEdit, propertyId) => {
        set({
          isEditMode: isEdit,
          editingPropertyId: propertyId || null,
        });
      },

      currentStep: 1,

      currentUnitStep: 1,
      setCurrentStep: (step) => set({ currentStep: step }),
      setCurrentUnitStep: (step) => set({ currentUnitStep: step }),

      formData: {},
      unitFormData: {},

      updateStepData: (stepKey, data) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [stepKey]: data,
          },
        }));
      },

      updateUnitStepData: (stepKey, data) => {
        set((state) => ({
          unitFormData: {
            ...state.unitFormData,
            [stepKey]: data,
          },
        }));
      },

      getStepData: (stepKey) => {
        const { formData } = get();

        return formData[stepKey];
      },

      getUnitStepData: (stepKey) => {
        const { unitFormData } = get();

        return unitFormData[stepKey];
      },

      hasStepData: (stepKey) => {
        const { formData } = get();
        const stepData = formData[stepKey];

        return (
          stepData !== undefined &&
          stepData !== null &&
          Object.keys(stepData).length > 0
        );
      },

      hasUnitStepData: (stepKey) => {
        const { unitFormData } = get();
        const stepData = unitFormData[stepKey];

        return (
          stepData !== undefined &&
          stepData !== null &&
          Object.keys(stepData).length > 0
        );
      },

      getAllFormData: () => {
        const { formData } = get();
        const flattened: Record<string, any> = {};

        Object.entries(formData).forEach(([stepKey, stepData]) => {
          if (stepData) {
            Object.entries(stepData).forEach(([key, value]) => {
              flattened[key] = value;
            });
          }
        });

        return flattened;
      },

      getAllUnitFormData: () => {
        const { unitFormData } = get();
        const flattened: Record<string, any> = {};

        Object.entries(unitFormData).forEach(([stepKey, stepData]) => {
          if (stepData) {
            Object.entries(stepData).forEach(([key, value]) => {
              flattened[key] = value;
            });
          }
        });

        return flattened;
      },

      completedSteps: [],
      completedUnitSteps: [],

      markStepCompleted: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step].sort((a, b) => a - b),
        })),

      markUnitStepCompleted: (step) =>
        set((state) => ({
          completedUnitSteps: state.completedUnitSteps.includes(step)
            ? state.completedUnitSteps
            : [...state.completedUnitSteps, step].sort((a, b) => a - b),
        })),

      isStepCompleted: (step) => get().completedSteps.includes(step),
      isUnitStepCompleted: (step) => get().completedSteps.includes(step),

      // Enhanced navigation logic with editable step support
      canNavigateToStep: (step, propertyType) => {
        const { completedSteps, currentStep } = get();

        // Always allow current step
        if (step === currentStep) return true;

        // Allow navigation to next incomplete step
        if (step === Math.max(...completedSteps, 0) + 1) return true;

        // For completed steps, check if they're editable
        if (completedSteps.includes(step)) {
          // Import here to avoid circular dependency
          const steps = propertyStepsConfig[propertyType];
          const stepConfig = steps?.find((s: any) => s.id === step);

          return stepConfig?.editable || false;
        }

        return false;
      },

      canNavigateToUnitStep: (step, propertyType) => {
        const { completedUnitSteps, currentUnitStep } = get();

        // Always allow current step
        if (step === currentUnitStep) return true;

        // Allow navigation to next incomplete step
        if (step === Math.max(...completedUnitSteps, 0) + 1) return true;

        // For completed steps, check if they're editable
        if (completedUnitSteps.includes(step)) {
          // Import here to avoid circular dependency
          const steps = unitStepsConfig[propertyType];
          const stepConfig = steps?.find((s: any) => s.id === step);

          return stepConfig?.editable || false;
        }

        return false;
      },

      getNextIncompleteStep: () => {
        const { completedSteps, selectedPropertyType } = get();
        if (!selectedPropertyType) return null;

        const maxCompleted = Math.max(...completedSteps, 0);

        return maxCompleted + 1;
      },

      getNextIncompleteUnitStep: () => {
        const { completedUnitSteps, selectedPropertyType } = get();
        if (!selectedPropertyType) return null;

        const maxCompleted = Math.max(...completedUnitSteps, 0);

        return maxCompleted + 1;
      },

      // Populate store from API data for editing
      populateFromApiData: (apiData) => {
        const transformedData = transformPropertyDataForStore(apiData);
        // Extract page_saved and published from the correct location in API response
        const pageSaved = (apiData.detail as any).page_saved;
        const published = (apiData.detail as any).published;
        const propertyType = apiData.detail.property_type;

        const currentStep = calculateCurrentStep(pageSaved, published);
        const completedSteps = calculateCompletedSteps(
          pageSaved,
          published,
          propertyType
        );

        set({
          formData: transformedData,
          currentStep,
          completedSteps,
          selectedPropertyType: apiData.detail.property_type as PropertyType,
          isEditMode: true,
          editingPropertyId: apiData.detail.id,
        });
      },

      // Populate unit store from API data for editing a unit
      populateUnitFromApiData: (unitApiData) => {
        // Transform unit data before storing
        const unitFormData = transformUnitDataForStore(unitApiData);
        const unitPageSaved = unitApiData.detail?.page_saved || 0;
        const unitPublished = unitApiData.detail?.published || false;
        const unitPropertyType = unitApiData.detail?.property_type;
        const totalUnitSteps = 6; // Adjust if your unit flow has a different number of steps
        const completedUnitSteps = calculateCompletedSteps(
          unitPageSaved,
          unitPublished,
          unitPropertyType
        );
        let currentUnitStep;
        if (completedUnitSteps.length >= totalUnitSteps) {
          currentUnitStep = 1;
        } else {
          currentUnitStep = Math.max(...completedUnitSteps, 0) + 1;
        }
        set({
          unitFormData,
          currentUnitStep,
          completedUnitSteps,
        });
      },

      resetStore: () =>
        set({
          selectedPropertyType: null,
          currentStep: 1,
          currentUnitStep: 1,
          formData: {},
          unitFormData: {},
          completedSteps: [],
          completedUnitSteps: [],
          isEditMode: false,
          editingPropertyId: null,
        }),

      clearStepData: (stepKey) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [stepKey]: undefined,
          },
        })),

      clearUnitStepData: (stepKey) =>
        set((state) => ({
          unitFormData: {
            ...state.unitFormData,
            [stepKey]: undefined,
          },
        })),

      clearAllFormData: () =>
        set({
          formData: {},
          completedSteps: [],
        }),

      clearAllUnitFormData: () =>
        set({
          unitFormData: {},
          completedUnitSteps: [],
        }),

      // Store step data in the correct form data object based on context
      setFormDataByContext: (context, stepKey, data) => {
        if (context === "unit") {
          get().updateUnitStepData(stepKey, data);
        } else {
          get().updateStepData(stepKey, data);
        }
      },
    }),

    {
      name: "property-store",
      partialize: (state) => ({
        selectedPropertyType: state.selectedPropertyType,
        currentStep: state.currentStep,
        currentUnitStep: state.currentUnitStep,
        formData: state.formData,
        unitFormData: state.unitFormData,
        completedSteps: state.completedSteps,
        completedUnitSteps: state.completedUnitSteps,
        isEditMode: state.isEditMode,
        editingPropertyId: state.editingPropertyId,
      }),
    }
  )
);
