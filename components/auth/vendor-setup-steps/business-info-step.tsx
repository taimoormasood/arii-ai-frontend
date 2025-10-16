"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { alertSuccess } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/lib/contexts/auth-context";
import { useVendorSetupStore } from "@/lib/stores/use-vendor-setup-store";
import { updateVendorProfile } from "@/services/auth/auth.service";
import type { SetupVendorProfileBody } from "@/services/auth/types";
import { showModal } from "@/utils/modal-config";

const vendorRoles = [
  "Plumber",
  "Electrician",
  "HVAC Technician",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Landscaper",
  "Roofer",
  "Flooring Specialist",
  "Appliance Repair",
];

const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "S-Corporation",
  "Non-Profit",
  "Other",
];

// Define the allowed file types
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// File validation schema - required files
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
      message: `File must be JPG, PNG, or PDF`,
    }
  );

// Optional file schema
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
      message: `File must be JPG, PNG, or PDF`,
    }
  );

// Form schema with conditional validation
const formSchema = z.object({
  profileImage: optionalFileSchema,
  vendorRole: z.string().min(1, "Please select a vendor role"),
  registrationType: z.enum(["individual", "business"]),
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
    .union([z.string().min(1, "Please select a business type"), z.literal("")])
    .optional(),
  businessLicense: z.union([fileSchema, z.literal(undefined)]).optional(),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

export function BusinessInfoStep() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const { businessInfo, updateBusinessInfo, markStepCompleted, resetStore } =
    useVendorSetupStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      profileImage: undefined,
      vendorRole: businessInfo.vendorRole || "",
      registrationType: businessInfo.registrationType || "individual",
      businessName: businessInfo.businessName || "",
      businessWebsite: businessInfo.businessWebsite || "",
      businessAddress: businessInfo.businessAddress || "",
      taxId: businessInfo.taxId || "",
      businessType: businessInfo.businessType || "",
      businessLicense: undefined,
    },
  });

  const registrationType = form.watch("registrationType");

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBusinessLicenseChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("businessLicense", file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Update store with form values
      updateBusinessInfo({
        profileImage: values.profileImage,
        vendorRole: values.vendorRole,
        registrationType: values.registrationType,
        businessName: values.businessName || "",
        businessWebsite: values.businessWebsite || "",
        businessAddress: values.businessAddress || "",
        taxId: values.taxId || "",
        businessType: values.businessType || "",
        businessLicense: values.businessLicense,
      });

      // Prepare API payload for vendor profile
      const apiPayload: SetupVendorProfileBody = {
        vendor_role: values.vendorRole,
        registration_type: values.registrationType,
        profile_image_path: values.profileImage,
      };

      // Add business-specific fields if registration type is "business"
      if (values.registrationType === "business") {
        if (values.businessName) apiPayload.business_name = values.businessName;
        if (values.businessWebsite)
          apiPayload.business_website = values.businessWebsite;
        if (values.businessAddress)
          apiPayload.business_address = values.businessAddress;
        if (values.taxId) apiPayload.company_registration_number = values.taxId;
        if (values.businessType) apiPayload.business_type = values.businessType;
        if (values.businessLicense)
          apiPayload.business_license = values.businessLicense;
      }

      // Call the vendor profile API
      const response = await updateVendorProfile(apiPayload);

      if (response?.success) {
        // Update user context
        const res = await axiosInstance.get("/user-details");
        const user = res.data;
        const userData = await JSON.stringify(user?.data);
        const parsedData = await JSON.parse(userData);
        await updateUser(parsedData);

        // Update profile completion status
        const profile =
          parsedData?.property_owner_profile !== null ||
          parsedData?.vendor_profile !== null;
        Cookies.set("is_profile_completed", String(profile));

        // Mark step as completed
        markStepCompleted(1); // This is step 1 in the vendor setup flow

        // Move to next step instead of showing completion modal
        // since this is just the first step in the vendor setup process
        toast.success("Business information saved successfully!");

        // You might want to navigate to the next step here
        // For now, keeping the existing completion modal behavior
        resetStore();
        await showModal({
          title:
            "Your profile has been completed successfully. You can now start receiving service requests from Property Owners.",
          image: alertSuccess,
          onClose: () => router.push("/dashboard"),
          actions: [
            {
              text: "Go to Dashboard",
              onClick: () => router.push("/dashboard"),
            },
          ],
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save business information. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
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
            </div>
            <FormDescription className="text-xs text-gray-500 mt-2">
              Type: File Upload, Format: JPG, PNG, PDF, Max size: 5MB, Optional
            </FormDescription>
            {form.formState.errors.profileImage?.message && (
              <p className="text-red-500 text-xs">
                {String(form.formState.errors.profileImage.message)}
              </p>
            )}
          </div>

          {/* Vendor Role */}
          <FormField
            control={form.control}
            name="vendorRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 text-sm font-medium">
                  Vendor Role *
                </FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-100 shadow-none outline-0 h-auto focus:ring-0 focus:ring-offset-0 ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center text-sm text-gray-800">
                        <SelectValue placeholder="Select" />
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="z-[99999] bg-white border-none">
                    {vendorRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

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
                    value={field.value}
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
                <FormMessage className="text-red-500 text-xs" />
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
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">
                      Business Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter business name"
                        className="border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-100"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Business Website */}
              <FormField
                control={form.control}
                name="businessWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">
                      Business Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter business website"
                        className="border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-100"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Business Address */}
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">
                      Business Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter business address"
                        className="border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-100"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Company Registration Number / Tax ID */}
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">
                      Company Registration Number / Tax ID *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter company registration number / Tax ID"
                        className="border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-100"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Business Type */}
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">
                      Business Type *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-100">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Business License Upload */}
              <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">
                  Upload Business License *
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
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleBusinessLicenseChange}
                  />
                  <span className="text-sm text-gray-500 truncate flex-1">
                    {form.watch("businessLicense")?.name || "No file chosen"}
                  </span>
                </div>

                <FormDescription className="text-xs text-gray-500 mt-2">
                  Type: File Upload, Format: JPG, PNG, PDF, Max size: 5MB,
                  Required
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
            type="submit"
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
