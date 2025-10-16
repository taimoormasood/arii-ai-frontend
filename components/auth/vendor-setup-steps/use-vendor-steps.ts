import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useGetServiceCategories } from "@/hooks/api/use-setup-profile";
import { useVendorSetupStore } from "@/lib/stores/use-vendor-setup-store";

import { servicesDocumentsStepSchema, VendorSetupFormValues } from "./schema";

const useVendorSteps = () => {
  const [selectedParentCategories, setSelectedParentCategories] = useState<
    number[]
  >([]);
  const [selectedSubServices, setSelectedSubServices] = useState<
    Record<number, number[]>
  >({});

  const { data } = useGetServiceCategories();

  const serviceCategories = data?.data || [];

  const {
    servicesAndDocuments,
    updateServicesAndDocuments,
    setCurrentStep,
    markStepCompleted,
  } = useVendorSetupStore();

  const methods = useForm<VendorSetupFormValues>({
    resolver: zodResolver(servicesDocumentsStepSchema),
    mode: "onChange",
    defaultValues: {
      serviceCategories: [],
      servicesOffered: [],
      serviceArea: "",
      yearsOfExperience: "",
      available24_7: false,
      availability: {},
      offerEmergencyServices: false,
      languagesSpoken: "",
      hasInsuranceCoverage: false,
      insuranceYearsOfExperience: "",
      certifications: [],
      description: "",
      phoneNumber: "",
    },
  });

  const handleAvailabilityToggle = (day: string) => {
    const dayLower =
      day.toLowerCase() as keyof VendorSetupFormValues["availability"];
    const currentAvailability = methods.getValues("availability");

    if (currentAvailability[dayLower]) {
      // Remove the day
      const newAvailability = { ...currentAvailability };
      delete newAvailability[dayLower];
      methods.setValue("availability", newAvailability, {
        shouldValidate: true,
      });
    } else {
      // Add the day with default times
      methods.setValue(
        "availability",
        {
          ...currentAvailability,
          [dayLower]: {
            startTime: "9:00 AM",
            endTime: "6:00 PM",
          },
        },
        { shouldValidate: true }
      );
    }
  };

  const handleParentCategoryToggle = (categoryId: number) => {
    setSelectedParentCategories((prev) => {
      const isSelected = prev.includes(categoryId);
      if (isSelected) {
        // Remove category and its sub-services
        const newSelected = prev.filter((id) => id !== categoryId);
        const newSubServices = { ...selectedSubServices };
        delete newSubServices[categoryId];
        setSelectedSubServices(newSubServices);

        return newSelected;
      } else {
        // Add category
        return [...prev, categoryId];
      }
    });
  };

  const handleSubServiceToggle = (
    parentCategoryId: number,
    subServiceId: number
  ) => {
    setSelectedSubServices((prev) => {
      const currentSubs = prev[parentCategoryId] || [];
      const isSelected = currentSubs.includes(subServiceId);
      if (isSelected) {
        return {
          ...prev,
          [parentCategoryId]: currentSubs.filter((id) => id !== subServiceId),
        };
      } else {
        return {
          ...prev,
          [parentCategoryId]: [...currentSubs, subServiceId],
        };
      }
    });
  };

  const removeParentCategory = (categoryId: number) => {
    setSelectedParentCategories((prev) =>
      prev.filter((id) => id !== categoryId)
    );
    setSelectedSubServices((prev) => {
      const newSubServices = { ...prev };
      delete newSubServices[categoryId];

      return newSubServices;
    });
  };

  const handleScheduleChange = (
    dayIndex: number,
    field: "fromTime" | "toTime" | "isAvailable",
    value: string | boolean
  ) => {
    const updatedSchedule = [...servicesAndDocuments.schedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      [field]: value,
    };
    updateServicesAndDocuments({ schedule: updatedSchedule });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const updatedFiles = [...servicesAndDocuments.certifications, ...files];
    updateServicesAndDocuments({ certifications: updatedFiles });
  };

  const removeFile = (index: number) => {
    const updatedFiles = servicesAndDocuments.certifications.filter(
      (_, i) => i !== index
    );
    updateServicesAndDocuments({ certifications: updatedFiles });
  };

  return {
    handleAvailabilityToggle,
    methods,
    handleParentCategoryToggle,
    handleSubServiceToggle,
    removeParentCategory,
    handleScheduleChange,
    handleFileUpload,
    removeFile,
    servicesAndDocuments,
    setCurrentStep,
    markStepCompleted,
    updateServicesAndDocuments,
    serviceCategories,
    selectedParentCategories,
    selectedSubServices,
  };
};

export default useVendorSteps;
