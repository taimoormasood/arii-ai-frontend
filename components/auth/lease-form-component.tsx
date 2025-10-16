"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { BulkTemplateDownloadIcon } from "@/assets/icons";
import { leaseIcon } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const leaseAgreementSchema = z.object({
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the lease terms to continue",
  }),
  signedLeaseDocument: z
    .any()
    .optional()
    .refine(
      (file) => {
        return true;
      },
      {
        message: "Please upload the signed lease agreement",
      }
    ),
});

type LeaseAgreementComponentData = z.infer<typeof leaseAgreementSchema>;

const LeaseAgreementComponent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const methods = useForm<LeaseAgreementComponentData>({
    resolver: zodResolver(leaseAgreementSchema),
    defaultValues: {
      agreeToTerms: false,
      signedLeaseDocument: undefined,
    },
    mode: "onChange",
  });

  const agreeToTerms = methods.watch("agreeToTerms");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");

        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF, DOC, or DOCX file");

        return;
      }

      setUploadedFile(file);
      methods.setValue("signedLeaseDocument", file);
      methods.clearErrors("signedLeaseDocument");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    methods.setValue("signedLeaseDocument", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: LeaseAgreementComponentData) => {
    // Additional validation for uploaded file when terms are agreed
    if (data.agreeToTerms && !uploadedFile) {
      methods.setError("signedLeaseDocument", {
        message: "Please upload the signed lease agreement",
      });

      return;
    }
  };

  const isFormValid = agreeToTerms && uploadedFile;

  const handleDownload = () => {
    const vendorsTemplate = {
      url: "/invite-vendors-template.xlsx",
      filename: "invite-vendors-template.xlsx",
    };

    const template = vendorsTemplate || null;

    if (!template) return;

    const link = document.createElement("a");
    link.href = template.url;
    link.download = template.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-xl w-full mx-auto p-6 space-y-6">
      <h2 className="text-lg font-semibold">Lease Agreement</h2>

      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* Lease Document Preview */}
        <Card className="p-6 border border-gray-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="border border-gray-100 p-3 rounded-xl">
                <Image
                  src={leaseIcon.src}
                  alt="Lease Icon"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <p className="font-medium">Template.xlsx</p>
                <p className="text-sm text-muted-foreground">800.50 KB</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <BulkTemplateDownloadIcon />
            </Button>
          </div>
        </Card>

        {/* Agreement Checkbox */}
        <Controller
          name="agreeToTerms"
          control={methods.control}
          render={({ field }) => (
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-700 cursor-pointer"
              >
                I have reviewed and agreed to the lease terms.
              </label>
            </div>
          )}
        />
        {methods.formState.errors.agreeToTerms && (
          <span className="text-red-500 text-xs">
            {methods.formState.errors.agreeToTerms.message}
          </span>
        )}

        {/* Upload Section - Only show when checkbox is checked */}
        {agreeToTerms && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Upload Signed Lease Agreement
            </label>

            <div className="space-y-2">
              <div className="flex gap-3 mt-1 h-10 border-gray-200 bg-gray-100 rounded-lg relative p-0 w-full items-center border border-input py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer bg-gray-500 hover:bg-gray-400 block text-white rounded-tl-lg rounded-bl-lg py-2.5 px-2 text-sm font-medium"
                >
                  Choose file
                </Button>
                <span className="text-sm text-gray-500">
                  {uploadedFile ? uploadedFile.name : "No file chosen"}
                </span>
                {uploadedFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />

              <p className="text-xs text-gray-500">
                Supported formats: PDF, DOC, DOCX max 10MB
              </p>
            </div>

            {/* {methods.formState.errors.signedLeaseDocument && (
              <span className="text-red-500 text-xs">
                {methods.formState.errors.signedLeaseDocument.message}
              </span>
            )} */}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            disabled={!isFormValid}
            className={cn(
              "w-full disabled:hover:bg-gray-300",
              isFormValid
                ? "bg-primary-600 hover:bg-primary-700  text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            Continue to Payment
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaseAgreementComponent;
