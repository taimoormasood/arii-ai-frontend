"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import CustomRadioGroup from "@/components/ui/custom-radio-group";
import { FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  useAddAmenities,
  useGetAmenities,
  useGetPropertyDetail,
} from "@/hooks/api/use-properties";
import { AmenitiesFormData } from "@/lib/stores/types";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import { cn } from "@/lib/utils";

import { AmenitiesLoader } from "../property-types/common/amenities-skeleton";
import { createAmenitiesSchema } from "./schema";

interface AmenitiesProps {
  pageSaved: number;
  nextCurrentStep: number;
  stepToMarkComplete: number;
  isUnit?: boolean;
}

const Amenities = ({
  pageSaved = 4,
  nextCurrentStep = 5,
  stepToMarkComplete = 4,
  isUnit = false,
}: AmenitiesProps) => {
  const [newTag, setNewTag] = useState<string>("");
  const [dynamicSchema, setDynamicSchema] = useState<any>(null);
  const [customAmenityError, setCustomAmenityError] = useState<string>("");
  const searchParams = useSearchParams();

  const params = useParams();

  const paramPropertyType = params.propertyType as string;

  const {
    selectedPropertyType,
    getStepData,
    updateStepData,
    updateUnitStepData,
    setCurrentStep,
    setCurrentUnitStep,
    markStepCompleted,
    markUnitStepCompleted,
    currentStep,
    currentUnitStep,
    getUnitStepData,
    editingPropertyId,
  } = usePropertyStore();

  const router = useRouter();

  const propertyType = selectedPropertyType || paramPropertyType;

  const { data, isPending } = useGetAmenities(propertyType!);

  const searchedUnitId = searchParams.get("unitId");

  const { mutate: addAmenities, isPending: isSubmitting } = useAddAmenities();

  // Get property ID - prioritize editingPropertyId, then store data
  const storePropertyId = getStepData("propertyInfo")?.id;
  const propertyId = editingPropertyId || storePropertyId;
  const unitId = isUnit
    ? getUnitStepData("unitInfo")?.id
    : searchedUnitId
      ? searchedUnitId
      : undefined;

  // Fetch property details when we have a property ID
  const { data: propertyDetailResponse, isLoading: isLoadingPropertyDetail } =
    useGetPropertyDetail(propertyId || 0);

  // Extract amenities details from property detail response
  const propertyData = propertyDetailResponse?.data;
  const allUnits = (propertyData as any)?.units || [];
  const currentUnitData = unitId
    ? allUnits.find((unit: any) => unit.detail.id === parseInt(unitId as any))
    : null;

  const apiAmenitiesDetails = isUnit
    ? currentUnitData?.amenities
    : propertyData?.amenities;

  const laundryAmenity = data?.data?.find(
    (item: any) => item.amenity === "Laundry Facilities"
  );
  const firstLaundrySubAmenity = laundryAmenity?.sub_amenities?.[0];

  useEffect(() => {
    if (firstLaundrySubAmenity) {
      form.setValue("laundary", firstLaundrySubAmenity?.id?.toString());
    }
  }, [data]);

  const createDefaultValues = (
    amenitiesData: any[],
    storeData?: AmenitiesFormData
  ) => {
    const defaults: Record<string, any> = {};
    amenitiesData.forEach((item) => {
      const fieldName = item.amenity.toLowerCase().replace(/\s+/g, "");
      if (item.amenity === "Laundry Facilities") {
        const laundryStoreKey = Object.keys(storeData || {}).find((key) =>
          key.toLowerCase().includes("laundry")
        );
        const storeValue =
          laundryStoreKey && Array.isArray(storeData?.[laundryStoreKey])
            ? (
                storeData[laundryStoreKey] as Array<{
                  id: number;
                  name: string;
                }>
              )[0]?.id?.toString()
            : undefined;
        defaults[fieldName] =
          storeValue || item.sub_amenities?.[0]?.id?.toString() || "";
      } else {
        const matchingStoreKey = Object.keys(storeData || {}).find((key) => {
          const normalizedKey = key.toLowerCase().replace(/[_\s]/g, "");
          const normalizedFieldName = fieldName
            .toLowerCase()
            .replace(/[_\s]/g, "");

          return normalizedKey === normalizedFieldName;
        });
        if (matchingStoreKey && Array.isArray(storeData?.[matchingStoreKey])) {
          const storeValues = storeData[matchingStoreKey] as Array<{
            id: number;
            name: string;
          }>;
          defaults[fieldName] = storeValues.map((item) => item.id.toString());
        } else {
          defaults[fieldName] = [];
        }
      }
    });
    // Always initialize other_amenities to an empty array
    defaults.other_amenities = [];

    if (storeData && storeData?.other_amenities) {
      defaults.other_amenities =
        storeData?.other_amenities?.length > 0
          ? storeData?.other_amenities
              ?.flatMap((item) => item)
              ?.filter(
                (item) => item !== null && item !== undefined && item !== ""
              )
          : [];
    }

    return defaults;
  };
  const form = useForm({
    resolver: dynamicSchema ? zodResolver(dynamicSchema) : undefined,
    defaultValues: data?.data
      ? createDefaultValues(
          data.data,
          isUnit ? getUnitStepData("amenities") : getStepData("amenities")
        )
      : { other_amenities: [] }, // Always ensure other_amenities is an empty array
  });

  // Update form and store when property details are loaded
  useEffect(() => {
    if (apiAmenitiesDetails && data?.data && propertyId) {
      // Convert API amenities data to store format (following existing pattern)
      const amenitiesStoreData: AmenitiesFormData = {
        other_amenities: Array.isArray(apiAmenitiesDetails.other_amenities)
          ? apiAmenitiesDetails.other_amenities
              .flat() // Flatten if nested array
              .filter(
                (item: any) =>
                  item !== null && item !== undefined && item !== ""
              ) // Remove null/undefined/empty values
          : [],
        ...Object.keys(apiAmenitiesDetails).reduce(
          (acc, key) => {
            if (key !== "other_amenities") {
              acc[key] = apiAmenitiesDetails[key];
            }

            return acc;
          },
          {} as Record<string, any>
        ),
      } as AmenitiesFormData;

      // Update the store with API response data
      if (isUnit) {
        updateUnitStepData("amenities", amenitiesStoreData);
      } else {
        updateStepData("amenities", amenitiesStoreData);
      }

      // Create form values from API data
      const schema = createAmenitiesSchema(data.data);
      setDynamicSchema(schema);
      const defaultValues = createDefaultValues(data.data, amenitiesStoreData);
      form?.reset(defaultValues);
    }
  }, [
    apiAmenitiesDetails,
    data?.data,
    propertyId,
    isUnit,
    updateUnitStepData,
    updateStepData,
    form,
  ]);

  // Also handle store data and schema setup for cases where we're navigating between steps
  useEffect(() => {
    if (data?.data && !isLoadingPropertyDetail) {
      const schema = createAmenitiesSchema(data.data);
      setDynamicSchema(schema);

      // Use store data if we don't have API data
      if (!apiAmenitiesDetails) {
        const existingStoreData = isUnit
          ? getUnitStepData("amenities")
          : getStepData("amenities");
        const defaultValues = createDefaultValues(data.data, existingStoreData);
        form?.reset(defaultValues);
      }
    }
  }, [
    data,
    isUnit,
    apiAmenitiesDetails,
    isLoadingPropertyDetail,
    form,
    getUnitStepData,
    getStepData,
  ]);

  // Cleanup effect to remove null/undefined values from other_amenities
  useEffect(() => {
    const currentAmenities = form.getValues("other_amenities") || [];
    const cleanedAmenities = currentAmenities.filter(
      (item: any) => item !== null && item !== undefined && item !== ""
    );
    if (cleanedAmenities.length !== currentAmenities.length) {
      form.setValue("other_amenities", cleanedAmenities);
    }
  }, [form, data]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();

      // Clear previous errors
      setCustomAmenityError("");

      // Check character length
      if (newTag.trim().length > 100) {
        setCustomAmenityError("Custom amenity cannot exceed 10 characters");

        return;
      }

      if (newTag.trim().length < 1) {
        setCustomAmenityError("Custom amenity cannot be empty");

        return;
      }

      // Check regex pattern
      const validPattern = /^[a-zA-Z0-9\s-]+$/;
      if (!validPattern.test(newTag.trim())) {
        setCustomAmenityError(
          "Custom amenity contains invalid characters. Only letters, numbers, spaces, and hyphens are allowed"
        );

        return;
      }

      const currentTags = form.getValues("other_amenities") || [];
      if (currentTags.length >= 5) {
        setCustomAmenityError("Maximum 5 custom amenities allowed");

        return;
      }

      // Check for duplicates
      if (currentTags.includes(newTag.trim())) {
        setCustomAmenityError("This custom amenity already exists");

        return;
      }

      form.setValue("other_amenities", [...currentTags, newTag.trim()]);
      setNewTag("");
      setCustomAmenityError("");
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Clear error when user starts typing
    if (customAmenityError) {
      setCustomAmenityError("");
    }

    // Allow typing but show error if exceeding limit
    setNewTag(value);

    if (value.length > 100) {
      setCustomAmenityError("Maximum 100 characters allowed");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("other_amenities") || [];
    const newTags = currentTags.filter((_: string, i: number) => i !== index);
    form.setValue("other_amenities", newTags);
  };

  const handleCheckboxToggle = (amenityName: string, id: string) => {
    const fieldName = amenityName.toLowerCase().replace(/\s+/g, "");
    const currentValues = form.getValues(fieldName) || [];
    const updatedValues = currentValues.includes(id)
      ? currentValues.filter((item: string) => item !== id)
      : [...currentValues, id];
    form.setValue(fieldName, updatedValues, { shouldDirty: true });
  };

  const onSubmit = async (isSaveExit: boolean, formData: any) => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    const { other_amenities, ...categorizedAmenities } = formData;
    const sub_amenities: number[] = [];
    Object.entries(categorizedAmenities).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        sub_amenities.push(...value.map((id: string) => Number(id)));
      } else if (value) {
        sub_amenities.push(Number(value));
      }
    });
    // Create the final payload
    const payload = {
      property_id: propertyId!,
      unit_id: unitId,
      sub_amenities,
      other_amenities: other_amenities || [],
      page_saved: pageSaved,
    };

    const mutationOptions = {
      onSuccess: (response: any) => {
        // Store the API response data in the store
        const responseData = response?.data || response;
        const storeData: AmenitiesFormData = {
          other_amenities: responseData.other_amenities || [],
          ...Object.keys(responseData).reduce(
            (acc, key) => {
              if (key !== "other_amenities") {
                acc[key] = responseData[key];
              }

              return acc;
            },
            {} as Record<string, any>
          ),
          // Store raw API response for reference
          apiResponse: responseData,
        } as AmenitiesFormData;

        if (isUnit) {
          updateUnitStepData("amenities", storeData);
        } else {
          updateStepData("amenities", storeData);
        }

        if (isSaveExit) {
          router.push("/my-properties");
        } else {
          if (isUnit) {
            markUnitStepCompleted(stepToMarkComplete);
            setCurrentUnitStep(nextCurrentStep);
          } else {
            markStepCompleted(stepToMarkComplete);
            setCurrentStep(nextCurrentStep);
          }
        }
      },
    };

    // Always use create endpoint - backend handles both creation and updates
    addAmenities(payload, mutationOptions);
  };

  if (isPending) return <AmenitiesLoader />;

  return (
    <div className="w-full mx-auto p-6 bg-white">
      <h1 className="text-lg font-semibold mb-8 text-gray-900">Amenities</h1>

      {/* Loading state */}
      {isLoadingPropertyDetail && propertyId && (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-600">
            Loading amenities details...
          </div>
        </div>
      )}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(false, data))}
          className="space-y-5"
        >
          {data?.data?.map((item) => (
            <div key={item.amenity} className="space-y-3">
              <h2 className="text-base font-medium text-gray-900">
                {item.amenity}
              </h2>
              {item.amenity === "Laundry Facilities" ? (
                <CustomRadioGroup
                  name={item.amenity.toLowerCase().replace(/\s+/g, "")}
                  label=""
                  options={item?.sub_amenities?.map((sub_item) => ({
                    label: sub_item?.sub_amenity,
                    value: sub_item?.id.toString(),
                  }))}
                />
              ) : (
                <div className="flex flex-wrap gap-3">
                  {item?.sub_amenities?.map((sub_item) => {
                    const fieldName = item.amenity
                      .toLowerCase()
                      .replace(/\s+/g, "");

                    return (
                      <div
                        key={sub_item.id}
                        onClick={() =>
                          handleCheckboxToggle(
                            item.amenity,
                            sub_item.id.toString()
                          )
                        }
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-colors",
                          "bg-white border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        <CustomCheckbox
                          name={fieldName}
                          value={sub_item.id.toString()}
                          stopPropagation
                        />
                        <span className="text-sm">{sub_item.sub_amenity}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {/* Custom Amenities Section */}
          <FormField
            control={form.control}
            name="other_amenities"
            render={({ field, fieldState }) => (
              <div className="space-y-4">
                <Label className="block text-base font-medium text-gray-900">
                  Custom Amenities:
                </Label>
                <div className="relative">
                  <input
                    type="text"
                    value={newTag}
                    onChange={handleTagInputChange}
                    onKeyDown={handleAddTag}
                    placeholder="Example: Game Area"
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                      customAmenityError ? "border-red-500" : "border-gray-300",
                      newTag.length > 10 ? "border-red-500" : ""
                    )}
                  />
                  <div
                    className={cn(
                      "absolute right-3 top-2 text-xs",
                      newTag.length > 10 ? "text-red-500" : "text-gray-400"
                    )}
                  >
                    {newTag.length}/10
                  </div>
                </div>

                {/* Custom error message */}
                {customAmenityError && (
                  <p className="text-xs text-red-500 mt-1">
                    {customAmenityError}
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  Type and press Enter to add. Maximum 100 characters and 5
                  custom amenities allowed.
                </p>

                {/* Form validation error */}
                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
                {(form.watch("other_amenities") || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.watch("other_amenities") || []).map(
                      (tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-secondary-500 text-white"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-2 hover:bg-secondary-600 p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          />
          {/* Buttons Row */}
          <div className="flex justify-between mt-6 w-full">
            <Button
              type="button"
              className="lg:px-6 px-3 py-2  bg-white hover:bg-gray-100  text-gray-900 border border-gray-200 rounded-md font-semibold"
              onClick={() =>
                isUnit
                  ? setCurrentUnitStep(currentUnitStep - 1)
                  : setCurrentStep(currentStep - 1)
              }
            >
              Back
            </Button>
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={form.handleSubmit((data) => onSubmit(true, data))}
                disabled={isSubmitting}
                className="lg:px-6 px-3 py-2 bg-white  hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-md font-semibold"
              >
                Save & Exit
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="lg:px-6 px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Next"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Amenities;
