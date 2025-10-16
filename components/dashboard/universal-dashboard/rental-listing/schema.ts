import * as z from "zod";

export const applyRentSchema = z
  .object({
    // Main applicant selection
    applying_for: z.enum(["myself", "someone_else"], {
      required_error: "Please select who you are applying for",
    }),

    // Main applicant fields (always required)
    full_name: z.string().min(1, "Full name is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Please enter a valid email address"),
    check_in_date: z.date({
      required_error: "Check-in date is required",
    }),
    check_out_date: z.date({
      required_error: "Check-out date is required",
    }),
    current_address: z.string().optional(),
    special_requirements: z.string().optional(),

    // Additional fields for "someone else" option
    applicant_full_name: z.string().optional(),
    relation: z.string().optional(),
    applicant_phone_number: z.string().optional(),
    applicant_email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")), // Terms and conditions
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine(
    (data) => {
      // Additional validation for "someone else" fields
      if (data.applying_for === "someone_else") {
        return (
          data.applicant_full_name &&
          data.applicant_full_name.length > 0 &&
          data.relation &&
          data.applicant_phone_number &&
          data.applicant_phone_number.length > 0
        );
      }

      return true;
    },
    {
      message:
        "All applicant fields are required when applying for someone else",
      path: ["applicant_full_name"],
    }
  )
  .refine(
    (data) => {
      // Validate check-out date is after check-in date
      if (data.check_in_date && data.check_out_date) {
        return data.check_out_date > data.check_in_date;
      }

      return true;
    },
    {
      message: "Check-out date must be after check-in date",
      path: ["check_out_date"],
    }
  );

export type ApplyRentFormType = z.infer<typeof applyRentSchema>;
