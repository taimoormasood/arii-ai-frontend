"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Logo } from "@/assets/images";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/custom-input";
import { useAuthMutations } from "@/hooks/api/use-auth-mutations";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPasswordMutation } = useAuthMutations();

  const router = useRouter();

  const methods = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(
      { email: data.email },
      {
        onSuccess: async (response) => {
          if (response?.success) {
            router.push(
              `/auth/verify-otp?email=${encodeURIComponent(data?.email)}&step=forgot-password`
            );
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/">
          <Image src={Logo} width={146} height={57} alt="Logo" />
        </Link>
      </div>
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-max p-8 bg-white rounded-xl border border-gray-200">
          <h1 className="text-2xl font-bold mb-2 text-center">
            Forgot Password
          </h1>
          <p className="text-gray-600 mb-6">
            Please enter your email and we'll send you a password reset link.
          </p>

          {forgotPasswordMutation.data &&
            !forgotPasswordMutation.data.success && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {forgotPasswordMutation.data.error ||
                  "Failed to send reset link. Please try again."}
              </div>
            )}

          <FormProvider {...methods}>
            <form
              className="space-y-4"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <CustomInput
                name="email"
                label="Email"
                placeholder="Enter email"
              />

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="font-semibold border-gray-200 text-gray-800 hover:bg-primary-500 hover:text-white"
                >
                  <Link href="/auth/login">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className=" bg-primary-600 hover:bg-[#5A8C00] text-white"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? "Processing..." : "Next"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
}
