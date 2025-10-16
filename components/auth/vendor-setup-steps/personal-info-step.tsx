"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/contexts/auth-context";
import { useVendorSetupStore } from "@/lib/stores/use-vendor-setup-store";

export function PersonalInfoStep() {
  const { user } = useAuth();
  const {
    personalInfo,
    updatePersonalInfo,
    setCurrentStep,
    markStepCompleted,
  } = useVendorSetupStore();
  const [isLoading, setIsLoading] = useState(false);

  // Populate personal info from auth user data on component mount
  useEffect(() => {
    if (user && (!personalInfo.firstName || !personalInfo.email)) {
      updatePersonalInfo({
        firstName: user.user?.first_name || "",
        lastName: user.user?.last_name || "",
        email: user.user?.email || "",
        phoneNumber: user?.user?.phone_number || "",
      });
    }
  }, [user, personalInfo, updatePersonalInfo]);

  const handleContinue = async () => {
    // Validate required fields
    if (
      !personalInfo.firstName ||
      !personalInfo.lastName ||
      !personalInfo.email
    ) {
      toast.error("Please fill in all required fields");

      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to save personal info
      const payload = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phoneNumber: personalInfo.phoneNumber,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mark step as completed and move to next step
      markStepCompleted(1);
      setCurrentStep(2);
      toast.success("Personal information saved successfully!");
    } catch (error) {
      toast.error("Failed to save personal information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-blue-600 mb-4">
        ℹ️ Personal information from your account. You can update it later if
        needed.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
            placeholder="Enter first name"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
            placeholder="Enter last name"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="Enter email address"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={personalInfo.phoneNumber}
            onChange={(e) =>
              updatePersonalInfo({ phoneNumber: e.target.value })
            }
            placeholder="+1 (555) 123-4567"
            disabled
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-6">
        <Button onClick={handleContinue} disabled={isLoading} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  );
}
