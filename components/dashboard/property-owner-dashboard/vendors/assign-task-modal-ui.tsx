"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAssignTaskToVendor } from "@/hooks/api/use-vendors";

import { assignTaskSchema } from "./schema";

export type AssignTaskFormType = z.infer<typeof assignTaskSchema>;

interface AssignTaskModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export default function AssignTaskModal({
  open,
  onOpenChange,
}: AssignTaskModalProps) {
  const { mutate, isPending } = useAssignTaskToVendor();

  const methods = useForm<AssignTaskFormType>({
    resolver: zodResolver(assignTaskSchema),
    defaultValues: {
      vendor: "",
      task: "",
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: AssignTaskFormType) => {
    const payload = {
      vendorId: data.vendor,
      taskId: data.task,
    };
    mutate(payload, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[1056px] mx-auto">
        <DialogHeader className="border-b border-gray-200 py-4">
          <DialogTitle>Assign Task</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor */}
              <div>
                <CustomInput name="vendor" label="Vendor" required />
              </div>

              {/* Task */}
              <div>
                <CustomInput
                  name="task"
                  label="Task"
                  placeholder="Select task"
                  required
                  select
                  options={vendorTasks}
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
                {isPending ? "Submitting..." : "Assign"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

const vendorTasks = [
  { value: "task_1", label: "Task 1" },
  { value: "task_2", label: "Task 2" },
  { value: "task_3", label: "Task 3" },
  { value: "task_4", label: "Task 4" },
  { value: "task_5", label: "Task 5" },
];
