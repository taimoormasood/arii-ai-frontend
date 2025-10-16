import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import GreenImageFileIcon from "@/assets/icons/green-image-file-icon";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { base64ToFile, convertFilesToBase64 } from "@/helpers";
import {
  useAddUnit,
  useGetPropertyDetail,
  useUpdateUnit,
} from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import { cn } from "@/lib/utils";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Define the schema
const unitSchema = z.object({
  roomNumber: z.coerce
    .number({
      required_error: "Room number is required",
      invalid_type_error: "Only numbers are allowed.",
    })
    .min(1, "Room number is required")
    .refine((val) => val.toString().length <= 20, {
      message: "Room number must not exceed 20 digits",
    }),
  roomType: z.string().min(1, "Room type is required"),
  floorNumber: z.coerce
    .number({ invalid_type_error: "Only numbers are allowed." })
    .optional(),
  roomSize: z.coerce
    .number({ invalid_type_error: "Only numbers are allowed." })
    .optional(),
  beds: z.coerce
    .number({
      required_error: "Total number of beds is required.",
      invalid_type_error: "Only numbers are allowed.",
    })
    .int("Beds must be a whole number.")
    .min(1, "Beds must be between 1 and 10.")
    .max(10, "Beds must be between 1 and 10."),
  desks: z.coerce
    .number({
      required_error: "Total number of desks is required.",
      invalid_type_error: "Only numbers are allowed.",
    })
    .int("Total desks must be a whole number.")
    .min(1)
    .max(10, "Desks must be between 1 and 10."),
  unitPhotos: z
    .array(
      z
        .instanceof(File, { message: "Expected a file" })
        .refine((file) => file.size <= MAX_IMAGE_SIZE, {
          message: "Each file must be under 5MB",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
          message: "Only JPG, JPEG, or PNG files are allowed",
        })
    )
    .optional(),
});

const roomTypeOptions = [
  { value: "private", label: "Private" },
  { value: "shared", label: "Shared" },
  { value: "double_occupancy", label: "Double Occupancy" },
  { value: "triple_occupancy", label: "Triple Occupancy" },
  { value: "studio", label: "Studio" },
];
// Create a TypeScript type from the schema
type UnitFormValues = z.infer<typeof unitSchema>;

