"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetVendorRoles, useInviteVendor } from "@/hooks/api/use-vendors";

import { inviteVendorSchema } from "./schema";

export type InviteVendorFormType = z.infer<typeof inviteVendorSchema>;

interface InviteVendorModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export default function InvitationModal({
  open,
  onOpenChange,
}: InviteVendorModalProps) {
  const { mutate, isPending } = useInviteVendor();

  const { data } = useGetVendorRoles();

  const router = useRouter();

  const vendorRoles = data?.data?.map((role) => ({
    value: role.value,
    label: role.label,
  }));

  const methods = useForm<InviteVendorFormType>({
    resolver: zodResolver(inviteVendorSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "",
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: InviteVendorFormType) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
        router.push("/vendors?tab=invited");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[1056px] mx-auto">
        <DialogHeader className="border-b border-gray-200 py-4">
          <DialogTitle>Invite Vendor</DialogTitle>
          <DialogDescription>
            Streamline your property management by inviting trusted vendors to
            join. Easily connect, manage tasks, and process payments—all in one
            place.
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

              {/* Vendor Role */}
              <div>
                <CustomInput
                  name="role"
                  label="Vendor Role"
                  placeholder="Select"
                  options={vendorRoles}
                  required
                  select
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
                {isPending ? "Sending" : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

// Vendor role options
const vendorRoleOptions = [
  { value: "personal_training", label: "Personal Training" },
  { value: "home_cleaning", label: "Home Cleaning" },
  { value: "personal_chef", label: "Personal Chef" },
  { value: "yoga_instruction", label: "Yoga Instruction" },
  { value: "plumbing_services", label: "Plumbing Services" },
  { value: "electrical_services", label: "Electrical Services" },
  { value: "hvac_technician", label: "HVAC Technician" },
  { value: "landscaping", label: "Landscaping" },
  { value: "pest_control", label: "Pest Control" },
  { value: "appliance_repair", label: "Appliance Repair" },
  { value: "security_services", label: "Security Services" },
  { value: "painting_renovation", label: "Painting & Renovation" },
  { value: "general_handyman", label: "General Handyman" },
  { value: "moving_services", label: "Moving Services" },
  { value: "it_network_setup", label: "IT & Network Setup" },
  { value: "furniture_assembly", label: "Furniture Assembly" },
  { value: "window_cleaning", label: "Window Cleaning" },
  { value: "pool_maintenance", label: "Pool Maintenance" },
  { value: "carpet_cleaning", label: "Carpet Cleaning" },
  { value: "elderly_care_services", label: "Elderly Care Services" },
];
