"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useAuthMutations } from "@/hooks/api/use-auth-mutations";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/lib/contexts/auth-context";
import { setTokens } from "@/utils/auth-storage";

import CustomInput from "../ui/custom-input";
import { loginSchema } from "./schema";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  const { updateUser } = useAuth();

  const { loginMutation } = useAuthMutations();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: async (response) => {
          if (response?.success) {
            setTokens(
              response?.data?.access_token,
              response?.data?.refresh_token
            );

            const res = await axiosInstance.get("/user-details");
            const user = res.data;
            const userData = await JSON.stringify(user?.data);
            const parsedData = await JSON.parse(userData);
            await updateUser(parsedData);

            router.push("/universal-dashboard");
          }
        },
      }
    );
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className="md:text-2xl text-lg font-semibold text-gray-900">
          Welcome back!
        </h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}></form>

        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <CustomInput
            required
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email"
          />
          <CustomInput
            required
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
          />
          <Link
            href="/auth/forgot-password"
            className="flex justify-end !-mt-3"
          >
            <span className="font-medium text-sm text-primary">
              Forgot Password?
            </span>
          </Link>

          <Button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white mt-2"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </FormProvider>

      <p className="text-center text-sm mt-6">
        Don't have an account yet?{" "}
        <Link
          href="/auth/signup"
          className="text-primary-600 font-medium hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
