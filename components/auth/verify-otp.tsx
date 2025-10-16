"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { Logo } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { errorHandler } from "@/helpers/error-handler";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";
import { reSendOtp, verifyOtp } from "@/services/auth/auth.service";
import { setTokens } from "@/utils/auth-storage";

const length = 4;

export default function VerifyOtpComponent() {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const { updateUser } = useAuth();

  const email = searchParams.get("email") || "";
  const step = searchParams.get("step") || "";

  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(length).fill(null)
  );

  // Timer countdown effect — runs only if timeLeft > 0
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format timer display
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);

    setCode(newCode);

    if (value && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("").slice(0, length);
    const newCode = [...code];

    digits.forEach((digit, index) => {
      if (index < length) newCode[index] = digit;
    });

    setCode(newCode);

    const nextEmptyIndex = newCode.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    setActiveIndex(focusIndex);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    if (!code.every((digit) => digit !== "")) return;

    setIsVerifying(true);

    try {
      const response = await verifyOtp({ email, otp: code.join("") });

      if (response.success) {
        setTokens(response?.data?.access_token, "");
        setTimeLeft(60);

        if (step === "signup") {
          const res = await axiosInstance.get("/user-details");
          const user = res.data;
          const userData = JSON.stringify(user?.data);
          const parsedData = JSON.parse(userData);
          await updateUser(parsedData);
          router.push("/universal-dashboard");
        } else {
          router.push(
            `/auth/reset-password?email=${encodeURIComponent(email)}`
          );
        }
      }
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    router.push("/auth/login");
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      const response = await reSendOtp({
        email,
        action: step === "signup" ? "SIGNUP" : "FORGOT-PASSWORD",
      });
      if (response?.success) {
        toast.success(response?.message, {});
        setTimeLeft(60);
        setCode(Array(length).fill(""));
        setActiveIndex(0);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setIsResending(false);
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
        <div className="w-full max-w-max p-8 bg-white rounded-xl border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-1">
              Check your email to verify!
            </h2>
            <p className="text-gray-600 text-sm">
              Enter the otp sent to your email: {email}
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-2">
            {Array.from({ length }).map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={() => setActiveIndex(index)}
                className={cn(
                  "w-14 h-16 text-center text-2xl font-bold border rounded-md focus:outline-none focus:ring-2",
                  activeIndex === index
                    ? "border-primary-600 ring-primary-600/20"
                    : code[index]
                      ? "border-gray-300"
                      : "border-gray-200"
                )}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="text-center text-sm text-gray-500 mb-6">
            <p>This verification link expires after 1 minute.</p>

            {/* Show timer when active */}

            <div className="mt-2">
              <span>Didn't receive the code? </span>
              <button
                onClick={handleResend}
                className={`text-primary-600 hover:underline font-medium cursor-pointer ${
                  timeLeft > 0 || isResending
                    ? "disabled:no-underline disabled:text-gray-400 disabled:cursor-not-allowed"
                    : ""
                }`}
                disabled={isResending || timeLeft > 0}
              >
                {isResending
                  ? "Sending..."
                  : timeLeft > 0
                    ? `Resend Code (${formatTimeLeft()})`
                    : "Resend Code"}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="font-semibold border-gray-200 text-gray-800 hover:bg-primary-500 hover:text-white"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-600 hover:bg-[#5A8C00] text-white"
              onClick={handleVerify}
              disabled={!code.every((digit) => digit !== "") || isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
