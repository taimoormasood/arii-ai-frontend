"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Download, Info, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BulkTemplateDownloadIcon } from "@/assets/icons";
import GrayDocumentIcon from "@/assets/icons/gray-document-icon";
import { alertSuccess, bulkDocumentIcon } from "@/assets/images";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBulkImportVendors } from "@/hooks/api/use-vendors";
import type { BulkImportVendorsResponse } from "@/services/vendor/types";
import { showModal } from "@/utils/modal-config";

interface UploadError {
  vendor: string;
  message: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const bulkImportSchema = z.object({
  file: z
    .instanceof(File, { message: "Please select a valid file" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 10MB",
    })
    .refine(
      (file) =>
        ACCEPTED_FILE_TYPES.includes(file.type) || /\.(xlsx)$/i.test(file.name),
      {
        message: "Only XLSX files are allowed",
      }
    ),
});

type BulkImportFormValues = z.infer<typeof bulkImportSchema>;

export default function FileUploadInterface() {
  const [vendorErrors, setVendorErrors] = useState<UploadError[]>([]);
  const [generalError, setGeneralError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const router = useRouter();

  const { mutate, isPending } = useBulkImportVendors();

  const form = useForm<BulkImportFormValues>({
    resolver: zodResolver(bulkImportSchema),
    mode: "onChange",
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Process the file
    form.setValue("file", file, { shouldValidate: true });
    setFilePreview(file.name);

    // Clear previous errors and messages
    setVendorErrors([]);
    setGeneralError("");
    setSuccessMessage("");

    // Now reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const removeFile = () => {
    form.setValue("file", null as unknown as File);
    setFilePreview(null);
    setVendorErrors([]);
    setGeneralError("");
    setSuccessMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (values: BulkImportFormValues) => {
    // Clear previous states
    setVendorErrors([]);
    setGeneralError("");
    setSuccessMessage("");

    mutate(
      { file: values.file },
      {
        onSuccess: async (response: BulkImportVendorsResponse) => {
          if (
            response.success &&
            (!response.error || response.error.length === 0)
          ) {
            setSuccessMessage("");
            setFilePreview(null);
            await showModal({
              title: "Vendors Imported Successfully",
              image: alertSuccess,
              onClose: () => router.push(`/vendors?tab=invited`),
              actions: [
                {
                  text: "Continue",
                  onClick: () => router.push(`/vendors?tab=invited`),
                },
              ],
            });
          }

          if (response.message) {
            setSuccessMessage(response.message);
          }

          if (response.error && response.error.length > 0) {
            const errors: UploadError[] = response.error.map(
              (message, index) => ({
                vendor: `Vendor ${index + 1}`,
                message,
              })
            );
            setVendorErrors(errors);
          }
        },
        onError: (error: any) => {
          if (error.response?.data?.message) {
            setGeneralError(error.response.data.message);
          } else if (error.message) {
            setGeneralError(error.message);
          } else if (error.error) {
            setGeneralError(error.error || "Error");
          } else {
            setGeneralError("An unexpected error occurred during upload");
          }
        },
      }
    );
  };

  const handleDownload = () => {
    const vendorsTemplate = {
      url: "/invite-vendors-template.xlsx",
      filename: "invite-vendors-template.xlsx",
    };

    const template = vendorsTemplate || null;

    if (!template) return; // Optionally show an alert or toast for unsupported types

    const link = document.createElement("a");
    link.href = template.url;
    link.download = template.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadErrorReport = () => {
    if (vendorErrors.length === 0) return;

    // Create error report content
    const errorContent = [
      "Vendor Import Error Report",
      "=".repeat(30),
      "",
      ...vendorErrors.map(
        (error, index) => `${index + 1}. ${error.vendor}: ${error.message}`
      ),
      "",
      `Total Errors: ${vendorErrors.length}`,
      `Generated: ${new Date().toLocaleString()}`,
    ].join("\n");

    // Create and download the file
    const blob = new Blob([errorContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "unit-import-errors.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Template Download Section */}
      <div className="space-y-4 bg-white">
        <Card className="p-6 border border-gray-100 rounded-xl">
          <p className="text-lg font-medium mb-5">
            Please download and use the template before uploading your file.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="border border-gray-100 p-3 rounded-xl">
                <GrayDocumentIcon className="h-6 w-6" />
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
      </div>

      {/* Upload Section */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 bg-white rounded-xl p-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Vendors</h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-medium">Upload File</span>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragOver
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx"
                onChange={handleFileInputChange}
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <Image
                    src={bulkDocumentIcon || "/placeholder.svg"}
                    alt="Bulk Document Icon"
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="">Choose file to upload</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Download Template{" "}
                    <span className="text-blue-600">{`(XLSX • Max 10MB)`}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Drag and drop your XLSX file here, or{" "}
                    <span className="text-primary font-medium">
                      Select File to upload
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {form.formState.errors.file && (
              <div className="text-sm text-red-500 mt-2">
                {form.formState.errors.file.message}
              </div>
            )}
          </div>

          {/* Uploaded Files Preview */}
          {filePreview && (
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="border border-gray-100 p-3 rounded-xl">
                    <GrayDocumentIcon className="h-6 w-6" />
                  </div>{" "}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {form.watch("file")?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(form.watch("file")?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <Info className="h-4 w-4 text-primary-600" />
              <AlertDescription className="text-primary-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* General Error Message */}
          {generalError && (
            <Alert variant="error" className="mt-4 border boder-red-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium">Upload Error</p>
                <p className="text-sm mt-1">{generalError}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Unit-Specific Errors */}
          {vendorErrors.length > 0 && (
            <Alert variant="error" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">Vendor Import Errors</p>
                    <div className="text-sm mt-2 space-y-1">
                      {vendorErrors.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="font-medium text-red-700">
                            {error.vendor}:
                          </span>
                          <span>{error.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={downloadErrorReport}
                    className="ml-4 flex-shrink-0"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 items-end justify-end">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/vendors")}
              disabled={isPending}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 px-3 bg-transparent"
            >
              Cancel Import
            </Button>
            <Button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8"
              disabled={isPending || !form.watch("file")}
            >
              {isPending ? "Uploading..." : "Import"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
