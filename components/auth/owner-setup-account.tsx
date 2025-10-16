"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { alertSuccess } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { errorHandler } from "@/helpers/error-handler";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/lib/contexts/auth-context";
import { setupOwnerProfile } from "@/services/auth/auth.service";
import { showModal } from "@/utils/modal-config";

// Define the allowed file types
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed file types and max size
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Create a more robust file schema that handles undefined values
const fileSchema = z
  .any()
  .refine(
    (file) => {
      if (!file) return false;

      return file instanceof File;
    },
    {
      message: "Please select a file",
    }
  )
  .refine(
    (file) => {
      if (!file || !(file instanceof File)) return false;

      return file.size <= MAX_FILE_SIZE;
    },
    {
      message: `File size must be less than 5MB`,
    }
  )
  .refine(
    (file) => {
      if (!file || !(file instanceof File)) return false;

      return ACCEPTED_FILE_TYPES.includes(file.type);
    },
    {
      message: `File must be JPG or PNG`,
    }
  );

// Optional file schema for back image
const optionalFileSchema = z
  .any()
  .optional()
  .refine(
    (file) => {
      if (!file) return true;

      return file instanceof File;
    },
    {
      message: "Invalid file",
    }
  )
  .refine(
    (file) => {
      if (!file || !(file instanceof File)) return true;

      return file.size <= MAX_FILE_SIZE;
    },
    {
      message: `File size must be less than 5MB`,
    }
  )
  .refine(
    (file) => {
      if (!file || !(file instanceof File)) return true;

      return ACCEPTED_FILE_TYPES.includes(file.type);
    },
    {
      message: `File must be JPG or PNG`,
    }
  );

// Option 2: Cleaner approach using union with empty string
const formSchema = z
  .object({
    registrationType: z.enum(["individual", "business"]),
    profileImage: fileSchema,
    businessName: z
      .union([
        z
          .string()
          .min(3, "Business name must be at least 3 characters")
          .max(50, "Business name cannot exceed 50 characters"),
        z.literal(""),
      ])
      .optional(),
    businessWebsite: z
      .union([z.string().url("Please enter a valid URL"), z.literal("")])
      .optional(),
    businessAddress: z
      .union([
        z.string().min(5, "Business address must be at least 5 characters"),
        z.literal(""),
      ])
      .optional(),
    taxId: z
      .union([
        z.string().min(5, "Tax ID must be at least 5 characters"),
        z.literal(""),
      ])
      .optional(),
    businessType: z
      .union([
        z.string().min(1, "Please select a business type"),
        z.literal(""),
      ])
      .optional(),
    businessLicense: optionalFileSchema,
  })
  .superRefine((data, ctx) => {
    if (data.registrationType === "business") {
      if (!data.businessLicense) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessLicense"],
          message: "Business license is required",
        });
      }
    }
  });

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