const RoomDetails = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [existingPhotoIds, setExistingPhotoIds] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const { propertyType } = useParams() as { propertyType?: string };
  const searchParams = useSearchParams();
  const searchedUnitId = searchParams.get("unitId");

  const router = useRouter();

  const {
    getStepData,
    getUnitStepData,
    markUnitStepCompleted,
    setCurrentUnitStep,
    updateUnitStepData,
    isEditMode,
    editingPropertyId,
  } = usePropertyStore();

  const unitId = getUnitStepData("unitInfo")?.id || searchedUnitId;

  const { mutate: addUnit, isPending: isAddingUnit } = useAddUnit();
  const { mutate: updateUnit, isPending: isUpdatingUnit } = useUpdateUnit();

  const isSubmitting = isAddingUnit || isUpdatingUnit;

  const propertyInfoData = getStepData("propertyInfo");
  const unitInfoFormData = getUnitStepData("unitInfo");

  // Get property ID - prioritize editingPropertyId, then store data
  const storePropertyId = propertyInfoData?.id;
  const propertyId = editingPropertyId || storePropertyId;

  // Fetch property details when we have a property ID (for edit mode)
  const { data: propertyDetailResponse, isLoading: isLoadingPropertyDetail } =
    useGetPropertyDetail(propertyId || 0);

  // Extract property data and find the specific unit
  const propertyData = propertyDetailResponse?.data;
  const allUnits = (propertyData as any)?.units || [];
  const currentUnitData = unitId
    ? allUnits.find((unit: any) => unit.detail.id === parseInt(unitId as any))
    : null;

  // Check if we have existing unit data from API
  const hasExistingUnitData =
    currentUnitData &&
    currentUnitData.detail &&
    (currentUnitData.detail.number ||
      currentUnitData.detail.type ||
      (currentUnitData.detail.photos &&
        currentUnitData.detail.photos.length > 0));

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    mode: "onChange",
    defaultValues: {
      roomNumber: unitInfoFormData?.number
        ? Number(unitInfoFormData.number)
        : undefined,
      roomType: unitInfoFormData?.type || "",
      floorNumber: unitInfoFormData?.floorNumber
        ? Number(unitInfoFormData.floorNumber)
        : undefined,
      roomSize: unitInfoFormData?.size
        ? Number(unitInfoFormData.size)
        : undefined,
      beds: unitInfoFormData?.bedrooms
        ? Number(unitInfoFormData.bedrooms)
        : undefined,
      desks: unitInfoFormData?.bathrooms
        ? Number(unitInfoFormData.bathrooms)
        : undefined,
      unitPhotos: unitInfoFormData?.unitPhotos?.map((item) => item) || [],
    },
  });

  // Update form and store when unit details are loaded from API
  useEffect(() => {
    if (currentUnitData && propertyId && unitId) {
      const unitDetail = currentUnitData.detail;

      // Extract photo URLs and IDs
      const existingPhotoUrls =
        unitDetail.photos?.map((photo: any) => photo.photo) || [];
      const existingPhotoIds =
        unitDetail.photos?.map((photo: any) => photo.id) || [];

      // Prepare the data to store
      const unitStoreData = {
        id: unitDetail.id,
        number: unitDetail.number || "",
        type: unitDetail.type || "",
        floorNumber: unitDetail.floor_number || "",
        size: unitDetail.size || "",
        beds: unitDetail.bedrooms || 1,
        desks: unitDetail.bathrooms || 1,
        unitPhotos: [], // New photos to be uploaded
        unitPhotosBase64: [], // New photos as base64
        existingPhotoUrls: existingPhotoUrls, // Store existing photo URLs for display
        existingPhotoIds: existingPhotoIds, // Store existing photo IDs for API
        // Store raw API response for reference
        apiResponse: currentUnitData,
      } as any;

      // Update the store with API response data
      updateUnitStepData("unitInfo", unitStoreData);

      // Update form with the data
      form.reset({
        roomNumber: parseInt(unitDetail.number) || 0,
        roomType: unitDetail.type || "",
        floorNumber: unitDetail.floor_number
          ? parseInt(unitDetail.floor_number)
          : undefined,
        roomSize: unitDetail.size ? parseInt(unitDetail.size) : undefined,
        beds: parseInt(unitDetail.beds) || 1,
        desks: parseInt(unitDetail.desks) || 1,
        unitPhotos: [],
      });

      // Set existing photos for display
      setExistingPhotos(existingPhotoUrls);
      setExistingPhotoIds(existingPhotoIds);
      setFilePreviews(existingPhotoUrls);
    }
  }, [currentUnitData, propertyId, unitId, form, updateUnitStepData]);

  // Also handle store data for cases where we're navigating between steps
  useEffect(() => {
    if (unitInfoFormData && !isLoadingPropertyDetail) {
      // Only use store data if we don't have fresh API data
      if (!hasExistingUnitData) {
        form.reset({
          roomNumber: unitInfoFormData.number
            ? Number(unitInfoFormData.number)
            : 0,
          roomType: unitInfoFormData?.type || "",
          floorNumber: unitInfoFormData?.floorNumber
            ? Number(unitInfoFormData.floorNumber)
            : undefined,
          roomSize: unitInfoFormData?.size
            ? Number(unitInfoFormData.size)
            : undefined,
          beds: unitInfoFormData?.beds ? Number(unitInfoFormData.beds) : 1,
          desks: unitInfoFormData?.desks ? Number(unitInfoFormData.desks) : 1,
          unitPhotos: Array.isArray(unitInfoFormData.unitPhotos)
            ? unitInfoFormData.unitPhotos.filter((file) => file instanceof File)
            : [],
        });

        // Set existing photos if available from store
        if (unitInfoFormData.existingPhotoUrls) {
          setExistingPhotos(unitInfoFormData.existingPhotoUrls);
          setFilePreviews(unitInfoFormData.existingPhotoUrls);
        }
        if (unitInfoFormData.existingPhotoIds) {
          setExistingPhotoIds(unitInfoFormData.existingPhotoIds);
        }

        // Handle base64 photos from store for navigation between steps
        if (unitInfoFormData?.unitPhotosBase64?.length) {
          const previews = unitInfoFormData.unitPhotosBase64;
          setFilePreviews((prev) => [...prev, ...previews]);

          const reconstructedFiles = previews.map((base64, i) =>
            base64ToFile(base64, `image_${i}.jpeg`, "image/jpeg")
          );

          form.setValue("unitPhotos", reconstructedFiles, {
            shouldValidate: true,
          });
        }
      }
    }
  }, [unitInfoFormData, form, hasExistingUnitData, isLoadingPropertyDetail]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, []);

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current) {
      // Clear the file input value to prevent previous file references
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }, []);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        form.setValue("unitPhotos", [], { shouldValidate: true });

        return;
      }

      const newFiles = Array.from(files);
      setUploadError(null);

      const validFiles = newFiles.filter((file) => {
        if (!(file instanceof File)) return false;
        if (file.size > MAX_IMAGE_SIZE) {
          setUploadError(`File ${file.name} exceeds the 5MB size limit.`);

          return false;
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          setUploadError(
            `File ${file.name} has an unsupported format. Only JPG, JPEG, or PNG are allowed.`
          );

          return false;
        }

        return true;
      });

      if (validFiles.length === 0) {
        form.setValue("unitPhotos", [], { shouldValidate: true });

        return;
      }

      // Create new array with existing files and new valid files
      const currentFiles = form.getValues("unitPhotos") || [];
      const updatedFiles = [...currentFiles, ...validFiles];

      // Update form state
      form.setValue("unitPhotos", updatedFiles, { shouldValidate: true });

      // Create previews only for new files
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    },
    [form]
  );

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    setExistingPhotoIds((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    const existingCount = existingPhotos.length;
    const newFileIndex = index - existingCount;

    const currentFiles = form.getValues("unitPhotos") || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== newFileIndex);
    form.setValue("unitPhotos", updatedFiles, { shouldValidate: true });

    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadError(null);
  };

  const removeFile = (index: number) => {
    const existingCount = existingPhotos.length;

    if (index < existingCount) {
      // Remove existing photo
      removeExistingPhoto(index);
    } else {
      // Remove new file
      removeNewFile(index);
    }
  };

  const onSubmit = async (isSaveExit: boolean, data: UnitFormValues) => {
    // Check if at least one photo exists (either existing or new)
    const hasExistingPhotos = existingPhotos.length > 0;
    const hasUploadedPhotos = data.unitPhotos && data.unitPhotos.length > 0;
    const hasAnyPhotos = hasExistingPhotos || hasUploadedPhotos;

    // If we have existing photos, clear the unitPhotos error before validation
    if (hasExistingPhotos) {
      form.clearErrors("unitPhotos");
    }

    // Run form validation but skip the unitPhotos check if we have existing photos
    let isValid = true;
    if (hasExistingPhotos) {
      // Validate all fields except unitPhotos
      const allFields = Object.keys(
        form.getValues()
      ) as (keyof UnitFormValues)[];
      const fieldsToValidate = allFields.filter(
        (field) => field !== "unitPhotos"
      );
      isValid = await form.trigger(fieldsToValidate as any);
    } else {
      // Validate all fields including unitPhotos
      isValid = await form.trigger();
    }

    if (!isValid) {
      return;
    }

    if (!hasAnyPhotos) {
      form.setError("unitPhotos", {
        type: "manual",
        message: "At least one unit photo is required.",
      });

      return;
    }

    let photosToSubmit: File[] = [];

    if (data.unitPhotos && data.unitPhotos.length > 0) {
      photosToSubmit = data.unitPhotos;
    } else if (unitInfoFormData?.unitPhotosBase64?.length) {
      photosToSubmit = unitInfoFormData.unitPhotosBase64.map((base64, i) =>
        base64ToFile(base64, `image_${i}.jpeg`, "image/jpeg")
      );
    }

    // Build payload
    const payload: any = {
      property: propertyId,
      number: String(data.roomNumber),
      type: data.roomType,
      floor_number: data.floorNumber ? String(data.floorNumber) : undefined,
      size: data.roomSize ? String(data.roomSize) : undefined,
      beds: data.beds !== undefined ? String(data.beds) : undefined,
      desks: data.desks !== undefined ? String(data.desks) : undefined,
      page_saved: 1,
    };

    // Handle photo field - send new photos and existing photo IDs
    const hasNewPhotos = data.unitPhotos && data.unitPhotos.length > 0;
    const hasExistingPhotoIds = existingPhotoIds.length > 0;

    if (hasNewPhotos) {
      payload.photo = data.unitPhotos!.map((file) => file);
    }

    // For update scenarios, send existing photo IDs
    if (hasExistingUnitData && hasExistingPhotoIds) {
      payload.existing_photos = existingPhotoIds;
    }

    const base64Photos = await convertFilesToBase64(data.unitPhotos || []);

    const mutationOptions = {
      onSuccess: (response: any) => {
        // Store the API response data in the store
        const responseData = response?.data || response;

        const unitData = {
          id: response?.id || parseInt(unitId as any),
          number: response?.number,
          type: response?.type,
          floorNumber: response?.floor_number,
          size: response?.size,
          beds: response?.beds,
          desks: response?.desks,
          unitPhotos: [], // Reset new photos after successful upload
          unitPhotosBase64: base64Photos,
          // Store existing photos
          existingPhotoUrls: existingPhotos,
          existingPhotoIds: existingPhotoIds,
          apiResponse: responseData, // Store the API response
        };

        updateUnitStepData("unitInfo", unitData);

        if (isSaveExit) {
          router.push("/my-properties");
        } else {
          markUnitStepCompleted(1);
          setCurrentUnitStep(2);
        }
      },
      
    };

    // Determine whether to call create or update API
    if (hasExistingUnitData) {
      updateUnit(
        { ...payload, unitId: parseInt(unitId! as any) },
        mutationOptions
      );
    } else {
      addUnit(payload, mutationOptions);
    }
  };

  // Show loading state while fetching property details for edit mode
  if (isLoadingPropertyDetail && unitId) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm mx-auto w-full">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading room info...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mx-auto w-full">
      <div className="flex items-center mb-6">
        <h1 className="md:text-2xl text-lg font-semibold text-gray-900">
          {isEditMode && unitId ? "Edit Room Info" : "Room Info"}
        </h1>
      </div>
      <FormProvider {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((data) => onSubmit(false, data))}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="roomNumber"
              label="Room Number"
              required
              placeholder="Room Number"
            />
            <CustomInput
              name="roomType"
              label="Room Type"
              required
              placeholder="Select room type"
              select
              options={roomTypeOptions}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="floorNumber"
              label="Floor Number"
              placeholder="Floor Number"
            />
            <CustomInput
              name="roomSize"
              label="Room Size"
              placeholder="Room Size"
              suffix="sq.ft"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="beds"
              label="Total Beds"
              required
              placeholder="Total Beds"
            />
            <CustomInput
              name="desks"
              label="Total Desks"
              required
              placeholder="Total Desks"
            />
          </div>

          {/* Property Photos */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="unitPhotos"
              render={({ fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Room photos <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      <div className="space-y-2">
                        <div
                          ref={dropAreaRef}
                          className={cn(
                            "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
                            isDragging
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-300 hover:border-gray-400"
                          )}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={handleBrowseClick}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/jpeg, image/jpg, image/png"
                            multiple
                            onChange={(e) => handleFileSelect(e.target.files)}
                          />
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-full">
                              <GreenImageFileIcon />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Drag and drop your photos here, or{" "}
                                <span className="text-primary font-medium">
                                  browse
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                JPG, JPEG, PNG • Max 5MB per file
                              </p>
                            </div>
                          </div>
                        </div>

                        {uploadError && (
                          <div className="text-sm text-red-500 mt-2">
                            {uploadError}
                          </div>
                        )}
                      </div>

                      {/* Image Previews */}
                      {(existingPhotos.length > 0 ||
                        filePreviews.length > existingPhotos.length) && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {/* Existing photos from edit mode */}
                          {existingPhotos.map((photoUrl, index) => (
                            <div key={`existing-${index}`} className="relative">
                              <img
                                src={photoUrl || "/placeholder.svg"}
                                alt={`Existing photo ${index}`}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingPhoto(index)}
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                              >
                                <X className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          ))}

                          {/* New file previews */}
                          {filePreviews
                            .slice(existingPhotos.length)
                            .map((preview, index) => (
                              <div key={`new-${index}`} className="relative">
                                <img
                                  src={preview || "/placeholder.svg"}
                                  alt={`Preview ${index}`}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeNewFile(index + existingPhotos.length)
                                  }
                                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                                >
                                  <X className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage className="text-red-500 text-sm font-normal">
                      {fieldState.error.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4 justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 px-3"
              onClick={form.handleSubmit((data) => onSubmit(true, data))}
            >
              Save & Exit
            </Button>

            <Button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Next"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default RoomDetails;
