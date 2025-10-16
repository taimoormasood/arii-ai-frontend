"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, FileImage, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import GreenImageFileIcon from "@/assets/icons/green-image-file-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import CustomInput from "@/components/ui/custom-input";
import CustomTextarea from "@/components/ui/custom-textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { timeToMinutes } from "@/helpers";
import {
  useAddListingInfo,
  useGetPropertyDetail,
  useUpdateListingInfo,
} from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import { cn } from "@/lib/utils";

import { timeOptions } from "../../common/constants";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// File schema for validation
const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    message: "Each file must be under 5MB.",
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only JPG, JPEG, or PNG files are allowed.",
  });

// Updated schema to include time-based availability
export const listingInfoSchema = z.object({
  listedBy: z.enum(
    ["owner_manager_not_live", "owner_manager_live", "agent_broker"],
    {
      required_error: "Please select who is listing the property.",
    }
  ),

  totalRooms: z.coerce
    .number({ required_error: "Total number of rooms is required." })
    .min(1, "Minimum 1 required.")
    .max(10, "Maximum 10 allowed."),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description must be at least 500 characters."),
  petsAllowed: z.boolean(),

  petTypes: z.array(z.string()).optional(),
  customPets: z
    .array(z.string().min(1, "Custom pet can't be empty"))
    .optional(),
  customTags: z
    .array(z.string().min(1, "Custom tag can't be empty"))
    .max(5, "You can add up to 5 custom tags."),
  // Updated availability to include time ranges
  availability: z
    .record(
      z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ]),
      z
        .object({
          startTime: z.string(),
          endTime: z.string(),
        })
        .superRefine((timeRange, ctx) => {
          const startMinutes = timeToMinutes(timeRange.startTime);
          const endMinutes = timeToMinutes(timeRange.endTime);

          if (endMinutes <= startMinutes) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "End time must be after start time",
            });
          }
        })
    )
    .refine((availability) => Object.keys(availability).length > 0, {
      message: "Please select at least one available day",
    }),
  availability_duration: z.number().min(1, "Please select a meeting duration."),
  propertyPhotos: z
    .array(z.union([fileSchema, z.string().url("Invalid image URL")]))
    .optional(), // Make optional to handle edit mode with existing photos
});

type FormValues = z.infer<typeof listingInfoSchema>;