export default function OwnerSetupAccount() {
  const router = useRouter();
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { updateUser, user } = useAuth();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      registrationType: "individual",
      profileImage: undefined,
      businessName: "",
      businessWebsite: "",
      businessAddress: "",
      taxId: "",
      businessType: "",
      businessLicense: undefined,
    },
  });

  const registrationType = form.watch("registrationType");

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Prepare object for verifyKyc
      const verifyKycPayload = {
        registration_type: values.registrationType,
        business_name: values.businessName || "",
        business_website: values.businessWebsite || "",
        business_address: values.businessAddress || "",
        company_registration_number: values.taxId || "",
        business_type: values.businessType || "",
        profile_image_path: values.profileImage,
        business_license: values.businessLicense || "",
        user_id: 2,
      };

      const response = await setupOwnerProfile(verifyKycPayload);
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

        await showModal({
          title:
            "Your profile has been successfully completed. Welcome to Rental Guru!",
          image: alertSuccess,
          onClose: () => router.push("/universal-dashboard"),
          actions: [
            {
              text: "Go to Dashboard",
              onClick: () => router.push("/universal-dashboard"),
            },
          ],
        });
      }

      form.reset();
    } catch (error) {
      toast.error(errorHandler(error));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    form.trigger("profileImage");
  };

  // Handle business license change
  const handleBusinessLicenseChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("businessLicense", file);
    }
  };

  return (
    <div className="bg-white flex flex-col w-full mx-auto rounded-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-3">Setup Account</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col mb-6">
            <div className="flex flex-col items-baseline">
              <Avatar className="w-20 h-20 mb-4 relative">
                <AvatarImage src={profileImagePreview || ""} alt="Profile" />
                <AvatarFallback className="bg-gray-200">
                  <User className="w-10 h-10 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              {form.watch("profileImage") && (
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("profileImage", undefined);
                    setProfileImagePreview(null);
                    form.clearErrors("profileImage");
                  }}
                  className="ml-2 text-red-600 hover:underline text-sm mb-2"
                >
                  Delete Picture
                </button>
              )}
            </div>
            <p className="text-sm mb-2">Upload a Profile Image</p>
            <div className="flex gap-3 h-10 border-gray-200 bg-gray-100 rounded-lg relative p-0 w-full items-center border border-input py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <label
                htmlFor="profileImage"
                className="cursor-pointer bg-gray-500 block text-white rounded-tl-lg rounded-bl-lg py-2.5 px-2 text-sm font-medium"
              >
                Choose file
              </label>
              <input
                id="profileImage"
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleProfileImageChange}
              />
              <span className="text-sm text-gray-500 truncate flex-1">
                {form.watch("profileImage")?.name || "No file chosen"}
              </span>
              {/* Show Remove button only if image is selected */}
            </div>
            <FormDescription className="text-xs text-gray-500 mt-2">
              Type: File Upload, Format: JPG, PNG, Max size: 5MB, Required
            </FormDescription>
            {form.formState.errors.profileImage?.message && (
              <p className="text-red-500 text-xs">
                {String(form.formState.errors.profileImage.message)}
              </p>
            )}
          </div>

          {/* Registration Type */}
          <FormField
            control={form.control}
            name="registrationType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-gray-700 text-sm font-medium">
                  Registration Type
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4 items-center mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" />
                      <Label
                        htmlFor="individual"
                        className="text-gray-900 font-medium text-sm"
                      >
                        Individual
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" />
                      <Label
                        htmlFor="business"
                        className="text-gray-900 font-medium text-sm"
                      >
                        Business
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Fields - Only show if "Business" is selected */}
          {registrationType === "business" && (
            <>
              {/* Business Name */}
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <CustomInput
                    label="Business Name"
                    placeholder="Enter business name"
                    {...field}
                  />
                )}
              />

              {/* Business Website */}
              <FormField
                control={form.control}
                name="businessWebsite"
                render={({ field }) => (
                  <CustomInput
                    placeholder="Enter business website"
                    label="Business Website"
                    {...field}
                  />
                )}
              />

              {/* Business Address */}
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <CustomInput
                    label="Business Address"
                    placeholder="Enter business address"
                    {...field}
                  />
                )}
              />

              {/* Company Registration Number / Tax ID */}
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <CustomInput
                    label="Company Registration Number / Tax ID"
                    placeholder="Enter company registration number / Tax ID"
                    {...field}
                  />
                )}
              />

              {/* Business Type */}
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <CustomInput
                    label="Business Type"
                    placeholder="Select"
                    select
                    options={businessTypes}
                    {...field}
                  />
                )}
              />

              {/* Business License Upload */}
              <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">
                  Upload Business License
                </Label>
                <div className="flex gap-3 mt-1 h-10 border-gray-200 bg-gray-100 rounded-lg relative p-0 w-full items-center border border-input py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <label
                    htmlFor="businessLicense"
                    className="cursor-pointer bg-gray-500 block text-white rounded-tl-lg rounded-bl-lg py-2.5 px-2 text-sm font-medium"
                  >
                    Choose file
                  </label>
                  <input
                    id="businessLicense"
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleBusinessLicenseChange}
                  />
                  <span className="text-sm text-gray-500 truncate flex-1">
                    {form.watch("businessLicense")?.name || "No file chosen"}
                  </span>
                </div>

                <FormDescription className="text-xs text-gray-500 mt-2">
                  Type: File Upload, Format: JPG, PNG, Max size: 5MB, Required
                </FormDescription>
                {form.formState.errors.businessLicense?.message && (
                  <p className="text-red-500 text-xs">
                    {String(form.formState.errors.businessLicense.message)}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                "/universal-dashboard?role=property-manager&view=dashboard"
              )
            }
            className="w-full mb-4"
          >
            Skip
          </Button>
          <Button
            className="bg-primary-500 hover:bg-primary-700 text-white w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Non-profit Organization",
  "Freelancer",
  "Other",
];
