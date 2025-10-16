"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { id } from "zod/v4/locales";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import CustomDatePicker from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  GET_MONTH_AVAILABILITY,
  useAddAvailabilitySlots,
  useDeleteAvailabilitySlots,
} from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";

const schema = z.object({
  date: z.date(),
  reason: z.string().min(1, "Reason is required"),
});

type FormData = z.infer<typeof schema>;

export function AvailabilityDialog({
  open,
  onClose,
  date,
  reason = "", // Add reason prop with default empty string
  onSave, // Add onSave callback prop
}: {
  open: boolean;
  onClose: () => void;
  date: string;
  reason?: string; // Optional reason prop
  onSave?: (date: string, reason: string) => void; // Optional callback
}) {
  const parsedDate = date ? new Date(date) : new Date();

  const { getStepData, getUnitStepData } = usePropertyStore();

  const propertyId = getStepData("propertyInfo")?.id;
  const unitId = getUnitStepData("unitInfo")?.id;

  const { mutate, isPending } = useAddAvailabilitySlots();

  const queryClient = useQueryClient();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: parsedDate,
      reason: reason, // Use the passed reason
    },
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (date) {
      reset({
        date: new Date(date),
        reason: reason, // Pre-fill with existing reason
      });
    }
  }, [date, reason, reset]); // Add reason to dependency array

  const reasonOptions = [
    { label: "Security Inspection", value: "Security Inspection" },
    { label: "Maintenance Work", value: "Maintenance Work" },
    { label: "Cleaning Day", value: "Cleaning Day" },
    { label: "Compliance Inspection", value: "Compliance Inspection" },
    { label: "Renovation", value: "Renovation" },
    { label: "Utility Work", value: "Utility Work" },
    {
      label: "Owner Blocked for Personal Reasons",
      value: "Owner Blocked for Personal Reasons",
    },
    { label: "Documentation Hold", value: "Documentation Hold" },
    { label: "Other", value: "Other" },
  ];

  const onSubmit = (data: FormData) => {
    const year = data?.date.getFullYear();
    const month = String(data?.date.getMonth() + 1).padStart(2, "0");
    const day = String(data?.date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const payload = {
      unavailable_dates: [
        {
          date: formattedDate,
          reason: data.reason,
        },
      ],
      property: propertyId!,
      unit: unitId,
    };

    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: GET_MONTH_AVAILABILITY,
        });

        // Call the onSave callback to update parent component state
        if (onSave) {
          onSave(formattedDate, data.reason);
        }

        reset({
          date: new Date(date),
          reason: "",
        });
        onClose();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[450px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {reason
                ? "Edit Unavailability Reason"
                : "Add Reason for Unavailability"}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label className="text-gray-900">Selected Date</Label>
              <CustomDatePicker name="date" futureOnly={true} />
            </div>

            <div className="space-y-1">
              <CustomInput
                name="reason"
                label="Reason"
                select
                options={reasonOptions}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-gray-200"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-primary-600 text-white hover:bg-primary-700 rounded-lg"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {isPending ? "Saving..." : reason ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
