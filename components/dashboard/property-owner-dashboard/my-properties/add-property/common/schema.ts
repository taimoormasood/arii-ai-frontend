import { z } from "zod";

// propertyInfoSchema is used to validate the property information form in the property owner dashboard
export const propertyInfoSchema = z.object({
  propertyName: z.string().min(1, "Property name is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  zipCode: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{5}(-\d{4})?$/.test(val), {
      message: "Zip code must contain only numbers (e.g., 12345 or 12345-6789)",
    }),
});

// rental detail schema

export const baseRentalDetailSchema = z.object({
  rentalType: z.enum(
    ["short_term", "long_term", "monthly_billing", "semester_billing"],
    {
      required_error: "Rental type is required",
    }
  ),
  securityDeposit: z.coerce
    .number()
    .refine((val) => val === undefined || Number.isInteger(val * 100), {
      message: "Amount cannot have more than 2 decimal places",
    })
    .optional(),
  assignedTenant: z.string().optional(),
  dailyRent: z.coerce
    .number()
    .refine((val) => val === undefined || Number.isInteger(val * 100), {
      message: "Daily rent cannot have more than 2 decimal places",
    })
    .optional(),
  monthlyRent: z.coerce
    .number()
    .refine((val) => val === undefined || Number.isInteger(val * 100), {
      message: "Monthly rent cannot have more than 2 decimal places",
    })
    .optional(),
  hasSpecialOffer: z.boolean().optional(),
  offerStartDate: z.date().optional(),
  offerEndDate: z.date().optional(),
  offerPercentage: z.coerce
    .number()
    .refine((val) => val === undefined || Number.isInteger(val * 100), {
      message: "Offer percentage cannot have more than 2 decimal places",
    })
    .optional(),
  leaseStartDate: z.date().optional(),
  leaseEndDate: z.date().optional(),
});

export const createRentalDetailSchema = (
  rentalType:
    | "short_term"
    | "long_term"
    | "monthly_billing"
    | "semester_billing"
    | null,
  assignedTenant: string | null,
  hasSpecialOffer: boolean = false
) => {
  return baseRentalDetailSchema.superRefine((data, ctx) => {
    // Validate rental type specific fields
    if (rentalType === "short_term" || rentalType === "monthly_billing") {
      if (!data.dailyRent || data.dailyRent <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Daily rent is required and must be greater than 0",
          path: ["dailyRent"],
        });
      }
    }

    if (rentalType === "long_term") {
      if (!data.monthlyRent || data.monthlyRent <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Monthly rent is required and must be greater than 0",
          path: ["monthlyRent"],
        });
      }
    }

    // Validate special offer fields
    if (hasSpecialOffer) {
      if (!data.offerStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Offer start date is required",
          path: ["offerStartDate"],
        });
      }

      if (!data.offerEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Offer end date is required",
          path: ["offerEndDate"],
        });
      }

      if (
        !data.offerPercentage ||
        data.offerPercentage <= 0 ||
        data.offerPercentage > 100
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Offer percentage is required and must be between 1-100",
          path: ["offerPercentage"],
        });
      }

      // Validate offer date range
      if (data.offerStartDate && data.offerEndDate) {
        const startDate = new Date(data.offerStartDate);
        const endDate = new Date(data.offerEndDate);

        if (startDate >= endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Offer end date must be after start date",
            path: ["offerEndDate"],
          });
        }
      }
    }

    // Validate lease dates if tenant is assigned
    if (assignedTenant && assignedTenant !== "") {
      if (!data.leaseStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Lease start date is required when tenant is assigned",
          path: ["leaseStartDate"],
        });
      }

      if (!data.leaseEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Lease end date is required when tenant is assigned",
          path: ["leaseEndDate"],
        });
      }

      // Validate lease date range
      if (data.leaseStartDate && data.leaseEndDate) {
        const startDate = new Date(data.leaseStartDate);
        const endDate = new Date(data.leaseEndDate);

        if (startDate >= endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Lease end date must be after start date",
            path: ["leaseEndDate"],
          });
        }
      }
    }
  });
};

// amenities schema

export const createAmenitiesSchema = (amenitiesData: any[]) => {
  const schemaFields: Record<string, any> = {};
  amenitiesData?.forEach((item) => {
    const fieldName = item?.amenity?.toLowerCase()?.replace(/\s+/g, "");
    if (item?.amenity === "Laundry Facilities") {
      schemaFields[fieldName] = z
        .string()
        .min(1, "Please select a laundry option");
    } else {
      schemaFields[fieldName] = z.array(z.string()).optional();
    }
  });
  schemaFields.other_amenities = z
    .array(z.string())
    .max(5, "Maximum 5 custom amenities allowed")
    .optional();

  return z.object(schemaFields);
};

// owner/investor info schema

export const ownerSchema = z.object({
  id: z.number().optional(), // Add id field for existing owners
  email: z.string().email("Please enter a valid email address"),
  ownershipPercentage: z.coerce
    .number({ invalid_type_error: "Only numbers are allowed." })
    .min(1, "Ownership percentage must be at least 1%")
    .max(100, "Ownership percentage cannot exceed 100%"),
  emergencyPerson: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

export const ownerFormSchema = z.object({
  defaultOwner: ownerSchema,
  owners: z.array(ownerSchema).max(5, "Maximum 5 owners allowed"),
});
