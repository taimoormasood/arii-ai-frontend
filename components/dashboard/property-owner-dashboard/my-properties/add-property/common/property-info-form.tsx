"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import { useAddPropertyInfo } from "@/hooks/api/use-properties";
import { useGooglePlacesAutocomplete } from "@/hooks/use-google-places-autocomplete";
import { GoogleMapsScript } from "@/lib/google-maps";
import { usePropertyStore } from "@/lib/stores/use-property-store";

import AddressDetailsModal from "../property-types/common/address-details-modal";
import { propertyInfoSchema } from "./schema";

type PropertyInfoFormValues = z.infer<typeof propertyInfoSchema>;
function PropertyInfoFormContent({
  isLoaded,
  loadError,
  pageSaved,
  nextCurrentStep,
  stepToMarkComplete,
}: {
  isLoaded: boolean;
  loadError: Error | undefined;
  pageSaved: number;
  nextCurrentStep: number;
  stepToMarkComplete: number;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate, isPending: isSubmitting } = useAddPropertyInfo();
  const {
    selectedPropertyType,
    setCurrentStep,
    markStepCompleted,
    updateStepData,
    getStepData,
    isEditMode,
    editingPropertyId,
  } = usePropertyStore();
  const propertyInfoData = getStepData("propertyInfo");
  const methods = useForm<PropertyInfoFormValues>({
    resolver: zodResolver(propertyInfoSchema),
    mode: "onChange",
    defaultValues: {
      propertyName: propertyInfoData?.propertyName || "",
      state: propertyInfoData?.state || "",
      city: propertyInfoData?.city || "",
      streetAddress: propertyInfoData?.streetAddress || "",
      zipCode: propertyInfoData?.zipCode || "",
    },
  });
  const { autocompleteRef, formattedAddress, mapLocation } =
    useGooglePlacesAutocomplete({
      form: methods,
      isLoaded,
    });
  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      setDialogOpen(true);
    }
  };

  const onSubmit = async (
    isSaveExit: boolean,
    data: PropertyInfoFormValues
  ) => {
    const isValid = await methods.trigger();
    if (!isValid) {
      return;
    }

    const payload = {
      ...(isEditMode && editingPropertyId && { id: editingPropertyId }),
      name: data.propertyName,
      property_type: selectedPropertyType,
      state: data.state,
      city: data.city,
      street_address: data.streetAddress,
      zip_code: data.zipCode || undefined,
      page_saved: pageSaved,
    };
    mutate(payload, {
      onSuccess: (data) => {
        if (isSaveExit) {
          router.push("/my-properties");

          return;
        } else {
          updateStepData("propertyInfo", {
            id: isEditMode ? editingPropertyId! : data.id,
            propertyName: data.name,
            state: data.state,
            city: data.city,
            streetAddress: data.street_address,
            zipCode: data.zip_code,
          });
          setDialogOpen(false);
          markStepCompleted(stepToMarkComplete);
          setCurrentStep(nextCurrentStep);
        }
      },
    });
  };

  if (loadError) {
    return <div>Error loading Google Maps: {loadError.message}</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mx-auto w-full">
      <AddressDetailsModal
        isOpen={dialogOpen}
        onConfirm={methods.handleSubmit((data) => onSubmit(false, data))}
        onClose={() => setDialogOpen(false)}
        isLoading={isSubmitting}
        mapLocation={mapLocation}
        formattedAddress={formattedAddress}
        propertyType={selectedPropertyType!}
      />
      {/* Header */}
      <div className="flex items-center mb-6">
        <h1 className="md:text-2xl text-lg font-semibold text-gray-900">
          Property Info
        </h1>
      </div>
      <FormProvider {...methods}>
        <form className="space-y-6">
          <CustomInput
            required
            name="propertyName"
            label="Property name"
            placeholder="Enter property name"
          />
          {/* Street Address with Google Places Autocomplete */}
          <div className="space-y-2">
            <label
              htmlFor="streetAddress"
              className="text-gray-700 text-sm font-medium"
            >
              Street address <span className="text-red-500">*</span>
            </label>
            <Controller
              name="streetAddress"
              control={methods.control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    ref={(e) => {
                      field.ref(e);
                      if (e) {
                        autocompleteRef.current = e;
                      }
                    }}
                    id="streetAddress"
                    placeholder="Enter street address"
                    className="flex h-10 bg-gray-50 disabled:bg-gray-400 w-full rounded-lg border border-gray-300 px-4 py-2 text-base ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 md:text-sm"
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    onBlur={field.onBlur}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
            {!isLoaded && (
              <p className="text-sm text-gray-500">Loading Google Maps...</p>
            )}
          </div>
          {/* State & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="state"
              label="State"
              required
              // disabled
              placeholder="State"
            />
            <CustomInput
              name="city"
              label="City"
              required
              placeholder="City"
              // disabled
            />
          </div>
          {/* Zip Code */}
          <div className="space-y-2">
            <CustomInput
              name="zipCode"
              label="Zip code (optional)"
              placeholder="Enter zip code"
              // disabled
            />
          </div>
          {/* Actions */}
          <div className="flex gap-4 pt-6 items-end justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={methods.handleSubmit((data) => onSubmit(true, data))}
              disabled={isSubmitting}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 px-3"
            >
              Save & Exit
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8"
              disabled={isSubmitting || !isLoaded}
            >
              {isSubmitting ? (
                <>
                  {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
                  Next...
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

interface PropertyInfoFormProps {
  pageSaved: number;
  nextCurrentStep: number;
  stepToMarkComplete: number;
}

export default function PropertyInfoForm({
  pageSaved,
  nextCurrentStep,
  stepToMarkComplete,
}: PropertyInfoFormProps) {
  return (
    <GoogleMapsScript>
      {({ isLoaded, loadError }) => (
        <PropertyInfoFormContent
          isLoaded={isLoaded}
          loadError={loadError}
          pageSaved={pageSaved}
          nextCurrentStep={nextCurrentStep}
          stepToMarkComplete={stepToMarkComplete}
        />
      )}
    </GoogleMapsScript>
  );
}
