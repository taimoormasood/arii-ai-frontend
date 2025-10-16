import { z } from "zod";

export const inviteVendorSchema = z.object({
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
  email: z.string().min(2, "Email is required").email("Invalid email address"),
  role: z.string().min(2, "Vendor role is required"),
});

export const assignTaskSchema = z.object({
  vendor: z.string().min(1, "Vendor is required"),
  task: z.string().min(1, "Task is required"),
});
