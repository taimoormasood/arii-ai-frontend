"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Download, Info, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BulkTemplateDownloadIcon } from "@/assets/icons";
import GrayDocumentIcon from "@/assets/icons/gray-document-icon";
import { alertSuccess, bulkDocumentIcon } from "@/assets/images";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBulkImportUnits } from "@/hooks/api/use-properties";
import type { BulkImportUnitsResponse } from "@/services/properties/types";
import { showModal } from "@/utils/modal-config";

import { UnitConfirmationModal } from "../add-property/property-types/common/unit-confirmation-modal";

interface UploadError {
  unit: string;
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
  const [unitErrors, setUnitErrors] = useState<UploadError[]>([]);
  const [generalError, setGeneralError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const propertyId = useMemo(() => Number(params?.id), [params]);
  const searchParams = useSearchParams();
  const propertyType = useMemo(
    () => searchParams.get("propertyType"),
    [searchParams]
  );

  const { mutate, isPending, isSuccess, data } = useBulkImportUnits();

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
    setUnitErrors([]);
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
    setUnitErrors([]);
    setGeneralError("");
    setSuccessMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (values: BulkImportFormValues) => {
    // Clear previous states
    setUnitErrors([]);
    setGeneralError("");
    setSuccessMessage("");

    mutate(
      { property: propertyId, file: values.file },
      {
        onSuccess: async (response: BulkImportUnitsResponse) => {
          if (Number(response.data.units_failed) === 0) {
            // setIsModalOpen(true);
            setIsModalOpen(false);
            setSuccessMessage("");
            setFilePreview(null);
            await showModal({
              title: "Bulk Import Completed",
              image: alertSuccess,
              onClose: () => router.push("/my-properties"),
              actions: [
                {
                  text: "Import More Units",
                  onClick: () => {
                    return (
                      router.push(
                        `/my-properties/bulk-import/${propertyId}?propertyType=${propertyType}`
                      ),
                      setSuccessMessage("")
                    );
                  },
                },
                {
                  text: "View Unit Lists",
                  onClick: () =>
                    router.push(
                      `/my-properties/unit-view/${propertyId}?propertyType=${propertyType}`
                    ),
                },
              ],
            });
          }

          // Set success message if available
          if (response.message) {
            setSuccessMessage(response.message);
          }

          // Check if data object has unit-specific errors
          if (
            response.data &&
            response.data.data &&
            Object.keys(response.data.data).length > 0
          ) {
            // Handle unit-specific errors from the data object
            const errors: UploadError[] = Object.entries(
              response.data.data
            ).map(([unit, message]) => ({
              unit,
              message,
            }));
            setUnitErrors(errors);
          }

          // Handle general error message (could be missing sheets, validation errors, etc.)
          if (response.error) {
            setGeneralError(response.error);
          }

          // If no message but there are unit errors, create a summary message
          if (
            !response.message &&
            Object.keys(
              response.data && response.data.data ? response.data.data : {}
            ).length > 0
          ) {
            const errorCount = Object.keys(
              response.data && response.data.data ? response.data.data : {}
            ).length;
            setSuccessMessage(`Import completed with ${errorCount} error(s)`);
          }
        },
        onError: (error: any) => {
          // Handle different types of errors
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
    const templateMap: Record<string, { url: string; filename: string }> = {
      multi_family: {
        url: "/multi-family-template.xlsx",
        filename: "Multi-Family-Template.xlsx",
      },
      student_housing: {
        url: "/student_housing-template.xlsx",
        filename: "Student-Housing-Template.xlsx",
      },
      apartment_unit: {
        url: "/apartment_template.xlsx",
        filename: "Apartment-Template.xlsx",
      },
      senior_living: {
        url: "/senior-living-template.xlsx",
        filename: "Senior-Living-Template.xlsx",
      },
      university_housing: {
        url: "/university-housing-template.xlsx",
        filename: "University-Housing-Template.xlsx",
      },
    };

    const template = propertyType ? templateMap[propertyType] : null;

    if (!template) return; // Optionally show an alert or toast for unsupported types

    const link = document.createElement("a");
    link.href = template.url;
    link.download = template.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadErrorReport = () => {
    if (unitErrors.length === 0) return;

    // Create error report content
    const errorContent = [
      "Unit Import Error Report",
      "=".repeat(30),
      "",
      ...unitErrors.map(
        (error, index) => `${index + 1}. ${error.unit}: ${error.message}`
      ),
      "",
      `Total Errors: ${unitErrors.length}`,
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
      <UnitConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actions={[
          {
            text: "Import More Units",
            variant: "outline",
            onClick: () => {
              router.push(`/my-properties/bulk-import/${propertyId}`);
              setSuccessMessage("");
              setUnitErrors([]);
              setFilePreview(null);
              setIsModalOpen(false);
            },
          },
          {
            text: "View Units List",
            variant: "default",
            onClick: () => {
              router.push(`/my-properties/unit-view/${propertyId}`);
              setIsModalOpen(false);
            },
          },
        ]}
      />
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
            <h2 className="text-xl font-semibold">Units</h2>
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
          {unitErrors.length > 0 && (
            <Alert variant="error" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">Unit Import Errors</p>
                    <div className="text-sm mt-2 space-y-1">
                      {unitErrors.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="font-medium text-red-700">
                            {error.unit}:
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
              onClick={() => router.push("/my-properties")}
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