const petOptions = [
  { id: "cats", name: "Cats" },
  { id: "dogs", name: "Dogs" },
  { id: "birds", name: "Birds" },
  { id: "reptiles", name: "Reptiles" },
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const durationOptions = [
  { label: "30 mins", value: 30 },
  { label: "1 Hour", value: 60 },
  { label: "1.5 Hour", value: 90 },
  { label: "2 Hours", value: 120 },
];

const ListingInfo = () => {
  const router = useRouter();
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [existingPhotoIds, setExistingPhotoIds] = useState<number[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [newCustomPet, setNewCustomPet] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const { mutate: addListingInfo, isPending: isAddingListing } =
    useAddListingInfo();
  const { mutate: updateListingInfo, isPending: isUpdatingListing } =
    useUpdateListingInfo();

  const {
    setCurrentStep,
    markStepCompleted,
    updateStepData,
    getStepData,
    hasStepData,
    isEditMode,
    editingPropertyId,
  } = usePropertyStore();

  const isSubmitting = isAddingListing || isUpdatingListing;

  // Get existing data
  const listingDetailsData = getStepData("listingDetails");
  const propertyInfoData = getStepData("propertyInfo");

  // Get property ID - prioritize editingPropertyId, then propertyInfoData.id
  const propertyId = editingPropertyId || propertyInfoData?.id;

  // Fetch property details when we have a property ID
  const { data: propertyDetailResponse, isLoading: isLoadingPropertyDetail } =
    useGetPropertyDetail(propertyId || 0);

  // Extract listing details from property detail response
  const propertyData = propertyDetailResponse?.data;
  const apiListingDetails = propertyData?.listing_info;

  // Check if we have existing listing data from API
  const hasExistingListingData =
    apiListingDetails &&
    (apiListingDetails.listed_by ||
      apiListingDetails.number_of_units ||
      apiListingDetails.description ||
      (apiListingDetails.photos && apiListingDetails.photos.length > 0));

  // Helper function to submit mutation
  const submitMutation = (payload: any, onSuccess: () => void) => {
    if (!propertyId) {
      return;
    }

    const finalPayload = {
      ...payload,
      property: propertyId as number,
    };

    const mutationOptions = {
      onSuccess,
    };

    // Determine whether to call create or update API
    // Call update if we have existing listing data from API, otherwise call create
    if (hasExistingListingData) {
      updateListingInfo(
        { ...finalPayload, propertyId: propertyId },
        mutationOptions
      );
    } else {
      addListingInfo(finalPayload, mutationOptions);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(listingInfoSchema),
    mode: "onChange",
    defaultValues: {
      listedBy: "owner_manager_not_live",
      totalRooms: 0,
      description: "",
      petsAllowed: false,
      petTypes: [],
      customTags: [],
      availability: {},
      availability_duration: 30,
      propertyPhotos: [],
    },
  });

  // Update form and store when property details are loaded
  useEffect(() => {
    if (apiListingDetails && propertyId) {
      // Parse showing_availability back to our format
      const parsedAvailability: Record<
        string,
        { startTime: string; endTime: string }
      > = {};

      if (apiListingDetails.showing_availability) {
        Object.entries(apiListingDetails.showing_availability).forEach(
          ([day, timeRange]) => {
            if (typeof timeRange === "string") {
              const [start, end] = timeRange.split("-");
              // Convert "9am" to "9:00 AM" format
              const formatApiTime = (time: string) => {
                const match = time.match(/^(\d{1,2})(am|pm)$/i);
                if (match) {
                  const [, hour, period] = match;

                  return `${hour}:00 ${period.toUpperCase()}`;
                }

                return time;
              };

              parsedAvailability[day] = {
                startTime: formatApiTime(start),
                endTime: formatApiTime(end),
              };
            }
          }
        );
      }

      // Extract photo URLs and IDs - check both listing_info and main property data
      const listingPhotos = apiListingDetails.photos || [];
      const propertyPhotos = propertyData?.photos || [];

      // Use photos from listing_info if available, otherwise use from main property data
      const photosToUse =
        listingPhotos.length > 0 ? listingPhotos : propertyPhotos;

      const existingPhotoUrls =
        photosToUse.map((photo: any) => photo.photo) || [];
      const existingPhotoIds = photosToUse.map((photo: any) => photo.id) || [];

      // Prepare the data to store
      const listingStoreData = {
        listedBy: apiListingDetails.listed_by || "owner_manager_not_live",
        totalRooms: apiListingDetails.number_of_units
          ? String(apiListingDetails.number_of_units)
          : "0",
        description: apiListingDetails.description || "",
        petsAllowed: apiListingDetails.pets_allowed || false,
        petTypes: apiListingDetails.pet_types || [],
        customTags: apiListingDetails.other_pets || [],
        availability: parsedAvailability,
        availability_duration: apiListingDetails.availability_duration || 30,
        propertyPhotos: [], // New photos to be uploaded
        existingPhotoUrls: existingPhotoUrls, // Store existing photo URLs for display
        existingPhotoIds: existingPhotoIds, // Store existing photo IDs for API
        // Store raw API response for reference
        apiResponse: apiListingDetails,
      } as any;

      // Update the store with API response data
      updateStepData("listingDetails", listingStoreData);

      // Update form with the data
      form.reset({
        listedBy: listingStoreData.listedBy as any,
        totalRooms: Number(listingStoreData.totalRooms),
        description: listingStoreData.description,
        petsAllowed: listingStoreData.petsAllowed,
        petTypes: listingStoreData.petTypes,
        customTags: listingStoreData.customTags,
        availability: listingStoreData.availability,
        availability_duration: listingStoreData.availability_duration,
        propertyPhotos: [],
      });

      // Set existing photos for display
      setExistingPhotos(existingPhotoUrls);
      setExistingPhotoIds(existingPhotoIds);
    }
  }, [apiListingDetails, propertyId, form, updateStepData, propertyData]);

  // Also handle store data for cases where we're navigating between steps
  useEffect(() => {
    if (listingDetailsData && !isLoadingPropertyDetail) {
      // Only use store data if we don't have fresh API data
      if (!hasExistingListingData) {
        form.reset({
          listedBy: listingDetailsData.listedBy || "owner_manager_not_live",
          totalRooms: listingDetailsData.totalRooms
            ? Number(listingDetailsData.totalRooms)
            : 0,
          description: listingDetailsData.description || "",
          petsAllowed: listingDetailsData.petsAllowed || false,
          petTypes: listingDetailsData.petTypes || [],
          customTags: listingDetailsData.customTags || [],
          availability: listingDetailsData.availability || {},
          availability_duration: listingDetailsData.availability_duration || 30,
          propertyPhotos: Array.isArray(listingDetailsData.propertyPhotos)
            ? listingDetailsData.propertyPhotos.filter(
                (file) => file instanceof File
              )
            : [],
        });

        // Set existing photos if available
        if (listingDetailsData.existingPhotoUrls) {
          setExistingPhotos(listingDetailsData.existingPhotoUrls);
        }
        if (listingDetailsData.existingPhotoIds) {
          setExistingPhotoIds(listingDetailsData.existingPhotoIds);
        }
      }
    }
  }, [
    listingDetailsData,
    form,
    hasExistingListingData,
    isLoadingPropertyDetail,
  ]);

  const onSubmit = async (isSaveExit: boolean, data: FormValues) => {
    // Check if at least one photo exists (either existing or new)
    const hasExistingPhotos = existingPhotos.length > 0;
    const hasUploadedPhotos =
      data.propertyPhotos && data.propertyPhotos.length > 0;
    const hasAnyPhotos = hasExistingPhotos || hasUploadedPhotos;

    // If we have existing photos, clear the propertyPhotos error before validation
    if (hasExistingPhotos) {
      form.clearErrors("propertyPhotos");
    }

    // Run form validation but skip the propertyPhotos check if we have existing photos
    let isValid = true;
    if (hasExistingPhotos) {
      // Validate all fields except propertyPhotos
      const allFields = Object.keys(form.getValues()) as (keyof FormValues)[];
      const fieldsToValidate = allFields.filter(
        (field) => field !== "propertyPhotos"
      );
      isValid = await form.trigger(fieldsToValidate as any);
    } else {
      // Validate all fields including propertyPhotos
      isValid = await form.trigger();
    }

    if (!isValid) {
      return;
    }

    if (!hasAnyPhotos) {
      form.setError("propertyPhotos", {
        type: "manual",
        message: "At least one property photo is required.",
      });

      return;
    }

    // Combine standard pet types with custom pets for backend
    const allPetTypes = [...(data.petTypes || []), ...(data.customPets || [])];

    // Convert availability object to the required format
    const showingAvailability: Record<string, string> = {};
    Object.entries(data.availability).forEach(([day, timeRange]) => {
      // Convert "9:00 AM" to "9am" format
      const formatTime = (time: string) => {
        return time.toLowerCase().replace(":00", "").replace(" ", "");
      };

      showingAvailability[day] =
        `${formatTime(timeRange.startTime)}-${formatTime(timeRange.endTime)}`;
    });

    if (!propertyId) {
      return;
    }

    // Build payload
    const payload: any = {
      property: propertyId as number,
      listed_by: data.listedBy,
      number_of_units: String(data.totalRooms),
      description: data.description,
      pets_allowed: data.petsAllowed,
      pet_types: allPetTypes,
      other_pets: data.customTags,
      availability_duration: data.availability_duration,
      showing_availability: showingAvailability,
      page_saved: 2,
    };

    // Handle photo field - send new photos and existing photo IDs
    const hasNewPhotos = data.propertyPhotos && data.propertyPhotos.length > 0;
    const hasExistingPhotoIds = existingPhotoIds.length > 0;

    if (hasNewPhotos) {
      payload.photo = data.propertyPhotos!.map((file) => file);
    }

    // For update scenarios, send existing photo IDs
    if (hasExistingListingData && hasExistingPhotoIds) {
      payload.existing_photos = existingPhotoIds;
    }

    const mutationOptions = {
      onSuccess: (response: any) => {
        // Store the API response data in the store
        const responseData = response?.data || response;

        // Prepare updated store data with API response
        const updatedStoreData = {
          listedBy: data.listedBy,
          totalRooms: String(data.totalRooms),
          description: data.description,
          petsAllowed: data.petsAllowed,
          petTypes: data.petTypes,
          customTags: data.customTags,
          availability: data.availability,
          availability_duration: data.availability_duration,
          propertyPhotos: [], // Reset new photos after successful upload
          existingPhotoUrls: existingPhotos, // Keep existing photos
          existingPhotoIds: existingPhotoIds, // Keep existing photo IDs
          apiResponse: responseData, // Store the API response
        };

        updateStepData("listingDetails", updatedStoreData);

        if (isSaveExit) {
          router.push("/my-properties");

          return;
        } else {
          markStepCompleted(2);
          setCurrentStep(3);
        }
      },
    };

    // Determine whether to call create or update API
    // Call update if we have existing listing data from API, otherwise call create
    if (hasExistingListingData) {
      updateListingInfo(
        { ...payload, propertyId: propertyId },
        mutationOptions
      );
    } else {
      addListingInfo(payload, mutationOptions);
    }
  };
  const handleSaveAndExit = async () => {
    const data = form.getValues();

    // Check if at least one photo exists (either existing or new)
    const hasExistingPhotos = existingPhotos.length > 0;
    const hasUploadedPhotos =
      data.propertyPhotos && data.propertyPhotos.length > 0;
    const hasAnyPhotos = hasExistingPhotos || hasUploadedPhotos;

    // If we have existing photos, clear the propertyPhotos error before validation
    if (hasExistingPhotos) {
      form.clearErrors("propertyPhotos");
    }

    // Run form validation but skip the propertyPhotos check if we have existing photos
    let isValid = true;
    if (hasExistingPhotos) {
      // Validate all fields except propertyPhotos
      const allFields = Object.keys(form.getValues()) as (keyof FormValues)[];
      const fieldsToValidate = allFields.filter(
        (field) => field !== "propertyPhotos"
      );
      isValid = await form.trigger(fieldsToValidate as any);
    } else {
      // Validate all fields including propertyPhotos
      isValid = await form.trigger();
    }

    if (!isValid) {
      return;
    }

    if (!hasAnyPhotos) {
      form.setError("propertyPhotos", {
        type: "manual",
        message: "At least one property photo is required.",
      });

      return;
    }

    // Combine standard pet types with custom pets for backend
    const allPetTypes = [...(data.petTypes || []), ...(data.customPets || [])];

    // Convert availability object to the required format
    const showingAvailability: Record<string, string> = {};
    Object.entries(data.availability).forEach(([day, timeRange]) => {
      // Convert "9:00 AM" to "9am" format
      const formatTime = (time: string) => {
        return time.toLowerCase().replace(":00", "").replace(" ", "");
      };

      showingAvailability[day] =
        `${formatTime(timeRange.startTime)}-${formatTime(timeRange.endTime)}`;
    });

    if (!propertyId) {
      return;
    }

    // Build payload
    const payload: any = {
      property: propertyId as number,
      listed_by: data.listedBy,
      number_of_units: String(data.totalRooms),
      description: data.description,
      pets_allowed: data.petsAllowed,
      pet_types: allPetTypes,
      other_pets: data.customTags,
      availability_duration: data.availability_duration,
      showing_availability: showingAvailability,
      page_saved: 2,
    };

    // Handle photo field - send new photos and existing photo IDs
    const hasNewPhotos = data.propertyPhotos && data.propertyPhotos.length > 0;
    const hasExistingPhotoIds = existingPhotoIds.length > 0;

    if (hasNewPhotos) {
      payload.photo = data.propertyPhotos!.map((file) => file);
    }

    // For update scenarios, send existing photo IDs
    if (hasExistingListingData && hasExistingPhotoIds) {
      payload.existing_photos = existingPhotoIds;
    }

    const mutationOptions = {
      onSuccess: (response: any) => {
        // Store the API response data in the store
        const responseData = response?.data || response;

        // Prepare updated store data with API response
        const updatedStoreData = {
          listedBy: data.listedBy,
          totalRooms: String(data.totalRooms),
          description: data.description,
          petsAllowed: data.petsAllowed,
          petTypes: data.petTypes,
          customTags: data.customTags,
          availability: data.availability,
          availability_duration: data.availability_duration,
          propertyPhotos: [], // Reset new photos after successful upload
          existingPhotoUrls: existingPhotos, // Keep existing photos
          existingPhotoIds: existingPhotoIds, // Keep existing photo IDs
          apiResponse: responseData, // Store the API response
        };

        updateStepData("listingDetails", updatedStoreData);

        router.push("/my-properties");
      },
    };

    // Determine whether to call create or update API
    // Call update if we have existing listing data from API, otherwise call create
    if (hasExistingListingData) {
      updateListingInfo(
        { ...payload, propertyId: propertyId },
        mutationOptions
      );
    } else {
      addListingInfo(payload, mutationOptions);
    }
  };

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
      if (!files || files.length === 0) return;

      const newFiles = Array.from(files);
      setUploadError(null);

      // Validate files before adding
      const validFiles = newFiles.filter((file) => {
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

      if (validFiles.length === 0) return;

      // Create new array with existing files and new valid files
      const currentFiles = form.getValues("propertyPhotos") || [];
      const updatedFiles = [...currentFiles, ...validFiles];

      // Update form state
      form.setValue("propertyPhotos", updatedFiles, { shouldValidate: true });

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
    setUploadError(null);
  };

  const removeNewFile = (index: number) => {
    const currentFiles = form.getValues("propertyPhotos") || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("propertyPhotos", updatedFiles, { shouldValidate: true });

    setFilePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);

      return newPreviews;
    });

    setUploadError(null);
  };

  const removeFile = (index: number) => {
    const currentFiles = form.getValues("propertyPhotos") || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("propertyPhotos", updatedFiles, { shouldValidate: true });

    setFilePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);

      return newPreviews;
    });

    setUploadError(null);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      const currentTags = form.getValues("customTags") || [];
      if (currentTags.length >= 5) return;

      form.setValue("customTags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("customTags");
    const updatedTags = currentTags.filter((_, i) => i !== index);
    form.setValue("customTags", updatedTags);
  };

  const handleAddCustomPet = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newCustomPet.trim()) {
      e.preventDefault();
      const currentCustomPets = form.getValues("customPets") || [];
      form.setValue("customPets", [...currentCustomPets, newCustomPet.trim()]);
      setNewCustomPet("");
    }
  };

  const removeCustomPet = (index: number) => {
    const currentCustomPets = form.getValues("customPets") || [];
    const updatedCustomPets = currentCustomPets.filter((_, i) => i !== index);
    form.setValue("customPets", updatedCustomPets);
  };

  const handlePetTypeToggle = (petType: string) => {
    const currentPetTypes = form.getValues("petTypes") || [];
    const isSelected = currentPetTypes.includes(petType);

    if (isSelected) {
      form.setValue(
        "petTypes",
        currentPetTypes.filter((type) => type !== petType)
      );
    } else {
      form.setValue("petTypes", [...currentPetTypes, petType]);
    }
  };

  const handleAvailabilityToggle = (day: string) => {
    const dayLower = day.toLowerCase() as keyof FormValues["availability"];
    const currentAvailability = form.getValues("availability");

    if (currentAvailability[dayLower]) {
      // Remove the day
      const newAvailability = { ...currentAvailability };
      delete newAvailability[dayLower];
      form.setValue("availability", newAvailability, { shouldValidate: true });
    } else {
      // Add the day with default times
      form.setValue(
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

  const handleTimeChange = (
    day: string,
    timeType: "startTime" | "endTime",
    value: string
  ) => {
    const dayLower = day.toLowerCase() as keyof FormValues["availability"];
    const currentAvailability = form.getValues("availability");

    if (currentAvailability[dayLower]) {
      form.setValue(
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
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mx-auto w-full">
      {/* Header */}
      <div className="flex items-center mb-6">
        <h1 className="md:text-2xl text-lg font-semibold text-gray-900">
          Listing Info
          {hasStepData("listingDetails") && (
            <span className="ml-2 text-primary-600 text-sm">✓ Completed</span>
          )}
        </h1>
      </div>

      {/* Loading state */}
      {isLoadingPropertyDetail && propertyId && (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-600">
            Loading property details...
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(false, data))}
          className="space-y-6"
        >
          {/* Listed By Section */}
          <FormField
            control={form.control}
            name="listedBy"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-base font-medium text-gray-900">
                  Listed By
                </FormLabel>
                <FormControl className="mt-4">
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="owner_manager_not_live"
                        id="owner_manager_not_live"
                        className="hover:cursor-pointer"
                      />
                      <Label
                        htmlFor="owner_manager_not_live"
                        className="text-sm"
                      >
                        I'm the property owner/manager and don't live on the
                        property
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="owner_manager_live"
                        id="owner_manager_live"
                      />
                      <Label htmlFor="owner_manager_live" className="text-sm">
                        I'm the property owner/manager and do live on the
                        property
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="agent_broker" id="agent_broker" />
                      <Label htmlFor="agent_broker" className="text-sm">
                        I'm an agent/broker/management company and don't live on
                        the property
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*total units */}
          <CustomInput
            name="totalRooms"
            label="Total Number of Units"
            placeholder="Enter total number of units"
            type="number"
            required
          />

          <CustomTextarea
            name="description"
            label="Property Description"
            placeholder="Describe the structure, layout, and shared spaces across units"
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none resize-none"
          />

          {/* Pets Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 ">
              <CustomCheckbox
                name="petsAllowed"
                stopPropagation
                onChange={(checked) =>
                  form.setValue("petsAllowed", checked, {
                    shouldValidate: true,
                  })
                }
              />

              <FormLabel className="text-sm font-medium text-gray-900">
                Are there pets allowed on the property?
              </FormLabel>
            </div>

            {form.watch("petsAllowed") && (
              <div className="space-y-4 p-2 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <h2 className="text-base font-medium text-gray-900 ">
                    Pet Type
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    {petOptions.map((pet) => {
                      const isSelected =
                        form.watch("petTypes")?.includes(pet.id) || false;

                      return (
                        <div
                          key={pet.id}
                          className={cn(
                            "flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-colors",
                            isSelected
                              ? "bg-primary-50 border-primary-200"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          )}
                          onClick={() => handlePetTypeToggle(pet.id)}
                        >
                          <CustomCheckbox
                            name="petTypes"
                            value={pet.id}
                            stopPropagation
                          />
                          <span className="text-xs flex-1">{pet.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Pets */}
                {/* <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-900">
                    Other Pet Types:
                  </Label>
                  <input
                    type="text"
                    value={newCustomPet}
                    onChange={(e) => setNewCustomPet(e.target.value)}
                    onKeyDown={handleAddCustomPet}
                    placeholder="Example: Fish, Hamster"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">
                    Type and press Enter to add custom pet types.
                  </p>

                  {form.watch("customPets") &&
                    form.watch("customPets")!.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.watch("customPets")!.map((pet, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-secondary-500 text-white"
                          >
                            {pet}
                            <button
                              type="button"
                              onClick={() => removeCustomPet(index)}
                              className="ml-2 hover:bg-secondary-600 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                </div> */}
                {/* Other Pets Section */}
                <div className="space-y-2 border border-gray-200 p-2 rounded-md">
                  <Label className="block text-sm font-medium text-gray-900">
                    Others (Optional):
                  </Label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Example: Lizards"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">
                    Type and press Enter to add. Maximum 5 tags allowed.
                  </p>

                  {form.watch("customTags").length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("customTags").map((tag, index) => (
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Availability Section - Updated */}
          <FormField
            control={form.control}
            name="availability"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-base font-medium text-gray-900">
                  When are you available to show the property?
                </FormLabel>
                {/* Meeting Duration Selection */}
                <div className="flex gap-6 my-4">
                  {durationOptions.map((option) => (
                    <div className="" key={option?.label}>
                      <div className="flex gap-2 items-start w-full sm:w-auto mb-2 sm:mb-0">
                        <Checkbox
                          name="availability_duration"
                          className="hover:cursor-pointer"
                          checked={
                            form.getValues("availability_duration") ===
                            option.value
                          }
                          onCheckedChange={() =>
                            form.setValue(
                              "availability_duration",
                              option.value,
                              { shouldValidate: true }
                            )
                          }
                        />
                        <div className="w-20 text-sm text-gray-900">
                          {option?.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <FormControl>
                  <div className="space-y-3 w-full flex flex-col items-start sm:items-center shadow-md rounded-lg border border-gray-200 p-4">
                    {days.map((day) => {
                      const dayLower =
                        day.toLowerCase() as keyof FormValues["availability"];
                      const isSelected = !!form.watch("availability")[dayLower];
                      const timeRange = form.watch("availability")[dayLower];

                      // Get error for this specific day
                      const dayError =
                        form.formState.errors.availability?.[dayLower];

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
                    {form.formState.errors.availability?.message && (
                      <p className="text-red-500 text-sm mt-1 mr-auto">
                        {form.formState.errors.availability.message}
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          {/* Property Photos */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="propertyPhotos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Property photos <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      <div className="space-y-2">
                        {/* Drag and drop area */}
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
                        filePreviews.length > 0) && (
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
                          {filePreviews.map((preview, index) => (
                            <div key={`new-${index}`} className="relative">
                              <img
                                src={preview || "/placeholder.svg"}
                                alt={`Preview ${index}`}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeNewFile(index)}
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
                  <FormMessage className="text-red-500 text-sm font-normal" />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 items-end justify-end">
            {/* <Button
              type="button"
              variant="outline"
              // onClick={handleBack}
              disabled={isSubmitting}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 px-3"
            >
              Back
            </Button> */}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={form.handleSubmit((data) => onSubmit(true, data))}
                disabled={isSubmitting}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 px-3"
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ListingInfo;
