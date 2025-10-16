"use client";

import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

import { BlueDocumentIcon } from "@/assets/icons";
import GreenImageFileIcon from "@/assets/icons/green-image-file-icon";
import { alertSuccess } from "@/assets/images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { errorHandler } from "@/helpers";
import {
  useAddPropertyDocument,
  useGetDocumentTypes,
  useGetPropertyDetail,
} from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import {
  publishProperty,
  publishUnit,
} from "@/services/properties/properties.service";
import type { PropertyDocumentBody } from "@/services/properties/types";
import { showModal } from "@/utils/modal-config";

import { DocumentForm } from "../property-types/common/document-form";
import { UnitConfirmationModal } from "../property-types/common/unit-confirmation-modal";

// Create dynamic schema based on available document types
const createDocumentSchema = (documentTypes: string[]) => {
  return z.object({
    title: z.string().min(1, "Document title is required"),
    type: z.enum(documentTypes as [string, ...string[]], {
      errorMap: () => ({ message: "Document type is required" }),
    }),
    visibility: z.enum(["private", "shared"]).default("private"),
  });
};

export type DocumentFormValues = {
  id?: number;
  title: string;
  type: string;
  visibility: "private" | "shared";
};

// Define the file type and size constraints
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const FILE_TYPE_MAP: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
};

// Helper function to transform document types for display
const formatDocumentTypeForDisplay = (type: string) => {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l: string) => l.toUpperCase());
};

type UploadedDocument = {
  id: string;
  documentId?: number; // API document ID for existing documents
  file: File | null; // null for existing documents
  metadata: DocumentFormValues;
  isExpanded: boolean;
  existingDocumentUrl?: string; // URL for existing documents
  isExisting?: boolean; // Flag to identify existing documents
};

interface AddDocumentProps {
  pageSaved: number;
  isUnit?: boolean;
  stepToMarkComplete?: number;
}

