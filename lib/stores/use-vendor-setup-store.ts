"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ServiceSchedule {
  day: string;
  isAvailable: boolean;
  fromTime: string;
  toTime: string;
}

export interface ServicesAndDocuments {
  serviceCategories: string[];
  serviceArea: string;
  yearsOfExperience: string;
  available24_7: boolean;
  schedule: ServiceSchedule[];
  offerEmergencyServices: boolean;
  languagesSpoken: string[];
  hasInsuranceCoverage: boolean;
  insuranceYearsOfExperience: string;
  certifications: File[];
  description: string;
}

export interface BusinessInfo {
  profileImage?: File;
  vendorRole: string;
  registrationType: "individual" | "business";
  businessName: string;
  businessWebsite: string;
  businessAddress: string;
  taxId: string;
  businessType: string;
  businessLicense?: File;
}

export interface VendorSetupState {
  currentStep: number;
  completedSteps: number[];
  personalInfo: PersonalInfo;
  servicesAndDocuments: ServicesAndDocuments;
  businessInfo: BusinessInfo;

  // Actions
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateServicesAndDocuments: (data: Partial<ServicesAndDocuments>) => void;
  updateBusinessInfo: (data: Partial<BusinessInfo>) => void;
  resetStore: () => void;
}

// Update the initial state to be empty since we'll populate from auth
const initialPersonalInfo: PersonalInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

const initialServicesAndDocuments: ServicesAndDocuments = {
  serviceCategories: [],
  serviceArea: "",
  yearsOfExperience: "",
  available24_7: false,
  schedule: [],
  offerEmergencyServices: false,
  languagesSpoken: [],
  hasInsuranceCoverage: false,
  insuranceYearsOfExperience: "",
  certifications: [],
  description: "",
};

const initialBusinessInfo: BusinessInfo = {
  vendorRole: "",
  registrationType: "individual",
  businessName: "",
  businessWebsite: "",
  businessAddress: "",
  taxId: "",
  businessType: "",
};

export const useVendorSetupStore = create<VendorSetupState>()(
  persist(
    (set, get) => ({
      currentStep: 2,
      completedSteps: [1],
      personalInfo: initialPersonalInfo,
      servicesAndDocuments: initialServicesAndDocuments,
      businessInfo: initialBusinessInfo,

      setCurrentStep: (step) => set({ currentStep: step }),

      markStepCompleted: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        })),

      updatePersonalInfo: (data) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...data },
        })),

      updateServicesAndDocuments: (data) =>
        set((state) => ({
          servicesAndDocuments: { ...state.servicesAndDocuments, ...data },
        })),

      updateBusinessInfo: (data) =>
        set((state) => ({
          businessInfo: { ...state.businessInfo, ...data },
        })),

      resetStore: () =>
        set({
          currentStep: 2,
          completedSteps: [],
          personalInfo: initialPersonalInfo,
          servicesAndDocuments: initialServicesAndDocuments,
          businessInfo: initialBusinessInfo,
        }),
    }),
    {
      name: "vendor-setup-storage",
    }
  )
);
