import { z } from "zod";

import { timeToMinutes } from "@/helpers";

export type VendorSetupFormValues = z.infer<typeof servicesDocumentsStepSchema>;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Services & Documents Step Schema
export const servicesDocumentsStepSchema = z
  .object({
    serviceCategories: z
      .array(z.string())
      .min(1, "At least one service category must be selected"),

    otherServiceCategory: z.string().optional(),

    servicesOffered: z
      .array(z.string())
      .min(1, "At least one service must be selected"),

    otherServiceDescription: z.string().optional(),

    certificationFiles: z
      .array(z.instanceof(File))
      .max(5, "Maximum 5 files allowed")
      .optional(),

    yearsOfExperience: z.string().optional(),

    serviceArea: z
      .string()
      .min(1, "At least one service area must be selected"),

    available24_7: z.boolean().optional(),
    description: z.string().optional(),

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

    offerEmergencyServices: z.boolean().optional(),

    emergencyContactNumber: z.string().optional(),

    languagesSpoken: z.string().optional(),

    phoneNumber: z.string().optional(),

    otherLanguage: z.string().optional(),

    hasInsuranceCoverage: z.boolean().optional(),
    insuranceYearsOfExperience: z.string().optional(),

    certifications: z
      .array(
        z.union([
          z
            .instanceof(File, {
              message: "Expected a file instance",
            })
            .refine((file) => file?.size <= MAX_IMAGE_SIZE, {
              message: "Each file must be under 5MB.",
            })
            .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
              message: "Only JPG, JPEG, or PNG files are allowed.",
            }),
          z.string().url("Invalid image URL"),
        ])
      )
      .min(1, "At least one file is required."),
  })
  .refine(
    (data) => {
      if (data.offerEmergencyServices) {
        return false;
      }

      return true;
    },
    {
      message:
        "Emergency contact number is required when emergency service is available",
      path: ["emergencyContactNumber"],
    }
  )
  .refine(
    (data) => {
      if (data.offerEmergencyServices && !data.phoneNumber) {
        return false;
      }

      return true;
    },
    {
      message: "Phone number is required when emergency service is available",
      path: ["phoneNumber"],
    }
  )
  .refine(
    (data) => {
      if (!data.available24_7 && !data.availability) {
        return false;
      }

      return true;
    },
    {
      message: "Daily availability is required when not available 24/7",
      path: ["dailyAvailability"],
    }
  );

// Business & Registration Info Step Schema
export const businessRegistrationStepSchema = z
  .object({
    profileImage: z.instanceof(File).optional(),

    vendorRole: z.string().min(1, "Vendor role is required"),

    registrationType: z.enum(["Individual", "Business"]).default("Individual"),

    businessName: z
      .string()
      .min(3, "Business name must be at least 3 characters")
      .max(50, "Business name must not exceed 50 characters")
      .optional(),

    businessWebsite: z
      .string()
      .url("Please enter a valid website URL")
      .optional()
      .or(z.literal("")),

    businessAddress: z.string().optional(),

    companyRegistrationNumber: z.string().optional(),

    businessType: z
      .enum([
        "Sole Proprietor",
        "Limited Liability Company (LLC)",
        "Corporation (C-Corp/S-Corp)",
        "Partnership",
        "Freelancer",
        "Franchise",
        "Cooperative",
        "Government Contractor",
        "Other",
      ])
      .optional(),

    businessLicenseFiles: z
      .array(z.instanceof(File))
      .max(4, "Maximum 4 files allowed")
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.registrationType === "Business" &&
        (!data.businessLicenseFiles || data.businessLicenseFiles.length === 0)
      ) {
        return false;
      }

      return true;
    },
    {
      message: "Business license is required for business registration",
      path: ["businessLicenseFiles"],
    }
  );
