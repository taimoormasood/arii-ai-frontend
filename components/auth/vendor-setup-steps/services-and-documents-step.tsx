"use client";

import Cookies from "js-cookie";
import { ChevronDown, Trash2Icon, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";

import { timeOptions } from "@/components/dashboard/property-owner-dashboard/my-properties/add-property/property-types/common/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/ui/custom-input";
import CustomPhoneInput from "@/components/ui/custom-phone-input";
import CustomTextarea from "@/components/ui/custom-textarea";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { errorHandler } from "@/helpers";
import { useClickOutside } from "@/hooks/use-click-outside";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";
import { setupVendorProfile } from "@/services/auth/auth.service";
import { SetupVendorProfileBody } from "@/services/auth/types";

import { VendorSetupFormValues } from "./schema";
import useVendorSteps from "./use-vendor-steps";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function ServicesAndDocumentsStep() {
  const {
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
  } = useVendorSteps();

  const { updateUser } = useAuth();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedParentCatError, setSelectedParentCatError] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedParentCategories.length > 0) setSelectedParentCatError(null);
  }, [selectedParentCategories]);

  const handleSubmit = async () => {
    if (selectedParentCategories.length === 0) {
      setSelectedParentCatError("Please select at least one service category");

      return;
    }
    const allSelectedSubServiceIds = Object.values(selectedSubServices).flat();
    if (
      allSelectedSubServiceIds.length === 0 &&
      selectedParentCategories.length > 0
    ) {
      toast.error(
        "Please select specific services offered under the chosen categories."
      );

      return;
    }

    setIsLoading(true);
    try {
      // 1. Construct the plain JavaScript payload object
      const dailyAvailabilityData = servicesAndDocuments.schedule.reduce(
        (acc, daySchedule) => {
          if (
            daySchedule?.day &&
            typeof daySchedule.isAvailable !== "undefined"
          ) {
            if (
              daySchedule.isAvailable &&
              daySchedule.fromTime &&
              daySchedule.toTime
            ) {
              acc[daySchedule.day] = {
                from: daySchedule.fromTime,
                to: daySchedule.toTime,
              };
            }
          }

          return acc;
        },
        {} as Record<string, { from: string; to: string }>
      );

      const apiPayload: SetupVendorProfileBody = {
        services_offered: JSON.stringify(allSelectedSubServiceIds),
        service_area: servicesAndDocuments.serviceArea,
        years_of_experience: servicesAndDocuments.yearsOfExperience,
        availability: servicesAndDocuments.available24_7.toString(),
        daily_availability: JSON.stringify(dailyAvailabilityData),
        emergency_services:
          servicesAndDocuments.offerEmergencyServices.toString(),
        languages: servicesAndDocuments.languagesSpoken.join(", "),
        insurance_coverage:
          servicesAndDocuments.hasInsuranceCoverage.toString(),
        description: servicesAndDocuments.description,
        // Ensure only File objects are passed if your state can hold mixed types
        other_certificates: servicesAndDocuments.certifications.filter(
          (file): file is File => file instanceof File
        ),
      };

      if (
        servicesAndDocuments.hasInsuranceCoverage &&
        servicesAndDocuments.insuranceYearsOfExperience
      ) {
        apiPayload.insurance_years_of_experience =
          servicesAndDocuments.insuranceYearsOfExperience;
      }

      // 2. Call the service function with the plain payload object
      const response = await setupVendorProfile(apiPayload);
      if (response?.success) {
        const res = await axiosInstance.get("/user-details");
        const user = res.data;
        const userData = await JSON.stringify(user?.data);
        const parsedData = await JSON.parse(userData);
        await updateUser(parsedData);
        const profile =
          parsedData?.properyproperty_owner_profile !== null ||
          parsedData?.vendor_profile !== null;
        Cookies.set("is_profile_completed", String(profile));
      }
      markStepCompleted(2);
      setCurrentStep(3);
      toast.success("Services and documents saved successfully!");
    } catch (error: any) {
      toast.error(errorHandler(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeChange = (
    day: string,
    index: number,
    timeType: "startTime" | "endTime",
    value: string
  ) => {
    const dayLower =
      day.toLowerCase() as keyof VendorSetupFormValues["availability"];
    const currentAvailability = methods.getValues("availability");

    if (currentAvailability[dayLower]) {
      methods.setValue(
        "availability",
        {
          ...currentAvailability,
          [dayLower]: {
            ...currentAvailability[dayLower],
            [timeType]: value,
          },
        },
        { shouldValidate: true }
      );
    }
    const updatedSchedule = [...servicesAndDocuments.schedule];
    updatedSchedule[index] = {
      ...updatedSchedule[index],
      [timeType]: value,
    };
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="space-y-6">
          {/* Service Categories Multi-Select */}
          <div className="space-y-2">
            <Label htmlFor="serviceCategories">Service Category *</Label>
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex-1 truncate">
                  {selectedParentCategories.length === 0 ? (
                    <span className="text-muted-foreground">
                      Select service categories
                    </span>
                  ) : (
                    <span className="text-sm">
                      {selectedParentCategories
                        .map(
                          (id) =>
                            serviceCategories.find((cat) => cat.id === id)
                              ?.name || ""
                        )
                        .join(", ")}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isDropdownOpen && "rotate-180"
                  )}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {serviceCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-accent cursor-pointer"
                      onClick={(event) => {
                        event?.stopPropagation();
                        handleParentCategoryToggle(category.id);
                      }}
                    >
                      <Checkbox
                        checked={selectedParentCategories.includes(category.id)}
                        onChange={() => {}}
                      />
                      <span className="text-sm">{category.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {selectedParentCatError && (
                <p className="text-red-500 text-sm">{selectedParentCatError}</p>
              )}
            </div>
          </div>

          {/* Services Offered Cards */}
          {selectedParentCategories.length > 0 && (
            <div className="space-y-4">
              <Label>Services offered</Label>
              <div className="space-y-4">
                {selectedParentCategories.map((parentId) => {
                  const parentCategory = serviceCategories.find(
                    (cat) => cat.id === parentId
                  );
                  if (!parentCategory) return null;

                  return (
                    <Card key={parentId} className="border border-gray-200">
                      <CardHeader className="pb-3 px-4 pt-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium">
                            {parentCategory.name}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeParentCategory(parentId)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2Icon className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pt-0">
                        <div className="flex gap-3 flex-wrap">
                          {parentCategory.subcategories.map((sub) => {
                            const isSelected =
                              selectedSubServices[parentId]?.includes(sub.id) ||
                              false;

                            return (
                              <div
                                key={sub.id}
                                className={cn(
                                  "flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-colors",
                                  isSelected
                                    ? "bg-primary-50 border-primary-200"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                )}
                                onClick={() =>
                                  handleSubServiceToggle(parentId, sub.id)
                                }
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className={cn(
                                    "data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                                  )}
                                />
                                <span className="text-sm flex-1">
                                  {sub.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Service Area */}
          <CustomInput
            name="serviceArea"
            select
            options={serviceAreas}
            label="Service Area"
            placeholder="Select"
            onChange={(value) =>
              updateServicesAndDocuments({ serviceArea: value })
            }
          />

          {/* Years of Experience */}
          <CustomInput
            name="yearsOfExperience"
            select
            label="Years of Experience"
            placeholder="Select"
            options={experienceYears}
            onChange={(value) =>
              updateServicesAndDocuments({ yearsOfExperience: value })
            }
          />

          {/* Available 24/7 */}
          <Controller
            control={methods.control}
            name="available24_7"
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <Label htmlFor="available24_7">Available 24/7</Label>
                <Switch
                  id="available24_7"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          {/* Availability Section - Updated */}
          {!methods.watch("available24_7") && (
            <FormField
              control={methods.control}
              name="availability"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-4">
                  <FormControl>
                    <div className="space-y-3 w-full flex flex-col items-start sm:items-center shadow-md rounded-lg border border-gray-200 p-4">
                      {days.map((day, index) => {
                        const dayLower =
                          day.toLowerCase() as keyof VendorSetupFormValues["availability"];
                        const isSelected =
                          !!methods.watch("availability")[dayLower];
                        const timeRange =
                          methods.watch("availability")[dayLower];

                        // Get error for this specific day
                        const dayError =
                          methods.formState.errors.availability?.[dayLower];

                        return (
                          <div
                            key={day}
                            className="flex flex-col sm:flex-row items-center justify-between space-x-4 w-full"
                          >
                            {/* Checkbox and day name */}
                            <div className="flex gap-2 items-start w-full sm:w-auto mb-2 sm:mb-0">
                              <Checkbox
                                className="hover:cursor-pointer"
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleAvailabilityToggle(day)
                                }
                              />
                              <div className="w-20 text-sm text-gray-900">
                                {day}
                              </div>
                            </div>

                            {/* Time selectors */}
                            <div className="flex flex-col sm:flex-row items-center space-x-2 self-end">
                              <div className="space-y-2">
                                <div className="flex gap-x-2 items-center">
                                  <div className="relative">
                                    <select
                                      className={`text-gray-500 px-3 py-2 border ${
                                        dayError
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-lg focus:outline-none appearance-none bg-white text-sm pr-8 ${
                                        !isSelected
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                      value={timeRange?.startTime || "9:00 AM"}
                                      onChange={(e) =>
                                        handleTimeChange(
                                          day,
                                          index,
                                          "startTime",
                                          e.target.value
                                        )
                                      }
                                      disabled={!isSelected}
                                    >
                                      {timeOptions.map((time) => (
                                        <option key={time} value={time}>
                                          {time}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown
                                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 ${
                                        isSelected
                                          ? "text-gray-400"
                                          : "text-gray-300"
                                      } pointer-events-none`}
                                    />
                                  </div>
                                  <span
                                    className={`text-sm ${
                                      isSelected
                                        ? "text-gray-900"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    to
                                  </span>
                                  <div className="relative">
                                    <select
                                      className={`text-gray-500 px-3 py-2 border ${
                                        dayError
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-lg focus:outline-none appearance-none bg-white text-sm pr-8 ${
                                        !isSelected
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                      value={timeRange?.endTime || "6:00 PM"}
                                      onChange={(e) =>
                                        handleTimeChange(
                                          day,
                                          index,
                                          "endTime",
                                          e.target.value
                                        )
                                      }
                                      disabled={!isSelected}
                                    >
                                      {timeOptions.map((time) => (
                                        <option key={time} value={time}>
                                          {time}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown
                                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 ${
                                        isSelected
                                          ? "text-gray-400"
                                          : "text-gray-300"
                                      } pointer-events-none`}
                                    />
                                  </div>
                                </div>
                                {/* Show error only for this day if it exists */}
                                {dayError && (
                                  <div className="text-red-500 text-xs mt-1 sm:mt-0 sm:ml-2">
                                    {dayError.message}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {methods.formState.errors.availability?.message && (
                        <p className="text-red-500 text-sm mt-1 mr-auto">
                          {methods.formState.errors.availability.message}
                        </p>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Emergency Services */}
          <Controller
            control={methods.control}
            name="offerEmergencyServices"
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <Label htmlFor="emergencyServices">
                  Do you offer emergency services?
                </Label>
                <Switch
                  id="emergencyServices"
                  className="bg-gray-200"
                  checked={field.value}
                  onCheckedChange={() => {
                    field.onChange(!field.value);
                    updateServicesAndDocuments({
                      offerEmergencyServices: !field.value,
                    });
                  }}
                />
              </div>
            )}
          />
          {methods.watch("offerEmergencyServices") && (
            <CustomPhoneInput
              name="phoneNumber"
              label=" Emergency Contact Number"
              placeholder="Enter Emergency Phone Number"
            />
          )}
          {/* Languages Spoken */}
          <CustomInput
            name="languagesSpoken"
            placeholder="Select languages"
            select
            label="Languages Spoken"
            options={languages}
            onChange={(value) =>
              updateServicesAndDocuments({ languagesSpoken: [value] })
            }
          />

          {/* Insurance Coverage */}
          <Controller
            control={methods.control}
            name="hasInsuranceCoverage"
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <Label htmlFor="insuranceCoverage">
                  Do you have insurance coverage?
                </Label>
                <Switch
                  id="insuranceCoverage"
                  className="bg-gray-200"
                  checked={field.value}
                  onCheckedChange={() => {
                    field.onChange(!field.value);
                    updateServicesAndDocuments({
                      hasInsuranceCoverage: !field.value,
                    });
                  }}
                />
              </div>
            )}
          />

          {/* Insurance Years of Experience */}
          {servicesAndDocuments.hasInsuranceCoverage && (
            <CustomInput
              name="insuranceYears"
              placeholder="Select"
              select
              label="Years of Insurance Experience"
              options={experienceYears}
            />
          )}

          {/* Certifications Upload */}
          <div className="space-y-4">
            <Label>Certifications / Licenses Upload</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 border-gray-200"
                >
                  <Upload className="w-4 h-4" />
                  Choose file
                </Button>
                <span className="text-sm text-gray-500">
                  {servicesAndDocuments.certifications.length === 0
                    ? "No file chosen"
                    : `${servicesAndDocuments.certifications.length} file(s) selected`}
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-xs text-gray-500">
                Accepts .pdf, .jpg, .png, .doc, .docx files. Max size: 10MB
                each.
              </div>

              {/* Display uploaded files */}
              {servicesAndDocuments.certifications.length > 0 && (
                <div className="space-y-2">
                  {servicesAndDocuments.certifications.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <CustomTextarea
            name="description"
            label="Description"
            required
            placeholder="Description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none resize-none"
          />

          {/* Continue Button */}
          <div className="flex justify-end pt-6">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8"
            >
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

const serviceAreas = [
  "New York City",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
  "Manhattan",
  "Long Island",
  "Westchester",
  "New Jersey",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
];

const experienceYears = [
  { label: "Less than 1 year", value: 0 },
  { label: "1-2 years", value: 1 },
  { label: "3-5 years", value: 3 },
  { label: "6-10 years", value: 6 },
  { label: "11-15 years", value: 11 },
  { label: "More than 15 years", value: 16 },
];
