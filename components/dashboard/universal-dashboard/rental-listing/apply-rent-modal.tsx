"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/ui/custom-input";
import CustomPhoneInput from "@/components/ui/custom-phone-input";
import CustomRadioGroup from "@/components/ui/custom-radio-group";
import CustomTextarea from "@/components/ui/custom-textarea";
import CustomDatePicker from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubmitRentalApplication } from "@/hooks/api/use-tenants";
import { useAuth } from "@/lib/contexts/auth-context";

import { ApplyRentFormType, applyRentSchema } from "./schema";

interface ApplyRentModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export default function ApplyRentModal({
  open,
  onOpenChange,
}: ApplyRentModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: submitApplication, isPending } = useSubmitRentalApplication();

  const propertyId = searchParams.get("propertyId");
  const unitId = searchParams.get("unitId");

  const fullName = user?.user?.first_name
    ? `${user.user.first_name} ${user.user.last_name}`
    : "";

  const methods = useForm<ApplyRentFormType>({
    resolver: zodResolver(applyRentSchema),
    defaultValues: {
      applying_for: "myself",
      full_name: fullName || "",
      phone: user?.user?.phone_number || "",
      email: user?.user?.email || "",
      current_address: "",
      check_in_date: new Date(),
      check_out_date: new Date(),
      special_requirements: "",
      applicant_full_name: "",
      relation: "",
      applicant_phone_number: "",
      applicant_email: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: ApplyRentFormType) => {
    const payload = {
      property: propertyId ? parseInt(propertyId, 10) : 0,
      ...(unitId && { unit: parseInt(unitId, 10) }),
      application_type: (data.applying_for === "myself"
        ? "self"
        : "someone_else") as "self" | "someone_else",
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      current_address: data.current_address || "",
      check_in_date: data.check_in_date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      check_out_date: data.check_out_date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      special_requirements: data.special_requirements || "",
      ...(data.applying_for === "someone_else" && {
        tenant_email: data.applicant_email || "",
        tenant_phone: data.applicant_phone_number || "",
        relationship_to_tenant: data.relation || "",
      }),
    };

    submitApplication(payload, {
      onSuccess: () => {
        onOpenChange(false);
        router.push("/universal-dashboard/rental-listing");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[1056px] mx-auto">
        <DialogHeader className="border-b border-gray-200 py-4">
          <DialogTitle>Apply for Rent</DialogTitle>
          <DialogDescription>
            Fill the form below to apply for rent
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Applying For */}
              <div className="col-span-2">
                <CustomRadioGroup
                  name="applying_for"
                  label="Are you applying for yourself or someone else?"
                  options={[
                    {
                      label: "I'm applying for myself",
                      value: "myself",
                    },
                    {
                      label: "I'm applying for someone else",
                      value: "someone_else",
                    },
                  ]}
                  direction="column"
                />
              </div>

              {/* Full Name */}
              <div>
                <CustomInput
                  name="full_name"
                  label="Full Name"
                  placeholder="Enter full name"
                  required
                />
              </div>
              {/* Phone Number */}
              <div>
                <CustomPhoneInput
                  name="phone"
                  label="Phone"
                  placeholder="123-456-7890"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <CustomInput
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                  type="email"
                  required
                />
              </div>

              {/* Current Address */}
              <div>
                <CustomInput
                  name="current_address"
                  label="Current Address"
                  placeholder="Enter address"
                />
              </div>

              {/* for someone else fields */}
              {methods.watch("applying_for") === "someone_else" && (
                <React.Fragment>
                  <CustomInput
                    name="applicant_full_name"
                    label="Full Name of Applicant"
                    placeholder="Enter full name"
                    required
                  />
                  <CustomInput
                    name="relation"
                    label="Relationship to You"
                    placeholder="Select"
                    select
                    options={relationData}
                    required
                  />
                  <CustomPhoneInput
                    name="applicant_phone_number"
                    label="Applicant's Phone Number"
                    placeholder="123-456-7890"
                    required
                  />
                  <CustomInput
                    name="applicant_email"
                    label="Applicant's Email Address"
                    placeholder="Enter email"
                    type="email"
                  />
                </React.Fragment>
              )}

              {/* Check In Date */}
              <div>
                <CustomDatePicker
                  name="check_in_date"
                  label="Check-in Date"
                  placeholder="Select"
                  required
                />
              </div>

              {/* Check Out Date */}
              <div>
                <CustomDatePicker
                  required
                  name="check_out_date"
                  label="Check-out Date"
                  placeholder="Select"
                />
              </div>
              <div className="col-span-2">
                <CustomTextarea
                  name="special_requirements"
                  label="Special Requirements or Notes"
                  placeholder="Describe special requirements..."
                  rows={4}
                />
              </div>
              <div className="col-span-2">
                <Controller
                  name="agreeToTerms"
                  control={methods.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeToTerms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="agreeToTerms"
                          className="text-sm leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="text-primary-600"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            terms and conditions
                          </Link>{" "}
                          of applying for this property.{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {methods.formState.errors.agreeToTerms && (
                        <span className="text-red-500 text-sm">
                          {methods.formState.errors.agreeToTerms.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-6 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                className="border border-gray-200"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white"
                disabled={isPending}
                onClick={() => methods.handleSubmit(onSubmit)()}
              >
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

const relationData = [
  { label: "Parent", value: "parent" },
  { label: "Child", value: "child" },
  { label: "Spouse", value: "spouse" },
  { label: "Friend", value: "friend" },
  { label: "Grandmother", value: "grandmother" },
  { label: "Grandfather", value: "grandfather" },
  { label: "Other", value: "other" },
];
