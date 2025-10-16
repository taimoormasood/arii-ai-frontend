"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Edit, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import {
  FormProvider,
  type Resolver,
  useFieldArray,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import PlusGreenIcon from "@/assets/icons/plus-green-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomInput from "@/components/ui/custom-input";
import CustomPhoneInput from "@/components/ui/custom-phone-input";
import {
  useAddOwnerInfo,
  useGetPropertyDetail,
} from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import type { OwnerInfoBody } from "@/services/properties/types";

import { ownerFormSchema, ownerSchema } from "./schema";

type FormData = z.infer<typeof ownerFormSchema>;
type Owner = z.infer<typeof ownerSchema>;

type ConditionalFormData = {
  owners: FormData["owners"];
  defaultOwner?: any;
};

interface OwnerInfoProps {
  pageSaved: number;
  nextCurrentStep: number;
  stepToMarkComplete: number;
}

export default function OwnerInfo({
  pageSaved = 6,
  nextCurrentStep = 7,
  stepToMarkComplete = 6,
}: OwnerInfoProps) {
  const [showDefaultForm, setShowDefaultForm] = useState(true);
  const [percentageError, setPercentageError] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [originalOwnerData, setOriginalOwnerData] = useState<Owner | null>(
    null
  );

  const router = useRouter();

  const {
    getStepData,
    updateStepData,
    currentStep,
    setCurrentStep,
    markStepCompleted,
    isEditMode,
    editingPropertyId,
  } = usePropertyStore();

  const { mutate: addOwnerInfo, isPending: isSubmitting } = useAddOwnerInfo();

  // Get property ID - prioritize editingPropertyId, then store data
  const storePropertyId = getStepData("propertyInfo")?.id;
  const currentPropertyId = editingPropertyId || storePropertyId;

  // Fetch property details when we have a property ID
  const { data: propertyDetailResponse, isLoading: isLoadingPropertyDetail } =
    useGetPropertyDetail(currentPropertyId || 0);

  // Extract owner details from property detail response
  const propertyData = propertyDetailResponse?.data;
  const apiOwnerDetails = propertyData?.owners;

  const conditionalResolver: Resolver<ConditionalFormData> = zodResolver(
    z.object({
      defaultOwner: showDefaultForm ? ownerSchema : z.any().optional(),
      owners: z.array(ownerSchema).max(5, "Maximum 5 owners allowed"),
    })
  );

  const form = useForm<FormData>({
    resolver: conditionalResolver as unknown as Resolver<FormData>,
    defaultValues: {
      defaultOwner: {
        email: "",
        ownershipPercentage: 0,
        emergencyPerson: "",
        emergencyPhone: "",
      },
      owners: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "owners",
  });

  // Load existing owner data from API when available
  useEffect(() => {
    if (apiOwnerDetails && apiOwnerDetails.length > 0 && fields.length === 0) {
      // Clear existing form data
      form.reset({
        defaultOwner: {
          email: "",
          ownershipPercentage: 0,
          emergencyPerson: "",
          emergencyPhone: "",
        },
        owners: [],
      });

      // Load existing owners from API
      apiOwnerDetails.forEach((owner: any) => {
        append({
          id: owner.id, // Include the id field for existing owners from API
          email: owner.email,
          ownershipPercentage: Number(owner.percentage),
          emergencyPerson: owner.emergency_person || "",
          emergencyPhone: owner.emergency_contact || "",
        });
      });

      // Calculate if we need to show default form
      const totalPercentage = apiOwnerDetails.reduce(
        (sum: number, owner: any) => sum + Number(owner.percentage),
        0
      );

      if (totalPercentage >= 100) {
        setShowDefaultForm(false);
      } else {
        setShowDefaultForm(true);
        const remainingPercentage = 100 - totalPercentage;
        form.setValue("defaultOwner.ownershipPercentage", remainingPercentage);
      }
    }
  }, [apiOwnerDetails, fields.length, form, append]);

  // Also load from store data when navigating between steps (fallback)
  useEffect(() => {
    if (!apiOwnerDetails && isEditMode && fields.length === 0) {
      const ownerDetailsData = getStepData("ownerDetails");

      if (ownerDetailsData?.owners && ownerDetailsData.owners.length > 0) {
        // Clear existing form data
        form.reset({
          defaultOwner: {
            email: "",
            ownershipPercentage: 0,
            emergencyPerson: "",
            emergencyPhone: "",
          },
          owners: [],
        });

        // Load existing owners
        ownerDetailsData.owners.forEach((owner) => {
          append({
            id: owner.id, // Include the id field for existing owners
            email: owner.email,
            ownershipPercentage: owner.ownershipPercentage,
            emergencyPerson: owner.emergencyPerson || "",
            emergencyPhone: owner.emergencyPhone || "",
          });
        });

        // Calculate if we need to show default form
        const totalPercentage = ownerDetailsData.owners.reduce(
          (sum, owner) => sum + Number(owner.ownershipPercentage),
          0
        );

        if (totalPercentage >= 100) {
          setShowDefaultForm(false);
        } else {
          setShowDefaultForm(true);
          const remainingPercentage = 100 - totalPercentage;
          form.setValue(
            "defaultOwner.ownershipPercentage",
            remainingPercentage
          );
        }
      }
    }
  }, [isEditMode, getStepData, form, append]);

  // Calculate remaining percentage for default owner
  useEffect(() => {
    if (showDefaultForm) {
      const currentOwners = form.getValues("owners");
      const totalExistingPercentage = currentOwners.reduce(
        (sum, owner) => sum + Number(owner.ownershipPercentage),
        0
      );

      const remainingPercentage = Math.max(0, 100 - totalExistingPercentage);

      form.setValue("defaultOwner.ownershipPercentage", remainingPercentage);
    }
  }, [showDefaultForm, form]);

  // Validate total percentage whenever owners change
  useEffect(() => {
    if (fields.length > 0) {
      validateTotalPercentage();
    }
  }, [fields]);

  const validateTotalPercentage = (
    owners?: Owner[],
    includeDefault?: boolean,
    defaultOwner?: Owner
  ) => {
    let ownersToCheck: Owner[] = [];

    if (owners) {
      ownersToCheck = [...owners];
    } else {
      ownersToCheck = [...form.getValues("owners")];
    }

    if ((includeDefault === undefined && showDefaultForm) || includeDefault) {
      const defaultOwnerValue = defaultOwner || form.getValues("defaultOwner");
      ownersToCheck.push(defaultOwnerValue);
    }

    const totalPercentage = ownersToCheck.reduce(
      (sum, owner) => sum + Number(owner.ownershipPercentage),
      0
    );

    // Only show error if we're submitting or have at least one owner
    if (ownersToCheck.length > 1 && totalPercentage !== 100) {
      setPercentageError(
        `Total ownership percentage must be exactly 100%. Current: ${totalPercentage}%`
      );

      return false;
    }

    setPercentageError("");

    return true;
  };

  const validateEmailUniqueness = (email: string, currentIndex?: number) => {
    const owners = form.getValues("owners");

    // Check against other owners
    for (let i = 0; i < owners.length; i++) {
      if (currentIndex !== undefined && i === currentIndex) continue;
      if (owners[i].email === email) return false;
    }

    return true;
  };

  const handleUpdateOwner = (index: number) => {
    const updatedOwnerData = form.getValues(`owners.${index}`);
    // Validate email uniqueness (only against other owners, excluding current one)
    if (!validateEmailUniqueness(updatedOwnerData.email, index)) {
      form.setError(`owners.${index}.email`, {
        message: "Email already exists",
      });

      return;
    }

    if (updatedOwnerData.email === "") {
      form.setError(`owners.${index}.email`, {
        message: "Email is required",
      });

      return;
    }

    // Validate email format using zod schema
    try {
      ownerSchema.shape.email.parse(updatedOwnerData.email);
    } catch (error) {
      form.setError("defaultOwner.email", {
        message: "Please enter a valid email address",
      });

      return;
    }

    update(index, updatedOwnerData);
    setEditingIndex(null);
    setOriginalOwnerData(null);

    // Recalculate default owner percentage if showing
    if (showDefaultForm) {
      const currentOwners = form.getValues("owners");
      const totalExistingPercentage = currentOwners.reduce(
        (sum, owner) => sum + Number(owner.ownershipPercentage),
        0
      );

      const remainingPercentage = Math.max(0, 100 - totalExistingPercentage);
      form.setValue("defaultOwner.ownershipPercentage", remainingPercentage);
    }

    // Validate total percentage
    validateTotalPercentage();
  };

  const handleRemoveOwner = (index: number) => {
    remove(index);
    setEditingIndex(null);
    setOriginalOwnerData(null);

    if (fields.length <= 1) {
      setShowDefaultForm(true);
    }

    // Recalculate default owner percentage if showing
    setTimeout(() => {
      if (showDefaultForm) {
        const currentOwners = form.getValues("owners");
        const totalExistingPercentage = currentOwners.reduce(
          (sum, owner) => sum + Number(owner.ownershipPercentage),
          0
        );

        const remainingPercentage = Math.max(0, 100 - totalExistingPercentage);
        form.setValue("defaultOwner.ownershipPercentage", remainingPercentage);
      }

      validateTotalPercentage();
    }, 0);
  };

  const handleEditOwner = (index: number) => {
    const currentOwnerData = form.getValues(`owners.${index}`);
    setOriginalOwnerData(currentOwnerData);
    setEditingIndex(index);
  };

  const handleCancelEdit = (index: number) => {
    if (originalOwnerData) {
      update(index, originalOwnerData);
    }
    setEditingIndex(null);
    setOriginalOwnerData(null);
    setPercentageError("");
  };

  const handleAddOwner = (e: React.MouseEvent) => {
    e.preventDefault();

    const isValid = form.trigger("defaultOwner.ownershipPercentage");

    const defaultOwnerData = form.getValues("defaultOwner");
    const currentOwners = form.getValues("owners");

    // Validate email uniqueness (only against existing owners)
    if (!validateEmailUniqueness(defaultOwnerData.email)) {
      form.setError("defaultOwner.email", { message: "Email already exists" });

      return;
    }
    if (defaultOwnerData.email === "") {
      form.setError("defaultOwner.email", { message: "Email is required" });

      return;
    }

    // Validate email format using zod schema
    try {
      ownerSchema.shape.email.parse(defaultOwnerData.email);
    } catch (error) {
      form.setError("defaultOwner.email", {
        message: "Please enter a valid email address",
      });

      return;
    }

    if (currentOwners.length < 5) {
      append(defaultOwnerData);

      // Reset default owner form with remaining percentage
      const newOwners = [...currentOwners, defaultOwnerData];
      const totalPercentage = newOwners.reduce(
        (sum, owner) => sum + Number(owner.ownershipPercentage),
        0
      );

      if (newOwners.length >= 5) {
        setShowDefaultForm(false);
        toast.error(
          `Total ownership percentage must be exactly 100%. Current: ${totalPercentage}%`
        );
      }

      const remainingPercentage = Math.max(0, 100 - totalPercentage);

      form.reset({
        defaultOwner: {
          email: "",
          ownershipPercentage: remainingPercentage,
          emergencyPerson: "",
          emergencyPhone: "",
        },
        owners: newOwners,
      });

      // Hide default form if we've reached 100%
      if (totalPercentage >= 100) {
        setShowDefaultForm(false);
      }

      validateTotalPercentage();
    }
  };

  const handleRemoveDefaultOwner = () => {
    setShowDefaultForm(false);
    form.reset({
      defaultOwner: {
        email: "",
        ownershipPercentage: 0,
        emergencyPerson: "",
        emergencyPhone: "",
      },
      owners: form.getValues("owners"),
    });
  };

  const onSubmit = async (isSaveExit: boolean, data: FormData) => {
    // Final validation before submission
    if (
      !validateTotalPercentage(data.owners, showDefaultForm, data.defaultOwner)
    ) {
      return;
    }

    if (!currentPropertyId) {
      return;
    }

    if (!currentPropertyId) {
      return;
    }

    const payload: OwnerInfoBody = {
      property: currentPropertyId as number,
      page_saved: pageSaved,
      owners: data.owners.map((owner) => {
        const ownerData = {
          email: owner.email,
          percentage: owner.ownershipPercentage.toString(),
          emergency_person: owner.emergencyPerson || "",
          emergency_contact: owner.emergencyPhone || "",
        };

        // Include id if the owner has one (for existing owners)
        if (owner.id) {
          return {
            id: owner.id,
            ...ownerData,
          };
        }

        return ownerData;
      }),
    };

    const mutationOptions = {
      onSuccess: (response: any) => {
        // Store the API response data in the store
        const responseData = response?.data || response;

        updateStepData("ownerDetails", {
          owners: data.owners.map((owner, index) => ({
            ...owner,
            // If response contains updated owner data with IDs, use those
            id: responseData?.owners?.[index]?.id || owner.id,
          })),
        });

        if (isSaveExit) {
          router.push("/my-properties");
        } else {
          markStepCompleted(stepToMarkComplete);
          setCurrentStep(nextCurrentStep);
        }
      },
    };

    // Always use create endpoint - backend handles both creation and updates via ID tracking
    addOwnerInfo(payload, mutationOptions);
  };

  // Calculate total percentage for display
  const totalPercentage = [...form.getValues("owners")].reduce(
    (sum, owner) => sum + Number(owner.ownershipPercentage),
    showDefaultForm
      ? Number(form.getValues("defaultOwner.ownershipPercentage"))
      : 0
  );

  return (
    <div className="w-full mx-auto lg:p-6 p-4 space-y-6 bg-white rounded-xl shadow-sm">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(false, data))}
          className="space-y-6"
        >
          <div className="flex items-center justify-between flex-wrap">
            <h1 className="lg:text-2xl text-lg font-semibold">
              Investor Details
            </h1>
            <div className="lg:text-sm text-xs font-medium">
              Total Ownership Percentage:{" "}
              <span
                className={
                  totalPercentage === 100 ? "text-primary-600" : "text-red-600"
                }
              >
                {totalPercentage}%
              </span>
            </div>
          </div>

          {/* Loading state */}
          {isLoadingPropertyDetail && currentPropertyId && (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-600">
                Loading owner details...
              </div>
            </div>
          )}

          {percentageError && (
            <Alert
              variant="destructive"
              className="bg-red-50 text-red-800 border-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{percentageError}</AlertDescription>
            </Alert>
          )}

          {fields.map((field, index) => (
            <div key={field.id}>
              <Card className="border border-gray-200 shadow">
                <CardContent className="lg:p-6 p-4">
                  <div className="flex items-center flex-wrap justify-between mb-4">
                    <h3 className="lg:text-lg text-base font-medium">
                      #{index + 1} Investor details
                    </h3>
                    <div className="flex gap-2">
                      {editingIndex === index ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateOwner(index)}
                            className="text-primary-600 hover:text-primary-700 bg-white hover:bg-green-50 border-none"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Update
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelEdit(index)}
                            className="text-gray-600 hover:text-gray-700 border-none bg-white hover:bg-gray-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOwner(index)}
                          className="text-primary-600 hover:text-primary-700 hover:bg-green-50 border-none bg-white"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOwner(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <CustomInput
                        name={`owners.${index}.email`}
                        type="email"
                        label="Email"
                        disabled={editingIndex !== index}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <CustomInput
                        name={`owners.${index}.ownershipPercentage`}
                        type="number"
                        label="Ownership percentage"
                        disabled={editingIndex !== index}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <CustomInput
                        name={`owners.${index}.emergencyPerson`}
                        type="text"
                        label="Emergency person"
                        disabled={editingIndex !== index}
                      />
                    </div>
                    <div className="space-y-2">
                      <CustomPhoneInput
                        name={`owners.${index}.emergencyPhone`}
                        label="Emergency Contact"
                        disabled={editingIndex !== index}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Show "Add Another Owner" button only when there are owners and default form is hidden */}
          {fields.length > 0 &&
            !showDefaultForm &&
            fields.length < 5 &&
            totalPercentage < 100 && (
              <div className="w-full flex justify-end">
                <Button
                  type="button"
                  onClick={() => setShowDefaultForm(true)}
                  className="lg:px-6 px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors"
                >
                  Add Another Owner
                </Button>
              </div>
            )}

          {/* Default Owner Creation Form */}
          {showDefaultForm && (
            <Card className="bg-white border border-gray-100">
              <CardContent className="lg:p-6 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="lg:text-lg text-base font-medium">
                    Add New Investor
                  </h3>
                  {/* Show remove button only when there are existing owners */}
                  {fields.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveDefaultOwner}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <CustomInput
                      name="defaultOwner.email"
                      type="email"
                      label="Email"
                      placeholder="rentalguru@gmail.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <CustomInput
                      name="defaultOwner.ownershipPercentage"
                      label="Ownership percentage"
                      placeholder="Remaining percentage"
                      required
                      // disabled={fields.length > 0}
                      // helperText={
                      //   fields.length > 0
                      //     ? "Automatically calculated based on remaining percentage"
                      //     : ""
                      // }
                    />
                  </div>
                  <div className="space-y-2">
                    <CustomInput
                      name="defaultOwner.emergencyPerson"
                      label="Emergency person"
                      placeholder="Rental Guru"
                    />
                  </div>
                  <div className="space-y-2">
                    <CustomPhoneInput
                      name="defaultOwner.emergencyPhone"
                      label="Emergency Contact"
                      placeholder="Enter Emergency Phone"
                    />
                  </div>
                </div>
              </CardContent>
              <div className="w-full flex justify-end pr-6 pb-6">
                <Button
                  type="button"
                  onClick={handleAddOwner}
                  className="bg-white  hover:bg-gray-100 flex items-center space-x-1 text-primary-600 font-medium"
                >
                  <span className="text-sm font-semibold">ADD</span>
                  <PlusGreenIcon />
                </Button>
              </div>
            </Card>
          )}

          <div className="flex justify-between mt-6 w-full">
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="lg:px-6 px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-md font-semibold"
            >
              Back
            </Button>
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={form.handleSubmit((data) => onSubmit(true, data))}
                disabled={
                  showDefaultForm ||
                  isSubmitting ||
                  fields.length === 0 ||
                  totalPercentage !== 100 ||
                  (showDefaultForm &&
                    form.formState.errors.defaultOwner !== undefined)
                }
                className="lg:px-6 px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-md font-semibold"
              >
                Save & Exit
              </Button>
              <Button
                disabled={
                  showDefaultForm ||
                  isSubmitting ||
                  fields.length === 0 ||
                  totalPercentage !== 100 ||
                  (showDefaultForm &&
                    form.formState.errors.defaultOwner !== undefined)
                }
                type="submit"
                className="lg:px-6 px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors"
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
