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
