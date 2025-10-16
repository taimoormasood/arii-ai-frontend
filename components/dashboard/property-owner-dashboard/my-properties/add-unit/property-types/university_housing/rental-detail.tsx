"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import CustomSelect from "@/components/ui/custom-select";
import CustomDatePicker from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import {
  useAddRentalDetail,
  useGetPropertyDetail,
  useUpdateRentalDetail,
} from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";

const rentalTypeOptions = [
  { value: "monthly_billing", label: "Monthly Billing" },
  { value: "semester_billing", label: "Semester Billing" },
];

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
  monthlyRent: z.coerce
    .number()
    .positive()
    .refine((val) => val === undefined || Number.isInteger(val * 100), {
      message: "Monthly rent cannot have more than 2 decimal places",
    })
    .optional(),
  semester: z.string().optional(),
  semesterRent: z.coerce
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
    | "monthly_billing"
    | "semester_billing"
    | "short_term"
    | "long_term"
    | null,
  assignedTenant: string | null,
  hasSpecialOffer: boolean = false
) => {
  return baseRentalDetailSchema.superRefine((data, ctx) => {
    // Validate rental type specific fields
    if (rentalType === "monthly_billing") {
      if (!data.monthlyRent || data.monthlyRent <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Monthly rent is required",
          path: ["monthlyRent"],
        });
      }
    }

    if (rentalType === "semester_billing") {
      if (!data.semester || data.semester.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Semester is required",
          path: ["semester"],
        });
      }
      if (!data.semesterRent || data.semesterRent <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Semester rent is required",
          path: ["semesterRent"],
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

// Define the form data type based on the base schema
type FormData = z.infer<typeof baseRentalDetailSchema>;

interface RentDetailsProps {
  pageSaved: number;
  nextCurrentStep: number;
  stepToMarkComplete: number;
  isUnit?: boolean;
}

const semesterOptions = [
  { value: "fall", label: "Fall" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
];

const RentDetails = ({
  pageSaved = 3,
  nextCurrentStep = 4,
  stepToMarkComplete = 3,
  isUnit = false,
}: RentDetailsProps) => {
  const [rentalType, setRentalType] = useState<
    "monthly_billing" | "semester_billing" | "short_term" | "long_term"
  >("monthly_billing");

  const { mutate: addRentalDetail, isPending: isAddingRental } =
    useAddRentalDetail();
  const { mutate: updateRentalDetail, isPending: isUpdatingRental } =
    useUpdateRentalDetail();

  const router = useRouter();
  const {
    getStepData,
    markStepCompleted,
    setCurrentStep,
    setCurrentUnitStep,
    markUnitStepCompleted,
    updateStepData,
    updateUnitStepData,
    currentStep,
    currentUnitStep,
    getUnitStepData,
    isEditMode,
    editingPropertyId,
  } = usePropertyStore();

  const isSubmitting = isAddingRental || isUpdatingRental;

  const searchParams = useSearchParams();

  const searchedUnitId = searchParams.get("unitId");

  // Get property ID - prioritize editingPropertyId, then store data
  const storePropertyId = getStepData("propertyInfo")?.id;
  const propertyId = editingPropertyId || storePropertyId;
  const unitId = isUnit
    ? getUnitStepData("unitInfo")?.id
    : searchedUnitId
      ? searchedUnitId
      : undefined;

  // Get rental data from the appropriate store based on context
  const rentLeaseFormData = isUnit
    ? getUnitStepData("rentLease")
    : getStepData("rentLease");

  // Determine if we're in edit mode for this specific context
  const isInEditMode = isUnit
    ? isEditMode && unitId // Unit edit mode: need both edit mode flag and unit ID
    : isEditMode && editingPropertyId; // Property edit mode: need edit mode flag and property ID

  // Fetch property details when we have a property ID
  const { data: propertyDetailResponse, isLoading: isLoadingPropertyDetail } =
    useGetPropertyDetail(propertyId || 0);

  // Extract rental details from property detail response
  const propertyData = propertyDetailResponse?.data;

  const allUnits = (propertyData as any)?.units || [];
  const currentUnitData = unitId
    ? allUnits.find((unit: any) => unit.detail.id === unitId)
    : null;

  const apiRentalDetails = isUnit
    ? currentUnitData?.rental_details
    : propertyData?.rental_details;

  // Check if we have existing rental data from either API or store - only in edit mode
  const hasApiRentalData = !!(
    apiRentalDetails &&
    (apiRentalDetails.rental_type ||
      apiRentalDetails.rent ||
      apiRentalDetails.security_deposit)
  );

  const hasStoreRentalData = !!(
    rentLeaseFormData &&
    (rentLeaseFormData.rentalType ||
      rentLeaseFormData.rent ||
      rentLeaseFormData.securityDeposit ||
      rentLeaseFormData.assignedTenant)
  );

  // For units, also consider if we have API data as edit mode indicator
  // This handles cases where store edit mode flag might not be set properly
  const isEffectivelyInEditMode = isInEditMode || (isUnit && hasApiRentalData);

  // Determine if we should use update vs create endpoint
  // Use update when:
  // 1. We have API data (definitely existing)
  // 2. We're in edit mode and have store data (likely existing)
  const shouldUseUpdateEndpoint =
    hasApiRentalData || (isEffectivelyInEditMode && hasStoreRentalData);

  const hasExistingRentalData =
    isEffectivelyInEditMode && (hasApiRentalData || hasStoreRentalData);

  const [hasSpecialOffer, setHasSpecialOffer] = useState(false);

  const [assignedTenant, setAssignedTenant] = useState<string | null>(null);

  const schema = useMemo(() => {
    return createRentalDetailSchema(
      rentalType,
      assignedTenant,
      hasSpecialOffer
    );
  }, [rentalType, assignedTenant, hasSpecialOffer]);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      // Start with basic defaults - useEffect hooks will handle proper data population
      rentalType: "monthly_billing",
      assignedTenant: "",
      monthlyRent: undefined,
      semesterRent: undefined,
      semester: "",
      securityDeposit: 0,
      hasSpecialOffer: false,
      offerPercentage: 0,
      leaseStartDate: new Date(),
      leaseEndDate: new Date(),
      offerStartDate: undefined,
      offerEndDate: undefined,
    },
    mode: "onChange",
  });

  const { clearErrors, setValue } = methods;

  // Initialize form with store data when not in edit mode
  useEffect(() => {
    if (!isEffectivelyInEditMode && rentLeaseFormData) {
      setRentalType(rentLeaseFormData.rentalType || "monthly_billing");
      setAssignedTenant(rentLeaseFormData.assignedTenant || null);
      setHasSpecialOffer(rentLeaseFormData.promoteSpecialOffer || false);

      methods.reset({
        rentalType: rentLeaseFormData.rentalType || "monthly_billing",
        assignedTenant: rentLeaseFormData.assignedTenant || "",
        monthlyRent:
          rentLeaseFormData.rentalType === "monthly_billing"
            ? rentLeaseFormData.rent || 0
            : 0,
        semester: rentLeaseFormData.semester || "",
        semesterRent:
          rentLeaseFormData.rentalType === "semester_billing"
            ? rentLeaseFormData.rent || 0
            : 0,
        securityDeposit: rentLeaseFormData.securityDeposit || 0,
        hasSpecialOffer: rentLeaseFormData.promoteSpecialOffer || false,
        offerPercentage: rentLeaseFormData.offerPercentage || 0,
        leaseStartDate: rentLeaseFormData.leaseStartDate
          ? new Date(rentLeaseFormData.leaseStartDate)
          : new Date(),
        leaseEndDate: rentLeaseFormData.leaseEndDate
          ? new Date(rentLeaseFormData.leaseEndDate)
          : new Date(),
        offerStartDate: rentLeaseFormData.offerStartDate
          ? new Date(rentLeaseFormData.offerStartDate)
          : undefined,
        offerEndDate: rentLeaseFormData.offerEndDate
          ? new Date(rentLeaseFormData.offerEndDate)
          : undefined,
      });
    }
  }, [isEffectivelyInEditMode, rentLeaseFormData, methods]);

  // Update form and store when property details are loaded (API data available)
  useEffect(() => {
    if (apiRentalDetails && propertyId) {
      // Determine rental type from API
      const apiRentalType = apiRentalDetails.rental_type || "monthly_billing";

      // Parse dates if they exist
      const parseDate = (dateString: string | null | undefined) => {
        return dateString ? new Date(dateString) : undefined;
      };

      // Find matching tenant option - API might return name, value, or ID
      const findMatchingTenant = (apiTenantValue: string) => {
        if (!apiTenantValue) return "";

        // First try exact match on value
        const exactMatch = assignTenantOptions.find(
          (option) => option.value === apiTenantValue
        );
        if (exactMatch) {
          return exactMatch.value;
        }

        // Then try to match on label (name)
        const nameMatch = assignTenantOptions.find(
          (option) =>
            option.label.toLowerCase() === apiTenantValue.toLowerCase()
        );
        if (nameMatch) {
          return nameMatch.value;
        }

        return apiTenantValue;
      };

      const matchedTenantValue = findMatchingTenant(
        apiRentalDetails.assigned_tenant
      );

      // Prepare the rental store data from API response
      const rentalStoreData = {
        property: propertyId,
        rentalType: apiRentalType as "monthly_billing" | "semester_billing",
        rent: apiRentalDetails.rent ? Number(apiRentalDetails.rent) : 0,
        semester: apiRentalDetails.semester || "",
        securityDeposit: apiRentalDetails.security_deposit
          ? Number(apiRentalDetails.security_deposit)
          : 0,
        assignedTenant: matchedTenantValue || "",
        leaseStartDate: apiRentalDetails.lease_start_date || "",
        leaseEndDate: apiRentalDetails.lease_end_date || "",
        promoteSpecialOffer: apiRentalDetails.promote_special_offer || false,
        offerStartDate: apiRentalDetails.offer_start_date || "",
        offerEndDate: apiRentalDetails.offer_end_date || "",
        offerPercentage: apiRentalDetails.offer_percentage
          ? Number(apiRentalDetails.offer_percentage)
          : 0,
        // Store raw API response for reference
        apiResponse: apiRentalDetails,
      };

      // Update the store with API response data
      if (isUnit) {
        updateUnitStepData("rentLease", rentalStoreData);
      } else {
        updateStepData("rentLease", rentalStoreData);
      }

      // Set component state based on API data
      setRentalType(apiRentalType as "monthly_billing" | "semester_billing");
      setAssignedTenant(matchedTenantValue || null);
      setHasSpecialOffer(apiRentalDetails.promote_special_offer || false);

      // Update form with API data
      methods.reset({
        rentalType: apiRentalType as "monthly_billing" | "semester_billing",
        assignedTenant: matchedTenantValue || "",
        monthlyRent:
          apiRentalType === "monthly_billing"
            ? apiRentalDetails.rent
              ? Number(apiRentalDetails.rent)
              : undefined
            : undefined,
        semesterRent:
          apiRentalType === "semester_billing"
            ? apiRentalDetails.rent
              ? Number(apiRentalDetails.rent)
              : undefined
            : undefined,
        semester: apiRentalDetails.semester || "",
        securityDeposit: apiRentalDetails.security_deposit
          ? Number(apiRentalDetails.security_deposit)
          : 0,
        hasSpecialOffer: apiRentalDetails.promote_special_offer || false,
        offerPercentage: apiRentalDetails.offer_percentage
          ? Number(apiRentalDetails.offer_percentage)
          : 0,
        leaseStartDate:
          parseDate(apiRentalDetails.lease_start_date) || new Date(),
        leaseEndDate: parseDate(apiRentalDetails.lease_end_date) || new Date(),
        offerStartDate: parseDate(apiRentalDetails.offer_start_date),
        offerEndDate: parseDate(apiRentalDetails.offer_end_date),
      });
    }
  }, [
    apiRentalDetails,
    propertyId,
    methods,
    isUnit,
    updateUnitStepData,
    updateStepData,
  ]);

  // Also handle store data for cases where we're navigating between steps or not in edit mode
  useEffect(() => {
    if (rentLeaseFormData && !isLoadingPropertyDetail && !hasApiRentalData) {
      // Use store data when:
      // 1. Not in edit mode (creating new property/unit)
      // 2. In edit mode but no API data available yet
      // 3. Navigating between steps with existing form data

      setRentalType(rentLeaseFormData.rentalType || "monthly_billing");
      setAssignedTenant(rentLeaseFormData.assignedTenant || null);
      setHasSpecialOffer(rentLeaseFormData.promoteSpecialOffer || false);

      methods.reset({
        rentalType: rentLeaseFormData.rentalType || "monthly_billing",
        assignedTenant: rentLeaseFormData.assignedTenant || "",
        monthlyRent:
          rentLeaseFormData.rentalType === "monthly_billing"
            ? rentLeaseFormData.rent || undefined
            : undefined,
        semesterRent:
          rentLeaseFormData.rentalType === "semester_billing"
            ? rentLeaseFormData.rent || undefined
            : undefined,
        semester: rentLeaseFormData.semester || "",
        securityDeposit: rentLeaseFormData.securityDeposit || 0,
        hasSpecialOffer: rentLeaseFormData.promoteSpecialOffer || false,
        offerPercentage: rentLeaseFormData.offerPercentage || 0,
        leaseStartDate: rentLeaseFormData.leaseStartDate
          ? new Date(rentLeaseFormData.leaseStartDate)
          : new Date(),
        leaseEndDate: rentLeaseFormData.leaseEndDate
          ? new Date(rentLeaseFormData.leaseEndDate)
          : new Date(),
        offerStartDate: rentLeaseFormData.offerStartDate
          ? new Date(rentLeaseFormData.offerStartDate)
          : undefined,
        offerEndDate: rentLeaseFormData.offerEndDate
          ? new Date(rentLeaseFormData.offerEndDate)
          : undefined,
      });
    }
  }, [
    rentLeaseFormData,
    methods,
    hasApiRentalData,
    hasStoreRentalData,
    isLoadingPropertyDetail,
    isEffectivelyInEditMode,
    currentStep,
  ]);

  // Special useEffect for handling step navigation back - always populate from store data when available
  useEffect(() => {
    if (
      rentLeaseFormData &&
      !isLoadingPropertyDetail &&
      !hasApiRentalData &&
      hasStoreRentalData
    ) {
      // Always set the state values from store data when navigating
      setRentalType(rentLeaseFormData.rentalType || "monthly_billing");
      setAssignedTenant(rentLeaseFormData.assignedTenant || null);
      setHasSpecialOffer(rentLeaseFormData.promoteSpecialOffer || false);

      // Force form reset to ensure UI reflects the store data
      methods.reset({
        rentalType: rentLeaseFormData.rentalType || "monthly_billing",
        assignedTenant: rentLeaseFormData.assignedTenant || "",
        monthlyRent:
          rentLeaseFormData.rentalType === "monthly_billing"
            ? rentLeaseFormData.rent || undefined
            : undefined,
        semesterRent:
          rentLeaseFormData.rentalType === "semester_billing"
            ? rentLeaseFormData.rent || undefined
            : undefined,
        semester: rentLeaseFormData.semester || "",
        securityDeposit: rentLeaseFormData.securityDeposit || 0,
        hasSpecialOffer: rentLeaseFormData.promoteSpecialOffer || false,
        offerPercentage: rentLeaseFormData.offerPercentage || 0,
        leaseStartDate: rentLeaseFormData.leaseStartDate
          ? new Date(rentLeaseFormData.leaseStartDate)
          : new Date(),
        leaseEndDate: rentLeaseFormData.leaseEndDate
          ? new Date(rentLeaseFormData.leaseEndDate)
          : new Date(),
        offerStartDate: rentLeaseFormData.offerStartDate
          ? new Date(rentLeaseFormData.offerStartDate)
          : undefined,
        offerEndDate: rentLeaseFormData.offerEndDate
          ? new Date(rentLeaseFormData.offerEndDate)
          : undefined,
      });
    }
  }, [
    currentStep,
    rentLeaseFormData,
    methods,
    hasApiRentalData,
    hasStoreRentalData,
    isLoadingPropertyDetail,
  ]);

  useEffect(() => {
    if (assignedTenant) {
      // Disable and reset special offer if tenant is selected
      setValue("hasSpecialOffer", false);
      setValue("offerStartDate", undefined);
      setValue("offerEndDate", undefined);
      setValue("offerPercentage", undefined);
    }
  }, [assignedTenant, setValue]);

  useEffect(() => {
    if (hasSpecialOffer) {
      // Disable and reset tenant if special offer is selected
      setValue("assignedTenant", "");
      setAssignedTenant(null);
    }
  }, [hasSpecialOffer, setValue]);

  // Mock data for tenants - moved up to be available in useEffect
  const mockTenants = [
    {
      id: 1,
      value: "sarah-urban",
      name: "Sarah Urban",
      email: "sarah@email.com",
      phone: "+1234567890",
      leaseStatus: "Active",
    },
    {
      id: 2,
      value: "john-doe",
      name: "John Doe",
      email: "john@email.com",
      phone: "+1234567891",
      leaseStatus: "Expired",
    },
    {
      id: 3,
      value: "jane-smith",
      name: "Jane Smith",
      email: "jane@email.com",
      phone: "+1234567892",
      leaseStatus: "Renewal Pending",
    },
  ];

  const assignTenantOptions = mockTenants.map((tenant) => ({
    value: tenant.value,
    label: tenant.name,
  }));

  const onSubmit = (isSaveExit: boolean, data: FormData) => {
    if (!propertyId) {
      return;
    }

    const basePayload = {
      property: propertyId as number,
      unit: unitId as number | undefined,
      rental_type: data.rentalType,
      semester: data.semester ?? "",
      rent:
        data.rentalType === "monthly_billing"
          ? String(data.monthlyRent ?? "")
          : String(data.semesterRent ?? ""),
      security_deposit: String(data.securityDeposit ?? ""),
      page_saved: pageSaved,
    };

    // Conditionally add fields based on logic
    if (assignedTenant) {
      Object.assign(basePayload, {
        assigned_tenant: data.assignedTenant ?? "",

        lease_start_date: format(data.leaseStartDate as Date, "yyyy-MM-dd"),
        lease_end_date: format(data.leaseEndDate as Date, "yyyy-MM-dd"),
      });
    } else if (hasSpecialOffer) {
      Object.assign(basePayload, {
        promote_special_offer: !!data.hasSpecialOffer,

        offer_start_date: format(data.offerStartDate as Date, "yyyy-MM-dd"),
        offer_end_date: format(data.offerEndDate as Date, "yyyy-MM-dd"),
        offer_percentage: String(data.offerPercentage ?? ""),
      });
    }

    const mutationOptions = {
      onSuccess: (response: any) => {
        // Store the API response data in the store
        const responseData = response?.data || response;

        const storeData = {
          property: propertyId as number,
          rentalType: responseData?.rental_type || data.rentalType,
          securityDeposit:
            responseData?.security_deposit || data.securityDeposit,
          rent:
            responseData?.rent ||
            (data.rentalType === "monthly_billing"
              ? data.monthlyRent
              : data.semesterRent),
          semester: responseData?.semester || data.semester,
          assignedTenant: responseData?.assigned_tenant || data.assignedTenant,
          leaseStartDate:
            responseData?.lease_start_date ||
            (data.leaseStartDate
              ? format(data.leaseStartDate as Date, "yyyy-MM-dd")
              : ""),
          leaseEndDate:
            responseData?.lease_end_date ||
            (data.leaseEndDate
              ? format(data.leaseEndDate as Date, "yyyy-MM-dd")
              : ""),
          promoteSpecialOffer:
            responseData?.promote_special_offer || data.hasSpecialOffer,
          offerStartDate:
            responseData?.offer_start_date ||
            (data.offerStartDate
              ? format(data.offerStartDate as Date, "yyyy-MM-dd")
              : ""),
          offerEndDate:
            responseData?.offer_end_date ||
            (data.offerEndDate
              ? format(data.offerEndDate as Date, "yyyy-MM-dd")
              : ""),
          offerPercentage:
            responseData?.offer_percentage || data.offerPercentage,
          // Store raw API response for reference
          apiResponse: responseData,
        };

        if (isUnit) {
          updateUnitStepData("rentLease", storeData);
        } else {
          updateStepData("rentLease", storeData);
        }

        if (isSaveExit) {
          router.push("/my-properties");
        } else {
          if (isUnit) {
            markUnitStepCompleted(stepToMarkComplete);
            setCurrentUnitStep(nextCurrentStep);
          } else {
            markStepCompleted(stepToMarkComplete);
            setCurrentStep(nextCurrentStep);
          }
        }
      },
    };

    // Determine whether to call create or update API
    // Handle both property and unit update scenarios

    if (shouldUseUpdateEndpoint) {
      const updatePayload = {
        ...basePayload,
        propertyId: propertyId,
      };

      // For unit updates, ensure the unit ID is included
      if (isUnit && unitId) {
        updatePayload.unit = unitId as number | undefined;
      }

      updateRentalDetail(updatePayload, mutationOptions);
    } else {
      addRentalDetail(basePayload, mutationOptions);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Rent Details</h1>

      {/* Loading state */}
      {isLoadingPropertyDetail && propertyId && (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-600">Loading rental details...</div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit((data) => onSubmit(false, data))}
              className="space-y-4"
            >
              {rentalType === "semester_billing" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    name="rentalType"
                    label="Rental Type"
                    options={rentalTypeOptions}
                    placeholder="Select rental type"
                    required
                    select
                    onChange={(value) => {
                      setValue(
                        "rentalType",
                        value as "monthly_billing" | "semester_billing"
                      );
                      setRentalType(
                        value as "monthly_billing" | "semester_billing"
                      );
                      clearErrors("monthlyRent");
                      clearErrors("semesterRent");
                    }}
                  />
                  <CustomInput
                    name="semester"
                    select
                    label="Semester"
                    options={semesterOptions}
                    placeholder="Select"
                    required
                  />
                </div>
              ) : (
                <CustomInput
                  name="rentalType"
                  label="Rental Type"
                  options={rentalTypeOptions}
                  placeholder="Select rental type"
                  required
                  select
                  onChange={(value) => {
                    setValue(
                      "rentalType",
                      value as "monthly_billing" | "semester_billing"
                    );
                    setRentalType(
                      value as "monthly_billing" | "semester_billing"
                    );
                    clearErrors("monthlyRent");
                    clearErrors("semesterRent");
                  }}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rentalType === "monthly_billing" && (
                  <div>
                    <CustomInput
                      required
                      label="Monthly Rent"
                      placeholder="Enter Monthly Rent"
                      name="monthlyRent"
                      type="number"
                      prefix="$"
                    />
                  </div>
                )}

                {rentalType === "semester_billing" && (
                  <div>
                    <CustomInput
                      required
                      label="Semester Rent"
                      placeholder="Enter Semester Rent"
                      name="semesterRent"
                      type="number"
                      prefix="$"
                    />
                  </div>
                )}

                <div>
                  <CustomInput
                    label="Security Deposit"
                    placeholder="Enter Security Deposit"
                    name="securityDeposit"
                    type="number"
                    prefix="$"
                  />
                </div>
              </div>

              {/* Assign Tenant */}
              <div className="w-full">
                <Controller
                  name="assignedTenant"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <CustomSelect
                      label="Assigned Tenant"
                      value={field.value}
                      options={assignTenantOptions}
                      placeholder="Select tenant"
                      className="w-full"
                      onValueChange={(value) => {
                        field.onChange(value);
                        setAssignedTenant(value || null);
                        setValue("hasSpecialOffer", false);
                        setHasSpecialOffer(false);
                        // Clear lease date errors when tenant changes
                        clearErrors("leaseStartDate");
                        clearErrors("leaseEndDate");
                      }}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Lease Dates - Only show if tenant is assigned */}
              {assignedTenant && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow p-2.5 rounded-lg">
                  <div>
                    <CustomDatePicker
                      name="leaseStartDate"
                      label="Lease Start Date"
                      placeholder="Select"
                      required
                      clearButtonText="Save"
                    />
                  </div>

                  <div>
                    <CustomDatePicker
                      required
                      name="leaseEndDate"
                      label="Lease End Date"
                      placeholder="Select"
                    />
                  </div>
                </div>
              )}

              {/* Special Offer Toggle */}
              <div className="flex items-center justify-between space-x-2">
                <h2 className="">Do you want to promote a special offer?</h2>
                <Switch
                  id="offerSwitch"
                  onCheckedChange={(checked) => {
                    setValue("hasSpecialOffer", checked);
                    setHasSpecialOffer(checked);
                    if (!checked) {
                      setValue("offerPercentage", 0);
                      clearErrors("offerStartDate");
                      clearErrors("offerEndDate");
                      clearErrors("offerPercentage");
                    }
                  }}
                  checked={hasSpecialOffer}
                  // disabled={!!assignedTenant || !rentalType}
                />
              </div>

              {/* Special Offer Section */}
              {hasSpecialOffer && (
                <div className="bg-white shadow-lg p-2.5 rounded-lg w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4">
                    <CustomDatePicker
                      name="offerStartDate"
                      label="Offer Start Date"
                      placeholder="Select"
                      required
                    />

                    <CustomDatePicker
                      name="offerEndDate"
                      label="Offer End Date"
                      placeholder="Select"
                      required
                    />
                  </div>

                  {/* Offer Percentage */}
                  <div className="w-full">
                    <CustomInput
                      required
                      label="Offer Percentage"
                      placeholder="%"
                      name="offerPercentage"
                      type="number"
                      prefix="%"
                    />
                  </div>
                </div>
              )}

              {/* Buttons Row */}
              <div className="flex justify-between mt-6 w-full">
                <button
                  type="button"
                  className="lg:px-6 px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900 border border-gray-200 rounded-md font-semibold"
                  onClick={() => {
                    if (isUnit) {
                      setCurrentUnitStep(currentUnitStep - 1);
                    } else {
                      setCurrentStep(currentStep - 1);
                    }
                  }}
                >
                  Back
                </button>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={methods.handleSubmit((data) =>
                      onSubmit(true, data)
                    )}
                    disabled={isSubmitting}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 px-3"
                  >
                    Save & Exit
                  </Button>
                  <Button
                    type="submit"
                    className="lg:px-6 px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Next"}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default RentDetails;
