import { z } from "zod";

export const financialEmploymentSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").optional(),
  employmentStatus: z
    .string()
    .min(1, "Employment status is required")
    .optional(),
  industry: z.string().min(1, "Industry is required").optional(),
  incomeRange: z.string().min(1, "Income range is required").optional(),
  mortgageAmount: z.coerce
    .number({ invalid_type_error: "Mortgage amount must be a number" })
    .min(0, "Mortgage amount must be positive")
    .optional(),
  creditScoreRange: z.string().optional(),
  debtToIncomeRatio: z.string().optional(),
  investmentPreferences: z.array(z.string()).optional(),
});

export type FinancialEmploymentFormType = z.infer<
  typeof financialEmploymentSchema
>;

export const propertyLocationSchema = z.object({
  propertyType: z.string().min(1, "Property type is required").optional(),
  lengthOfStay: z.string().min(1, "Length of stay is required").optional(),
  utilityCostEstimates: z
    .string()
    .min(1, "Utility cost estimates is required")
    .optional(),
  leaseTerm: z.coerce
    .number({ invalid_type_error: "Lease term must be a number" })
    .min(1, "Lease term is required")
    .optional(),
  preferredRentalPriceRange: z.string().optional(),
  currentHomeValue: z.coerce
    .number({ invalid_type_error: "Current home value must be a number" })
    .min(0, "Current home value must be positive")
    .optional(),
  interestInMoving: z.string().optional(),
});

export type PropertyLocationFormType = z.infer<typeof propertyLocationSchema>;

export const riskBehaviorSchema = z.object({
  lateBillPaymentHistory: z
    .string()
    .min(1, "Late bill payment history is required"),
  spendingHabits: z.string().min(1, "Spending habits is required"),
  monthlyBudgetAllocation: z.coerce
    .number({
      invalid_type_error: "Monthly budget allocation must be a number",
    })
    .min(0, "Monthly budget allocation must be positive")
    .optional(),
  financialGoals: z.array(z.string()).optional(),
});

export type RiskBehaviorFormType = z.infer<typeof riskBehaviorSchema>;
