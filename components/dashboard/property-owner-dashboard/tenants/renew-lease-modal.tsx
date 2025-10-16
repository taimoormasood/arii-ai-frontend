"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import CustomDatePicker from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRenewLease } from "@/hooks/api/use-tenants";

import { renewLeaseSchema } from "./schema";

export type RenewLeaseFormType = z.infer<typeof renewLeaseSchema>;

interface RenewLeaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: any;
}

const RenewLeaseModal: React.FC<RenewLeaseModalProps> = ({
  open,
  onOpenChange,
  tenant,
}) => {
  const { mutate: renewLease, isPending } = useRenewLease();

  const methods = useForm<RenewLeaseFormType>({
    resolver: zodResolver(renewLeaseSchema),
    defaultValues: {
      rentAmount: undefined,
      securityDeposit: undefined,
      leaseStartDate: new Date(),
      leaseEndDate: new Date(),
      leaseDocument: null,
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: RenewLeaseFormType) => {
    try {
      const payload = {
        invitation_id: tenant?.id,
        action: "renew",
        lease_start_date: format(data.leaseStartDate, "yyyy-MM-dd"),
        lease_end_date: format(data.leaseEndDate, "yyyy-MM-dd"),
        rent_amount: data.rentAmount,
        security_deposit: data.securityDeposit,
        lease_agreement: data.leaseDocument,
      };

      renewLease(payload, {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      });
    } catch (error) {
      toast.error("Failed to renew lease. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Renew Lease</DialogTitle>
          <p className="text-sm text-gray-600">
            Enter rent details to renew lease for {tenant?.first_name}{" "}
            {tenant?.last_name}.
          </p>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Rent Amount */}
              <div className="space-y-2">
                <CustomInput
                  name="rentAmount"
                  label="Rent Amount"
                  placeholder="Enter monthly rent amount"
                  required
                  type="number"
                  prefix="$"
                />
              </div>

              {/* Security Deposit */}
              <div className="space-y-2">
                <CustomInput
                  name="securityDeposit"
                  label="Security Deposit"
                  placeholder="Enter security deposit"
                  type="number"
                  prefix="$"
                />
              </div>

              {/* Lease Start Date */}
              <div className="space-y-2">
                <CustomDatePicker
                  name="leaseStartDate"
                  label="Lease Start Date"
                  placeholder="Select start date"
                  required
                />
              </div>

              {/* Lease End Date */}
              <div className="space-y-2">
                <CustomDatePicker
                  name="leaseEndDate"
                  label="Lease End Date"
                  placeholder="Select end date"
                  required
                />
              </div>

              {/* Upload Lease Agreement Document */}
              <div className="col-span-2 space-y-2">
                <FormField
                  control={methods.control}
                  name="leaseDocument"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-gray-900 font-medium text-sm">
                        Upload Lease Agreement Document
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl className="p-0">
                        <div className="flex gap-3 mt-1 h-10 border-gray-200 bg-gray-100 rounded-lg relative p-0 w-full items-center border border-input py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <label
                            htmlFor="leaseDocument"
                            className="cursor-pointer bg-gray-500 block text-white rounded-tl-lg rounded-bl-lg py-2.5 px-2 text-sm font-medium"
                          >
                            Choose file
                          </label>
                          <input
                            id="leaseDocument"
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
                          />
                          <span className="text-sm text-gray-500 flex-1">
                            {value?.name || "No file chosen"}
                          </span>
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Format: JPG, JPEG, PNG, or PDF. Max size: 5MB. Required
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Renewing..." : "Renew Lease"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default RenewLeaseModal;
