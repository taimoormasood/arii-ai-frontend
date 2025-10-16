"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Logo } from "@/assets/images";
import { resetPasswordSchema } from "@/components/auth/schema";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import { errorHandler } from "@/helpers/error-handler";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/lib/contexts/auth-context";
import { resetPassword } from "@/services/auth/auth.service";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type FormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const searchParams = useSearchParams();

  const { updateUser } = useAuth();

  const email = searchParams.get("email") || "";

  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const {
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await resetPassword({
        email: email,
        new_password: data?.newPassword,
        confirm_password: data?.confirmPassword,
      });

      if (response?.success) {
        const res = await axiosInstance.get("/user-details");
        const user = res.data;
        const userData = await JSON.stringify(user?.data);
        const parsedData = await JSON.parse(userData);
        await updateUser(parsedData);

        router.push("/auth/login");
      }
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/">
          <Image src={Logo} width={146} height={57} alt="Logo" />
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-xl p-8 bg-white rounded-xl border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">New Password</h2>
            <p className="text-gray-600 text-sm">
              Enter your new password to access your account
            </p>
          </div>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="relative">
                <div className="absolute left-24">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1"
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
                              Include at least one special character (e.g., !,
                              @, #, $)
                            </li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <CustomInput
                name="newPassword"
                type="password"
                label="New Password"
                placeholder="Enter new password"
              />

              <CustomInput
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm new password"
              />

              <div className="flex justify-end gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="font-semibold border-gray-200 text-gray-800 hover:bg-primary-500 hover:text-white"
                >
                  <Link href="/auth/login">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className=" bg-primary-600 hover:bg-[#5A8C00] text-white"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
    </div>
  );
}
