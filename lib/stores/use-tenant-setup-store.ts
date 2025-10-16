"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface FinancialEmployment {
  jobTitle: string;
  employmentStatus: string;
  industry: string;
  incomeRange: string;
  mortgageAmount: number | undefined;
  creditScoreRange: string;
  debtToIncomeRatio: string;
  investmentPreferences: string[];
}

export interface PropertyLocation {
  propertyType: string;
  lengthOfStay: string;
  utilityCostEstimates: string;
  leaseTerm: number | undefined;
  preferredRentalPriceRange: string;
  currentHomeValue: number | undefined;
  interestInMoving: string;
}

export interface RiskBehavior {
  lateBillPaymentHistory: string;
  spendingHabits: string;
  monthlyBudgetAllocation: number | undefined;
  financialGoals: string[];
}

export interface TenantSetupState {
  currentStep: number;
  completedSteps: number[];
  personalInfo: PersonalInfo;
  financialEmployment: FinancialEmployment;
  propertyLocation: PropertyLocation;
  riskBehavior: RiskBehavior;

  // Actions
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateFinancialEmployment: (data: Partial<FinancialEmployment>) => void;
  updatePropertyLocation: (data: Partial<PropertyLocation>) => void;
  updateRiskBehavior: (data: Partial<RiskBehavior>) => void;
  resetStore: () => void;
}

const initialPersonalInfo: PersonalInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

const initialFinancialEmployment: FinancialEmployment = {
  jobTitle: "",
  employmentStatus: "",
  industry: "",
  incomeRange: "",
  mortgageAmount: undefined,
  creditScoreRange: "",
  debtToIncomeRatio: "",
  investmentPreferences: [],
};

const initialPropertyLocation: PropertyLocation = {
  propertyType: "",
  lengthOfStay: "",
  utilityCostEstimates: "",
  leaseTerm: undefined,
  preferredRentalPriceRange: "",
  currentHomeValue: undefined,
  interestInMoving: "within_6_months",
};

const initialRiskBehavior: RiskBehavior = {
  lateBillPaymentHistory: "",
  spendingHabits: "",
  monthlyBudgetAllocation: undefined,
  financialGoals: [],
};

export const useTenantSetupStore = create<TenantSetupState>()(
  persist(
    (set, get) => ({
      currentStep: 2,
      completedSteps: [1],
      personalInfo: initialPersonalInfo,
      financialEmployment: initialFinancialEmployment,
      propertyLocation: initialPropertyLocation,
      riskBehavior: initialRiskBehavior,

      setCurrentStep: (step) => set({ currentStep: step }),

      markStepCompleted: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        })),

      updatePersonalInfo: (data) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...data },
        })),

      updateFinancialEmployment: (data) =>
        set((state) => ({
          financialEmployment: { ...state.financialEmployment, ...data },
        })),

      updatePropertyLocation: (data) =>
        set((state) => ({
          propertyLocation: { ...state.propertyLocation, ...data },
        })),

      updateRiskBehavior: (data) =>
        set((state) => ({
          riskBehavior: { ...state.riskBehavior, ...data },
        })),

      resetStore: () =>
        set({
          currentStep: 2,
          completedSteps: [1],
          personalInfo: initialPersonalInfo,
          financialEmployment: initialFinancialEmployment,
          propertyLocation: initialPropertyLocation,
          riskBehavior: initialRiskBehavior,
        }),
    }),
    {
      name: "tenant-setup-storage",
    }
  )
);
