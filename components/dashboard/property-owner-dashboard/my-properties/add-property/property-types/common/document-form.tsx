import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import CustomRadioGroup from "@/components/ui/custom-radio-group";
import { Form } from "@/components/ui/form";

// Create dynamic schema based on available document types
const createDocumentSchema = (documentTypes: string[]) => {
  if (documentTypes.length === 0) {
    throw new Error("No document types available");
  }

  return z.object({
    title: z
      .string()
      .min(1, "Document title is required")
      .max(100, "Document title must be less than 100 characters"),
    type: z.enum(documentTypes as [string, ...string[]], {
      errorMap: () => ({ message: "Document type is required" }),
    }),
    visibility: z.enum(["private", "shared"]),
  });
};

export type DocumentFormValues = {
  title: string;
  type: string;
  visibility: "private" | "shared";
};

interface DocumentFormProps {
  initialValues?: DocumentFormValues;
  onSave: (data: DocumentFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
  currentFile: File | null;
  availableDocumentTypes: string[];
  documentTypes: string[];
  disabledDocumentTypes?: string[];
}

export function DocumentForm({
  initialValues,
  onSave,
  onCancel,
  isEditing = false,
  currentFile,
  availableDocumentTypes,
  documentTypes,
  disabledDocumentTypes = [],
}: DocumentFormProps) {
  // Deduplicate types for z.enum to avoid issues with multiple 'other'
  const uniqueTypes = Array.from(
    new Set(
      availableDocumentTypes.length > 0 ? availableDocumentTypes : documentTypes
    )
  );
  const documentSchema = createDocumentSchema(uniqueTypes);

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: initialValues?.title || "",
      type: initialValues?.type || undefined,
      visibility: initialValues?.visibility || "private",
    },
    mode: "onChange",
  });

  const onSubmit = (data: DocumentFormValues) => {
    onSave(data);
  };

  // Helper function to format document type labels
  const formatDocumentTypeLabel = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            name="title"
            label="Document Title"
            placeholder="Enter title"
            required
          />

          <CustomInput
            name="type"
            label="Document Type"
            placeholder="Select document type"
            required
            select
            options={availableDocumentTypes.map((type) => ({
              value: type,
              label: formatDocumentTypeLabel(type),
              disabled:
                disabledDocumentTypes.includes(type) && type !== "other",
            }))}
          />
        </div>

        {availableDocumentTypes.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              No document types available. All types have been used.
            </p>
          </div>
        )}

        <CustomRadioGroup
          name="visibility"
          label="Visibility"
          options={[
            { value: "private", label: "Private" },
            { value: "shared", label: "Share with Tenant" },
          ]}
          required
          className="mt-4"
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={availableDocumentTypes.length === 0}>
            {isEditing ? "Update Document" : "Add Document"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
