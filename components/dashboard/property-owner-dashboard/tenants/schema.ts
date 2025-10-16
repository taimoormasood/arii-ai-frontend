import { z } from "zod";

// Allowed file types and max size
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
      message: `File must be JPG, PNG, or PDF`,
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
      message: `File must be JPG, PNG, or PDF`,
    }
  );

export const inviteTenantSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(20, "First name cannot exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9\s]+$/,
        "First name must contain only alphanumeric characters"
      ),
    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(20, "Last name cannot exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9\s]+$/,
        "Last name must contain only alphanumeric characters"
      ),
    email: z
      .string()
      .email("Invalid email address")
      .min(2, "Email is required"),
    assign_property: z.string().min(1, "Property assignment is required"),
    lease_amount: z.coerce
      .number({
        required_error: "Lease amount is required.",
        invalid_type_error: "Only numbers are allowed.",
      })
      .min(1, "Lease amount is required."),

    security_deposit: z.coerce
      .number({
        invalid_type_error: "Only numbers are allowed.",
      })
      .optional(),
    lease_start_date: z.date().optional(),
    lease_end_date: z.date().optional(),
    tenant_type: z.string().min(1, "Tenant type is required"),
    lease_document: fileSchema,
  })
  .superRefine((data, ctx) => {
    if (data.lease_start_date && data.lease_end_date) {
      const startDate = new Date(data.lease_start_date);
      const endDate = new Date(data.lease_end_date);

      if (startDate >= endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Lease end date must be after start date",
          path: ["lease_end_date"],
        });
      }
    }

    if (!data.lease_start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Lease start date is required",
        path: ["lease_start_date"],
      });
    }

    if (!data.lease_end_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Lease end date is required",
        path: ["lease_end_date"],
      });
    }
  });

export const assignTaskSchema = z.object({
  tenant: z.string().min(1, "Tenant is required"),
  task: z.string().min(1, "Task is required"),
});

export const renewLeaseSchema = z
  .object({
    rentAmount: z.coerce
      .number({
        required_error: "Rent amount is required.",
        invalid_type_error: "Only numbers are allowed.",
      })
      .min(1, "Rent amount must be greater than 0"),
    securityDeposit: z.coerce
      .number({
        invalid_type_error: "Only numbers are allowed.",
      })
      .min(0, "Security deposit cannot be negative")
      .optional(),
    leaseStartDate: z.date({
      required_error: "Lease start date is required.",
    }),
    leaseEndDate: z.date({
      required_error: "Lease end date is required.",
    }),
    leaseDocument: fileSchema,
  })
  .superRefine((data, ctx) => {
    // Custom validation for date range
    if (data.leaseStartDate && data.leaseEndDate) {
      if (data.leaseEndDate <= data.leaseStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Lease end date must be after start date",
          path: ["leaseEndDate"],
        });
      }
    }
  });
