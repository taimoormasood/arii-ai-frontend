import Image from "next/image";
import Link from "next/link";

import { Logo, TodolistStats } from "@/assets/images";

import { FeatureShowcase } from "./feature-showcase";
import { LoginForm } from "./login-form";
import { SignUpForm } from "./sign-up-form";

export function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* Left Section - Login Form */}
      <div className="flex-1 flex flex-col md:col-span-6 col-span-12 px-4 pb-4">
        <div className="mb-8 p-6 border-b border-gray-200">
          <Link href="/">
            <Image src={Logo} width={146} height={57} alt="Logo" />
          </Link>
        </div>
        <div className="flex-1  flex flex-col justify-center max-w-md mx-auto w-full">
          <LoginForm />
        </div>
      </div>

      {/* Right Section - Feature Showcase */}
      <div className="flex-1 col-span-6 signup-bg bg-[#F9FAFB] md:flex hidden items-center relative overflow-hidden">
        <div className="px-20 relative z-10">
          <Image
            width={544}
            height={377}
            className="h-auto mx-auto"
            src={TodolistStats}
            alt="Todo List Stats"
          />
          <div className="relative mt-6 mx-auto">
            <FeatureShowcase />
          </div>
        </div>
      </div>
    </div>
  );
}
