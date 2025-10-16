"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { errorHandler } from "@/helpers/error-handler";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
} from "@/services/auth/auth.service";
import {
  ForgotPasswordBody,
  LoginBody,
  LogoutBody,
  ResetPasswordBody,
  SignupBody,
} from "@/services/auth/types";

const SIGNUP_QUERY_KEY = ["signup-key"] as const;

export function useAuthMutations() {
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationKey: SIGNUP_QUERY_KEY,
    mutationFn: async (data: SignupBody) => signup(data),

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginBody) => login(data),

    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: (data: LogoutBody) => logout(data),
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(["user"], null);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordBody) => forgotPassword(data),
    onSuccess: (response) => {},
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordBody) => resetPassword(data),
    onSuccess: (response) => {},
    onError: (error) => {
      toast.error(errorHandler(error));
    },
  });

  return {
    signupMutation,
    loginMutation,
    logoutMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
}