export default function AddDocument({
  pageSaved = 6,
  stepToMarkComplete = 5,
  isUnit = false,
}: AddDocumentProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [documentsValidationError, setDocumentsValidationError] = useState<
    string | null
  >(null);
  const [isUnitModal, setIsUnitModal] = useState(false);
  const [isSecondUnitModal, setIsSecondUnitModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    selectedPropertyType,
    getStepData,
    updateStepData,
    currentStep,
    setCurrentStep,
    markStepCompleted,
    markUnitStepCompleted,
    getUnitStepData,
    clearAllUnitFormData,
    clearAllFormData,
    setCurrentUnitStep,
    isEditMode,
    editingPropertyId,
    currentUnitStep,
  } = usePropertyStore();

  const searchParams = useSearchParams();

  const searchedUnitId = searchParams.get("unitId");

  // Get property ID - prioritize editingPropertyId, then store data
  const storePropertyId = getStepData("propertyInfo")?.id;
  const propertyId = editingPropertyId || storePropertyId;
  const { propertyType } = useParams();

  const unitId = isUnit
    ? getUnitStepData("unitInfo")?.id
    : searchedUnitId
      ? searchedUnitId
      : undefined;

  const { mutate: addPropertyDocument, isPending } = useAddPropertyDocument();
  const { data, isLoading } = useGetDocumentTypes(propertyId!);

  // Fetch property details when we have a property ID
  const { data: propertyDetailResponse, isLoading: isLoadingPropertyDetail } =
    useGetPropertyDetail(propertyId || 0);
  const propertyData = propertyDetailResponse?.data;

  const allUnits = (propertyData as any)?.units || [];
  const currentUnitData = unitId
    ? allUnits.find(
        (unit: any) => unit.detail.id === parseInt(unitId as string)
      )
    : null;

  // Extract documents from property detail response
  const apiDocuments = isUnit
    ? (currentUnitData as any)?.documents
    : (propertyData as any)?.documents;

  // For now, use edit mode as indicator for existing documents
  // In a real implementation, you might use a separate documents API
  const hasExistingDocumentData = isEditMode && propertyId;

  // Get available document types from API
  const documentTypes = data?.data || [];

  // Load existing documents from API in edit mode
  useEffect(() => {
    if (isEditMode && apiDocuments && apiDocuments.length > 0 && propertyId) {
      const transformedDocuments: UploadedDocument[] = apiDocuments.map(
        (doc: any) => {
          return {
            id: crypto.randomUUID(),
            documentId: doc.id, // Store API document ID separately for clarity
            file: null, // No file for existing documents
            metadata: {
              id: doc.id, // Keep original API document ID
              title: doc.title,
              type: doc.document_type, // Keep original snake_case format for consistency
              visibility: doc.visibility as "private" | "shared",
            },
            isExpanded: false,
            isExisting: true, // Flag to identify existing documents
          };
        }
      );

      // Update the store with API response data
      updateStepData("documents", {
        property: propertyId,
        page_saved: pageSaved,
        documents: [],
        data: {
          data: apiDocuments,
        },
      } as any);

      // Set both the documents state and existing documents for payload
      setDocuments(transformedDocuments);
      setExistingDocuments(apiDocuments);
    }
  }, [isEditMode, apiDocuments, propertyId, updateStepData, pageSaved]);

  // Load existing documents from store data (fallback for cases without fresh API data)
  useEffect(() => {
    if (isEditMode && documents.length === 0 && !apiDocuments) {
      const existingDocuments = getStepData("documents");

      if (existingDocuments?.data?.data) {
        const transformedDocuments: UploadedDocument[] =
          existingDocuments.data.data.map((doc: any) => {
            return {
              id: crypto.randomUUID(),
              documentId: doc.id, // Store API document ID separately for clarity
              file: null, // No file for existing documents
              metadata: {
                id: doc.id, // Keep original API document ID
                title: doc.title,
                type: doc.document_type, // Keep original snake_case format for consistency
                visibility: doc.visibility as "private" | "shared",
              },
              isExpanded: false,
              isExisting: true, // Flag to identify existing documents
            };
          });

        setDocuments(transformedDocuments);
        setExistingDocuments(existingDocuments.data.data);
      }
    }
  }, [isEditMode, documents.length, getStepData, apiDocuments]);

  // Get used document types to filter out already selected ones (excluding 'other')
  const usedDocumentTypes = useMemo(() => {
    return documents
      .map((doc) => doc.metadata.type)
      .filter((type) => type !== "other"); // Don't include 'other' in used types
  }, [documents]);

  // Get available document types for new documents
  const availableDocumentTypes = useMemo(() => {
    // Always use API document types as the base (both edit and add mode)
    if (!documentTypes.length) return [];

    // For editing, allow the current document type even if it's used elsewhere
    const currentEditingType = editingDocId
      ? documents.find((doc) => doc.id === editingDocId)?.metadata.type
      : null;

    let filteredTypes = documentTypes.filter((type) => {
      // Always allow 'other' type
      if (type === "other") return true;

      // If editing, allow the current document's type
      if (editingDocId && type === currentEditingType) return true;

      // Otherwise, only allow unused types
      return !usedDocumentTypes.includes(type);
    });

    // In edit mode, if the current editing type is not in the API document types,
    // we need to add it to allow editing existing documents
    if (
      isEditMode &&
      currentEditingType &&
      !documentTypes.includes(currentEditingType)
    ) {
      filteredTypes = [...filteredTypes, currentEditingType];
    }

    return filteredTypes;
  }, [isEditMode, documentTypes, usedDocumentTypes, editingDocId, documents]);

  // Transform available document types for DocumentForm (ensure they match expected format)
  const transformedAvailableDocumentTypes = useMemo(() => {
    // Since availableDocumentTypes now handles the current editing type,
    // we just need to ensure the format is correct
    return availableDocumentTypes.map((type) => {
      // All types are already in the correct snake_case format
      return type;
    });
  }, [availableDocumentTypes]);

  // Compute disabled types for the dropdown (used types except 'other' and current editing type)
  const disabledDocumentTypes = useMemo(() => {
    // In both edit and add mode, we use consistent logic
    const currentEditingType = editingDocId
      ? documents.find((doc) => doc.id === editingDocId)?.metadata.type
      : null;

    return documentTypes.reduce<string[]>((acc, type) => {
      // Never disable 'other'
      if (type === "other") return acc;

      // Don't disable the type currently being edited
      if (editingDocId && type === currentEditingType) return acc;

      // Disable if type is already used
      if (usedDocumentTypes.includes(type)) {
        acc.push(type);
      }

      return acc;
    }, []);
  }, [documentTypes, usedDocumentTypes, editingDocId, documents]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadError(null);
    const file = files[0];

    // Check file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setUploadError(
        "Unsupported file format. Please upload PDF, JPG, PNG, or DOCX."
      );

      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File exceeds maximum allowed size of 10MB.");

      return;
    }

    // Check total files
    if (documents.length >= 15) {
      setUploadError("Maximum 15 files allowed.");

      return;
    }

    // Check if there are available document types
    if (availableDocumentTypes.length === 0 && !editingDocId) {
      setUploadError(
        "All document types have been used. Please edit existing documents if needed."
      );

      return;
    }

    setCurrentFile(file);
    setEditingDocId(null);
    setDocumentsValidationError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("border-primary", "bg-primary/5");
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary", "bg-primary/5");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary", "bg-primary/5");
    }
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleBrowseClick = useCallback(() => {
    // Check if there are available document types before allowing file selection
    if (availableDocumentTypes.length === 0 && !editingDocId) {
      setUploadError(
        "All document types have been used. Please edit existing documents if needed."
      );

      return;
    }

    if (fileInputRef.current) {
      // Clear the file input value to prevent previous file references
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }, [availableDocumentTypes.length, editingDocId]);

  const handleSaveMetadata = (data: DocumentFormValues) => {
    if (editingDocId) {
      // Update existing document
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === editingDocId
            ? { ...doc, metadata: data, isExpanded: false }
            : doc
        )
      );
      setEditingDocId(null);
      setCurrentFile(null);
      toast.success("Document updated successfully");
    } else if (currentFile) {
      // For non-'other' types, check if document type is already used
      if (data.type !== "other" && usedDocumentTypes.includes(data.type)) {
        toast.error(
          "This document type has already been used. Please select a different type."
        );

        return;
      }

      // Add new document
      const newDocument: UploadedDocument = {
        id: crypto.randomUUID(),
        file: currentFile,
        metadata: data,
        isExpanded: false,
      };

      setDocuments((prev) => [newDocument, ...prev]);
      setCurrentFile(null);
      toast.success("Document added successfully");
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    if (editingDocId === id) {
      setEditingDocId(null);
      setCurrentFile(null);
    }
    toast.success("Document removed successfully");
  };

  const handleEditDocument = (doc: UploadedDocument) => {
    setEditingDocId(doc.id);
    // Only set current file for newly uploaded documents, not existing ones
    if (doc.file) {
      setCurrentFile(doc.file);
    } else {
      setCurrentFile(null);
    }
  };

  const handleToggleExpand = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, isExpanded: !doc.isExpanded } : doc
      )
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleSubmitDocument = (isSaveExit: boolean) => {
    // Validate that at least one document exists
    if (documents.length === 0) {
      setDocumentsValidationError(
        "Please upload at least one document before publishing"
      );

      return;
    }

    const unitId = isUnit ? getUnitStepData("unitInfo")?.id : undefined;

    // Separate new documents from existing documents
    const newDocuments = documents.filter((doc) => doc.file !== null);
    const existingDocs = documents.filter((doc) => doc.file === null);

    // Create payload structure
    const payload: any = {
      property: propertyId!,
      unit: unitId,
      page_saved: pageSaved,
      documents: newDocuments.map((doc) => doc.file!),
      data: {
        data: newDocuments.map((doc) => ({
          id: doc.metadata.id,
          title: doc.metadata.title,
          document_type: doc.metadata.type.toLowerCase().replace(/ /g, "_"),
          visibility: doc.metadata.visibility,
        })),
      },
    };

    // Add existing_data at top level if we have existing documents
    if (existingDocs.length > 0) {
      const existingDataPayload = existingDocs.map((doc) => {
        const documentId = doc.metadata.id || doc.documentId;

        if (!documentId) {
          throw new Error(
            "Existing document is missing ID. Cannot update document."
          );
        }

        const docPayload = {
          id: documentId, // Use metadata.id first, fallback to documentId
          title: doc.metadata.title,
          document_type: doc.metadata.type.toLowerCase().replace(/ /g, "_"),
          visibility: doc.metadata.visibility,
        };

        return docPayload;
      });

      payload.existing_data = {
        data: existingDataPayload,
      };
    }
    // Always use addPropertyDocument - backend will handle create vs update
    addPropertyDocument(payload, {
      onSuccess: async () => {
        updateStepData("documents", payload);

        if (isSaveExit) {
          clearAllUnitFormData();
          clearAllFormData();
          setCurrentStep(1);

          router.push("/my-properties");
        } else {
          if (isUnit) {
            setIsUnitModal(true);
            // markUnitStepCompleted(stepToMarkComplete);
            setIsUnitModal(true);
            // markUnitStepCompleted(stepToMarkComplete);
            // setCurrentUnitStep(nextCurrentStep);
          } else {
            setIsUnitModal(true);
            // markStepCompleted(stepToMarkComplete);
            // setCurrentStep(nextCurrentStep);
          }
        }
      },
    });
  };

  // Handle skip action - submit documents and publish property
  const handleSkip = async () => {
    try {
      let res: any;
      if (isUnit) {
        const publishPropertyRes = await publishProperty(propertyId!, {
          published: true,
        });
        if (publishPropertyRes?.success) {
          res = await publishUnit(parseInt(unitId as string), {
            published: true,
          });
        }
      } else {
        res = await publishProperty(propertyId!, { published: true });
      }
      if (res?.success) {
        clearAllFormData();
        clearAllUnitFormData();
        setCurrentStep(1);
        setCurrentUnitStep(1);
        setIsUnitModal(false);
        router.push("/my-properties");
      }
    } catch (error) {
      toast.error(errorHandler(error));
      setIsUnitModal(false);
    }
  };

  // Handle add units action - open second modal
  const handleAddUnits = async () => {
    // const unitId = getUnitStepData("unitInfo")?.id;

    if (unitId && isUnit) {
      const res = await publishUnit(parseInt(unitId as string), {
        published: true,
      });
      if (!res?.success) {
        toast.error("Failed to publish unit. Please try again.");
        setIsUnitModal(false);
        setIsSecondUnitModal(false);

        return;
      }
    }

    setIsUnitModal(false);
    setIsSecondUnitModal(true);

    // const payload: PropertyDocumentBody = {
    //   property: propertyId!,
    //   unit: unitId ?? undefined,
    //   page_saved: 6,
    //   documents: documents.map((doc) => doc.file),
    //   data: {
    //     data: documents.map((doc) => ({
    //       title: doc.metadata.title,
    //       document_type: doc.metadata.type.toLowerCase().replace(/ /g, "_"),
    //       visibility: doc.metadata.visibility,
    //     })),
    //   },
    // };

    // mutate(payload, {
    //   onSuccess: async () => {
    //     updateStepData("documents", payload);
    //     setIsUnitModal(false); // Close first modal
    //     setIsSecondUnitModal(true); // Open second modal
    //     clearAllUnitFormData();
    //   },
    //   onError: () => {
    //     setIsUnitModal(false); // Close modal on error
    //   },
    // });
  };

  // Show loading state while fetching document types
  if (isLoading) {
    return (
      <div className="mt-6 p-2">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading document types...</div>
        </div>
      </div>
    );
  }

  // Show error state if no document types available
  if (!documentTypes.length) {
    return (
      <div className="mt-6 p-2">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">
            No document types available. Please contact support.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-2">
      {/* First Modal - Skip or Add Units */}
      <UnitConfirmationModal
        title={`Do you want to add ${propertyType === "university_housing" || selectedPropertyType === "university_housing" ? "rooms" : "units"} now or skip and add later?"`}
        isOpen={isUnitModal}
        onClose={() => setIsUnitModal(false)}
        actions={[
          {
            text: "Skip",
            variant: "outline",
            onClick: () => handleSkip(),
            // disabled: isPending,
          },
          {
            text:
              propertyType === "university_housing" ||
              selectedPropertyType === "university_housing"
                ? "Add Rooms"
                : "Add Units",
            variant: "default",
            onClick: handleAddUnits,
            // disabled: isPending,
          },
        ]}
      />

      {/* Second Modal - Add Manually or Bulk Import */}
      <UnitConfirmationModal
        title={`How would you like to add your ${propertyType === "university_housing" || selectedPropertyType === "university_housing" ? "rooms" : "units"}?`}
        isOpen={isSecondUnitModal}
        onClose={() => setIsSecondUnitModal(false)}
        actions={[
          {
            text: "Add Manually",
            variant: "outline",
            onClick: () => {
              setIsSecondUnitModal(false);
              clearAllUnitFormData();

              setCurrentUnitStep(1);
              router.push(`/my-properties/add-unit/${selectedPropertyType}`);
            },
          },
          {
            text: "Bulk Import",
            variant: "default",
            onClick: () => {
              setIsSecondUnitModal(false);
              router.push(
                `/my-properties/bulk-import/${propertyId}?propertyType=${propertyType}`
              );
            },
          },
        ]}
      />

      <div className="space-y-2 p-2">
        <div className="flex items-center">
          <h2 className="text-lg font-medium">
            Upload Legal Documents for Property
          </h2>
          <span className="text-red-500 ml-1">*</span>
        </div>

        {/* Show info about available document types */}
        {availableDocumentTypes.length === 0 && !editingDocId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="text-sm text-yellow-800">
              All available document types have been used. You can edit existing
              documents to change their types.
            </div>
          </div>
        )}

        {/* Custom drag and drop area without react-dropzone */}
        <div
          ref={dropAreaRef}
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
            availableDocumentTypes.length === 0 && !editingDocId
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-gray-400 cursor-pointer"
          }`}
          onDragOver={
            availableDocumentTypes.length > 0 || editingDocId
              ? handleDragOver
              : undefined
          }
          onDragLeave={
            availableDocumentTypes.length > 0 || editingDocId
              ? handleDragLeave
              : undefined
          }
          onDrop={
            availableDocumentTypes.length > 0 || editingDocId
              ? handleDrop
              : undefined
          }
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={availableDocumentTypes.length === 0 && !editingDocId}
          />

          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={`p-3 rounded-full ${
                availableDocumentTypes.length === 0 && !editingDocId
                  ? "bg-gray-100"
                  : "bg-blue-50"
              }`}
            >
              <GreenImageFileIcon />
            </div>

            <div>
              <p
                className={`text-sm ${
                  availableDocumentTypes.length === 0 && !editingDocId
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                Drag and drop your document(s) here, or{" "}
                <span
                  className={`font-medium ${
                    availableDocumentTypes.length === 0 && !editingDocId
                      ? "text-gray-400"
                      : "text-primary"
                  }`}
                >
                  browse
                </span>
              </p>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="text-sm text-red-500 mt-2">{uploadError}</div>
        )}

        <div className="text-sm text-gray-500">
          PDF, JPG, PNG, DOCX • Max 10MB per file • Up to 10 files
        </div>

        {/* {availableDocumentTypes.length > 0 && (
          <div className="text-sm text-gray-500">
            Available document types: {availableDocumentTypes.length} remaining
          </div>
        )} */}
      </div>

      {/* Display validation error if any */}
      {documentsValidationError && (
        <div className="text-sm text-red-500 mt-2">
          {documentsValidationError}
        </div>
      )}

      {/* Document form below the upload area */}
      {(currentFile || editingDocId) && (
        <div className="mt-6 border border-gray-200 shadow-lg rounded-lg p-4">
          {currentFile && (
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-2xl">
                <BlueDocumentIcon />
              </div>
              <div className="ml-3">
                <div>{currentFile.name}</div>
                <div className="text-sm text-gray-500">
                  {formatFileSize(currentFile.size)}
                </div>
              </div>
            </div>
          )}

          {editingDocId && !currentFile && (
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-2xl">
                <BlueDocumentIcon />
              </div>
              <div className="ml-3">
                <div>Edit Document</div>
                <div className="text-sm text-gray-500">
                  Update document information
                </div>
              </div>
            </div>
          )}

          <DocumentForm
            initialValues={
              editingDocId
                ? documents.find((d) => d.id === editingDocId)?.metadata
                : undefined
            }
            onSave={handleSaveMetadata}
            onCancel={() => {
              setCurrentFile(null);
              setEditingDocId(null);
            }}
            isEditing={!!editingDocId}
            currentFile={currentFile}
            availableDocumentTypes={transformedAvailableDocumentTypes}
            documentTypes={documentTypes}
            disabledDocumentTypes={disabledDocumentTypes}
          />
        </div>
      )}

      {documents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">
            Uploaded Documents ({documents.length}/10)
          </h3>

          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 shadow rounded-lg overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => handleToggleExpand(doc.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <BlueDocumentIcon />
                    </div>

                    <div>
                      <div className="font-medium">
                        {doc.metadata.title ||
                          (doc.file ? doc.file.name : "Existing Document")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doc.metadata.type
                          ? formatDocumentTypeForDisplay(doc.metadata.type)
                          : (doc.file
                              ? FILE_TYPE_MAP[doc.file.type]
                              : undefined) || "Document"}
                        {!doc.isExpanded && doc.file && (
                          <span className="ml-2">
                            {formatFileSize(doc.file.size)}
                          </span>
                        )}
                      </div>
                    </div>

                    {doc.metadata.visibility === "shared" && (
                      <Badge className="ml-2 bg-primary-200 text-primary-800 hover:bg-primary-200">
                        Shared
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDocument(doc);
                      }}
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveDocument(doc.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>

                    {doc.isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {doc.isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Document Title
                        </div>
                        <div className="mt-1 text-gray-900">
                          {doc.metadata.title}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Document Type
                        </div>
                        <div className="mt-1">
                          {formatDocumentTypeForDisplay(doc.metadata.type)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Visibility
                        </div>
                        <div className="mt-1 capitalize">
                          {doc.metadata.visibility}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          File Size
                        </div>
                        <div className="mt-1">
                          {doc.file ? formatFileSize(doc.file.size) : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons Row */}
      <div className="flex justify-between mt-6 w-full">
        <Button
          type="button"
          className="lg:px-6 px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-md font-semibold"
          onClick={() => {
            if (isUnit) {
              setCurrentUnitStep(currentUnitStep - 1);
            } else {
              setCurrentStep(currentStep - 1);
            }
          }}
        >
          Back
        </Button>

        <div className="flex space-x-3">
          <Button
            type="button"
            className="lg:px-6 px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-md font-semibold"
            onClick={() => handleSubmitDocument(true)}
            disabled={isPending}
          >
            Save & Exit
          </Button>
          <Button
            className="lg:px-6 px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors"
            onClick={() => handleSubmitDocument(false)}
            disabled={isPending}
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
