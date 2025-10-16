"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import CustomDatePicker from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PropertySelect from "@/components/ui/property-select";
import { useInviteTenant } from "@/hooks/api/use-tenants";

import { inviteTenantSchema } from "./schema";

export type InviteTenantFormType = z.infer<typeof inviteTenantSchema>;

interface InviteTenantModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export default function InvitationModal({
  open,
  onOpenChange,
}: InviteTenantModalProps) {
  const { mutate, isPending } = useInviteTenant();
  const [selectedProperty, setSelectedProperty] = useState<
    | {
        id: string;
        type: string;
      }
    | undefined
  >(undefined);

  const leaseDocumentRef = useRef<HTMLInputElement | null>(null);

  const methods = useForm<InviteTenantFormType>({
    resolver: zodResolver(inviteTenantSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      assign_property: "",
      lease_amount: undefined,
      security_deposit: undefined,
      lease_start_date: new Date(),
      lease_end_date: new Date(),
      lease_document: null,
      tenant_type: "",
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: InviteTenantFormType) => {
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      assignment_id: Number(data.assign_property),
      assignment_type: selectedProperty?.type || "",
      tenant_type: data.tenant_type || "individual",
      lease_amount: data.lease_amount,
      security_deposit: data.security_deposit,
      lease_start_date: format(data.lease_start_date as Date, "yyyy-MM-dd"),
      lease_end_date: format(data.lease_end_date as Date, "yyyy-MM-dd"),
      lease_agreement: data.lease_document,
    };
    mutate(payload, {
      onSuccess: () => {
        reset();
        setSelectedProperty(undefined);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[1056px] mx-auto">
        <DialogHeader className="border-b border-gray-200 py-4">
          <DialogTitle>Invite Tenant</DialogTitle>
          <DialogDescription>
            Enter tenant details to manage maintenance requests efficiently.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <CustomInput
                  name="first_name"
                  label="First Name"
                  placeholder="Enter first name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <CustomInput
                  name="last_name"
                  label="Last Name"
                  placeholder="Enter last name"
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

              {/* Assign Property */}
              <div>
                <Controller
                  name="assign_property"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <PropertySelect
                      label="Assign Property"
                      placeholder="Select"
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                      error={fieldState.error?.message}
                      disabled={isPending}
                      includePropertyData={true}
                      onPropertySelect={setSelectedProperty}
                    />
                  )}
                />
              </div>

              {/* Lease Amount */}
              <div>
                <CustomInput
                  name="lease_amount"
                  label="Lease Amount"
                  placeholder="Enter monthly rent amount"
                  required
                  type="number"
                  prefix="$"
                />
              </div>

              {/* Security Deposit */}
              <div>
                <CustomInput
                  name="security_deposit"
                  label="Security Deposit"
                  placeholder="Enter security deposit"
                  type="number"
                  prefix="$"
                />
              </div>

              {/* Lease Start Date */}
              <div>
                <CustomDatePicker
                  name="lease_start_date"
                  label="Lease Start Date"
                  placeholder="Select"
                  required
                  clearButtonText="Save"
                />
              </div>

              {/* Lease End Date */}
              <div>
                <CustomDatePicker
                  required
                  name="lease_end_date"
                  label="Lease End Date"
                  placeholder="Select"
                />
              </div>
              <div className="col-span-2">
                <CustomInput
                  name="tenant_type"
                  label="Tenant Type"
                  placeholder="Select"
                  select
                  required
                  options={[
                    { label: "Individual", value: "individual" },
                    { label: "Family", value: "family" },
                    { label: "Shared Housing", value: "shared_housing" },
                    { label: "Small Business", value: "small_business" },
                    { label: "Corporate Office", value: "corporate_office" },
                    { label: "Retail Store", value: "retail_store" },
                    { label: "Restaurant", value: "restaurant" },
                    { label: "Warehouse", value: "warehouse" },
                  ]}
                />
              </div>
              {/* Upload Lease Agreement Document */}
              <div className="col-span-2">
                <FormField
                  control={methods.control}
                  name="lease_document"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-gray-900 font-medium text-sm">
                        Upload Upload Lease Agreement Document
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl className="p-0">
                        <div className="flex gap-3 mt-1 h-10 border-gray-200 bg-gray-100 rounded-lg relative p-0 w-full items-center border border-input py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <label
                            htmlFor="lease_document"
                            className="cursor-pointer bg-gray-500 block text-white rounded-tl-lg rounded-bl-lg py-2.5 px-2 text-sm font-medium"
                          >
                            Choose file
                          </label>
                          <input
                            id="lease_document"
                            type="file"
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                              }
                            }}
                            {...fieldProps}
                            ref={leaseDocumentRef}
                          />
                          <span className="text-sm text-gray-500 truncate flex-1">
                            {methods.watch("lease_document")?.name
                              ? methods.watch("lease_document")!.name.length >
                                20
                                ? methods
                                    .watch("lease_document")!
                                    .name.slice(0, 20) + "..."
                                : methods.watch("lease_document")!.name
                              : "No file chosen"}
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Type: File Upload, Format: JPG, PNG, PDF, Max size: 5MB,
                        Required
                      </FormDescription>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                {isPending ? "Inviting..." : "Invite"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
