"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { alertSuccess } from "@/assets/images";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { errorHandler } from "@/helpers/error-handler";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/lib/contexts/auth-context";
import { verifyKyc } from "@/services/auth/auth.service";
import { showModal } from "@/utils/modal-config";

// Allowed file types and max size
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Create a more robust file schema that handles undefined values
const fileSchema = z
  .any()
  .refine(
    (file) => {
      if (!file) return false;

      return file instanceof File;
    },
    {
      message: "Please select a file",
    }
  )
  .refine(
    (file) => {
      if (!file || !(file instanceof File)) return false;

      return file.size <= MAX_FILE_SIZE;
    },
    {
      message: `File size must be less than 5MB`,
    }
  )
  .refine(
    (file) => {
      if (!file || !(file instanceof File)) return false;

      return ACCEPTED_FILE_TYPES.includes(file.type);
    },
    {
      message: `File must be JPG, PNG, or PDF`,
    }
  );

// Optional file schema for back image
const optionalFileSchema = z
  .any()
  .optional()
  .refine(
    (file) => {
      if (!file) return true;

      return file instanceof File;
    },
    {
      message: "Invalid file",
    }
  )
  .refine(
    (file) => {
      if (!file || !(file instanceof File)) return true;

      return file.size <= MAX_FILE_SIZE;
    },
    {
      message: `File size must be less than 5MB`,
    }
  )
  .refine(
    (file) => {
      if (!file || !(file instanceof File)) return true;

      return ACCEPTED_FILE_TYPES.includes(file.type);
    },
    {
      message: `File must be JPG, PNG, or PDF`,
    }
  );

const createFormSchema = (idType: string | null) => {
  const baseSchema = {
    idType: z.string({
      required_error: "Please select an ID type",
    }),
    notes: z.string().optional(),
  };

  if (idType === "passport") {
    // Only front image required for passport
    return z.object({
      ...baseSchema,
      frontImage: fileSchema,
      // Don't include backImage in schema for passport
    });
  } else if (idType === "cnic" || idType === "driving_license") {
    // Both images required for CNIC and Driving License
    return z.object({
      ...baseSchema,
      frontImage: fileSchema,
      backImage: fileSchema,
    });
  }

  // Default schema when no ID type is selected
  return z.object({
    ...baseSchema,
    frontImage: optionalFileSchema,
    backImage: optionalFileSchema,
  });
};

