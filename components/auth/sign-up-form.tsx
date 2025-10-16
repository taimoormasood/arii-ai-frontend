"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { alertSuccess } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthMutations } from "@/hooks/api/use-auth-mutations";
import { useGetInvitationDetail } from "@/hooks/api/use-invitation";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/lib/contexts/auth-context";
import { setTokens } from "@/utils/auth-storage";
import { showModal } from "@/utils/modal-config";
import useStorage from "@/utils/useStorage";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import CustomInput from "../ui/custom-input";
import CustomPhoneInput from "../ui/custom-phone-input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { signUpSchema } from "./schema";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { updateUser } = useAuth();

  const invitationId = searchParams.get("invitation_id");

  const isVendor = searchParams.get("vendor") || "";

  const { data, isError } = useGetInvitationDetail(
    invitationId || "",
    isVendor ? "vendor" : "tenant"
  );

  const invitationDetails = data?.data;

  const { signupMutation } = useAuthMutations();

  const methods = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      agreeToTerms: false,
    },
  });

  useEffect(() => {
    if (invitationDetails) {
      methods.reset({
        firstName: invitationDetails.first_name || "",
        lastName: invitationDetails.last_name || "",
        email: invitationDetails.email || "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        agreeToTerms: false,
      });
    }
  }, [invitationDetails, methods]);

  const handleLoginAndRedirect = async (
    access_token: string,
    refresh_token: string
  ) => {
    await setTokens(access_token, refresh_token);

    const res = await axiosInstance.get("/user-details");
    const user = res.data;
    const userData = await JSON.stringify(user?.data);
    const parsedData = await JSON.parse(userData);

    await useStorage.setItem("lease_info", invitationDetails);

    await updateUser(parsedData);
    router.push("/universal-dashboard?action=invitation");
  };

  const onSubmit = async (data: SignUpFormValues) => {
    const basePayload: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      confirm_password: string;
      phone_number: string;
      invitation_id?: string;
      invitation_role?: string;
    } = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
      phone_number: data.phoneNumber,
    };

    if (invitationId) {
      basePayload.invitation_id = invitationId;
      basePayload.invitation_role = isVendor ? "vendor" : "tenant";
    }

    signupMutation.mutate(basePayload, {
      onSuccess: async (response) => {
        if (response?.success) {
          if (invitationId && isVendor) {
            await showModal({
              title: `Your account has been successfully created and linked to ${invitationDetails?.sender_name || "Manager Name"}. Welcome to Rental Guru!`,
              image: alertSuccess,
              onClose: async () =>
                await handleLoginAndRedirect(
                  response?.data?.access_token,
                  response?.data?.refresh_token
                ),
              actions: [
                {
                  text: "Go to Dashboard",
                  onClick: async () =>
                    await handleLoginAndRedirect(
                      response?.data?.access_token,
                      response?.data?.refresh_token
                    ),
                },
              ],
            });
          } else if (invitationId && !isVendor) {
            await showModal({
              title: `Your account has been successfully created and linked to ${invitationDetails?.sender_name || "Manager Name"}.`,
              image: alertSuccess,
              onClose: async () =>
                await handleLoginAndRedirect(
                  response?.data?.access_token,
                  response?.data?.refresh_token
                ),
              actions: [
                {
                  text: "Continue",
                  onClick: async () =>
                    await handleLoginAndRedirect(
                      response?.data?.access_token,
                      response?.data?.refresh_token
                    ),
                },
              ],
            });
          } else {
            router.push(
              `/auth/verify-otp?email=${encodeURIComponent(data?.email)}&step=signup`
            );
          }
        }
      },
    });
  };

  return (
    <div>
      {isError && (
        <Alert
          variant={"error"}
          className="mb-4 flex justify-between items-center gap-3"
        >
          <div className="flex flex-col space-y-2">
            <AlertTitle variant={"error"}>Invitation Failed</AlertTitle>
            <AlertDescription>
              Failed to fetch invitation details. Please try again later.
            </AlertDescription>
          </div>
        </Alert>
      )}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" className="mr-2">
          <Link href="/">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="md:text-2xl text-lg font-semibold text-gray-900">
          Create your account
        </h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              required
              name="firstName"
              label="First Name"
              placeholder="Enter first name"
            />
            <CustomInput
              required
              name="lastName"
              label="Last Name"
              placeholder="Enter last name"
            />
          </div>

          <CustomInput
            required
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email"
            disabled={!!invitationDetails?.email}
          />
          <div className="relative">
            <div className="absolute left-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      type="button"
                    >
                      <Info className="h-4 w-4 text-gray-400" />
                      <span className="sr-only">Password requirements</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="w-80 p-3">
                    <div className="space-y-1 text-xs">
                      <h4 className="font-medium">Password must:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Be between 8 and 20 characters</li>
                        <li>Include at least one uppercase letter (A-Z)</li>
                        <li>Include at least one lowercase letter (a-z)</li>
                        <li>Include at least one number (0-9)</li>
                        <li>
                          Include at least one special character (e.g., !, @, #,
                          $)
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <CustomInput
            required
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
          />
          <CustomInput
            required
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
          />

          <CustomPhoneInput
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter phone number"
            required
          />

          <Controller
            name="agreeToTerms"
            control={methods.control}
            render={({ field }) => (
              <div className="flex items-start space-x-2 pt-2 m-0">
                <Checkbox
                  id="agreeToTerms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor="agreeToTerms"
                  className="md:text-sm text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I Agree to Rental Guru{" "}
                  <Link
                    href="/terms"
                    className="text-primary-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms & Condition
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="text-primary-600"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
            )}
          />
          {methods.formState.errors.agreeToTerms && (
            <span className="text-red-500 text-xs m-0">
              {methods.formState.errors.agreeToTerms.message}
            </span>
          )}

          <Button
            type="submit"
            className="w-full bg-primary-600 hover:bg-[#5A8C00] text-white mt-2"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </FormProvider>

      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary-600 font-medium hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