export function KycComponent({
  onKycSubmitted,
}: { onKycSubmitted?: () => void } = {}) {
  const searchParams = useSearchParams();
  const [idType, setIdType] = useState<string | null>("cnic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isResubmitMode = searchParams.get("action") === "resubmit";

  const { updateUser, user, userLoading } = useAuth();
  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  type KycFormFields = {
    idType: string;
    notes?: string;
    frontImage?: File;
    backImage?: File;
  };

  const form = useForm<KycFormFields>({
    resolver: zodResolver(createFormSchema(idType)),
    mode: "onChange",
    defaultValues: {
      notes: "",
      idType: "cnic",
    },
  });

  // kyc-component.tsx
  const onSubmit = async (
    values: z.infer<ReturnType<typeof createFormSchema>>
  ) => {
    setIsSubmitting(true);

    try {
      const verifyKycPayload: any = {
        id_type: values.idType,
        notes: values.notes || "",
      };

      if ("frontImage" in values && values.frontImage) {
        verifyKycPayload.front_image = values.frontImage;
      }

      if (
        values.idType !== "passport" &&
        "backImage" in values &&
        values.backImage
      ) {
        verifyKycPayload.back_image = values.backImage;
      }

      const response = await verifyKyc(verifyKycPayload);
      if (response?.success) {
        const res = await axiosInstance.get("/user-details");
        const user = res.data;
        const userData = JSON.stringify(user?.data);
        const parsedData = JSON.parse(userData);
        await updateUser(parsedData);

        if (onKycSubmitted) onKycSubmitted();

        const currentRole = searchParams.get("role") || "property-manager"; // Preserve the current role
        await showModal({
          title: "Your documents have been submitted.",
          subtitle:
            "Your account is pending verification. You will be notified once your KYC is approved.",
          image: alertSuccess,
          onClose: () =>
            router.push(
              `/universal-dashboard?role=${currentRole}&view=profile-setup`
            ),
          actions: [
            {
              text: "Continue",
              onClick: () =>
                router.push(
                  `/universal-dashboard?role=${currentRole}&view=profile-setup`
                ),
            },
          ],
        });
      }

      setIdType(null);
    } catch (error) {
      toast.error(errorHandler(error));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdTypeChange = (value: string) => {
    setIdType(value);
    form.setValue("idType", value);

    // Reset file fields when ID type changes
    form.resetField("frontImage");
    form.resetField("backImage");

    // Clear actual file input values
    if (frontInputRef.current) frontInputRef.current.value = "";
    if (backInputRef.current) backInputRef.current.value = "";

    // Clear any existing validation errors
    form.clearErrors();
  };

  return (
    <div className="flex flex-col bg-white w-full">
      <main className="flex-1 flex  bg-gray-50 w-full">
        <div className="w-full  bg-white p-6 rounded-md">
          {isResubmitMode && (
            <Alert variant={"error"} className="mb-4">
              <AlertTitle variant="error">
                Your KYC verification was not approved
              </AlertTitle>
              <AlertDescription>
                Reason:{" "}
                {user?.kyc_request?.review_notes
                  ? user?.kyc_request?.review_notes
                  : "Please use valid documents"}
                <h3 className="">
                  Submitted on:{" "}
                  {user?.kyc_request?.created_at
                    ? format(user.kyc_request.created_at, "MM/dd/yyyy")
                    : ""}
                </h3>
              </AlertDescription>
            </Alert>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Verify KYC
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              noValidate
            >
              <FormField
                control={form.control}
                name="idType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-900 font-medium text-sm">
                      ID Type <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <div className="relative flex-1 w-full">
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleIdTypeChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-100 shadow-none outline-0 h-auto focus:ring-0 focus:ring-offset-0 ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center text-sm text-gray-800">
                              <SelectValue placeholder="Select" />
                            </div>
                          </div>
                        </SelectTrigger>
                        <SelectContent className="z-[99999] bg-white border-none">
                          <SelectItem value="cnic">CNIC</SelectItem>
                          <SelectItem value="driving_license">
                            Driving License
                          </SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {idType && (
                <FormField
                  control={form.control}
                  name="frontImage"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-gray-900 font-medium text-sm">
                        Upload{" "}
                        {idType === "passport"
                          ? "Passport"
                          : idType === "cnic"
                            ? "CNIC/National ID Front Image"
                            : "Driving License Front Image"}{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl className="p-0">
                        <div className="flex gap-3 mt-1 h-10 border-gray-200 bg-gray-100 rounded-lg relative p-0 w-full items-center border border-input py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <label
                            htmlFor="frontImage"
                            className="cursor-pointer bg-gray-500 block text-white rounded-tl-lg rounded-bl-lg py-2.5 px-2 text-sm font-medium"
                          >
                            Choose file
                          </label>
                          <input
                            id="frontImage"
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
                            ref={frontInputRef}
                          />
                          <span className="text-sm text-gray-500 truncate flex-1">
                            {form.watch("frontImage")?.name
                              ? form.watch("frontImage")!.name.length > 20
                                ? form.watch("frontImage")!.name.slice(0, 20) +
                                  "..."
                                : form.watch("frontImage")!.name
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
              )}

              {(idType === "cnic" || idType === "driving_license") && (
                <FormField
                  control={form.control}
                  name="backImage"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-gray-900 font-medium text-sm">
                        Upload{" "}
                        {idType === "cnic"
                          ? "CNIC/National ID Back Image"
                          : "Driving License Back Image"}{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl className="p-0">
                        <div className="flex gap-3 mt-1 h-10 border-gray-200 bg-gray-100 rounded-lg relative p-0 w-full items-center border border-input py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <label
                            htmlFor="backImage"
                            className="cursor-pointer bg-gray-500 block text-white rounded-tl-lg rounded-bl-lg py-2.5 px-2 text-sm font-medium"
                          >
                            Choose file
                          </label>
                          <input
                            id="backImage"
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
                            ref={backInputRef}
                          />
                          <span className="text-sm text-gray-500 truncate flex-1">
                            {form.watch("backImage")?.name
                              ? form.watch("backImage")!.name.length > 20
                                ? form.watch("backImage")!.name.slice(0, 20) +
                                  "..."
                                : form.watch("backImage")!.name
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
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium text-sm">
                      Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes"
                        className="p-2 border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-100 shadow-none outline-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <Button
                className="bg-primary-500 hover:bg-primary-700 text-white w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isResubmitMode
                    ? "Resubmit for Verification"
                    : "Submit for Verification"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
