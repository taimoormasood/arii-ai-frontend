"use client";

import Cookies from "js-cookie";
import { ChevronDownIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { DashboardIcon, LogoutIcon, ManageProfileIcon } from "@/assets/icons";
import { defaultAvatar, Logo } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/lib/contexts/auth-context";

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout, userLoading, updateUser } = useAuth();
  const router = useRouter();

  const handleRoleSelection = async (
    role: "tenant" | "property_owner" | "vendor"
  ) => {
    if (!isAuthenticated) {
      // If not logged in, redirect to login
      router.push(
        "/auth/login?redirect=" + encodeURIComponent(`/kyc?role=${role}`)
      );

      return;
    }

    const res = await axiosInstance.get("/user-details");
    const user = res.data;
    const userData = await JSON.stringify(user?.data);
    const parsedData = await JSON.parse(userData);
    await updateUser(parsedData);

    if (
      parsedData &&
      parsedData?.kyc_request &&
      parsedData?.kyc_request?.status === "pending"
    ) {
      toast.dismiss();
      toast.error(
        "Your KYC is pending. Please wait for verification to complete before proceeding"
      );

      return;
    }
    if (
      parsedData &&
      parsedData?.kyc_request &&
      parsedData?.kyc_request?.status === "rejected"
    ) {
      toast.dismiss();
      toast.error("Your KYC verification was rejected. See the details below.");

      return;
    }

    if (
      parsedData &&
      parsedData?.kyc_request &&
      parsedData?.kyc_request?.status === "approved"
    ) {
      router.push(`/setup-account?role=${role}`);

      return;
    }

    if (parsedData && parsedData?.kyc_request === null) {
      // If logged in but KYC not verified, redirect to KYC
      router.push(`/kyc?role=${role}`);

      return;
    }
  };

  return (
    <header className="w-full py-4 px-4 md:px-16 flex items-center justify-between bg-white">
      {isOpen && (
        <MobileNav
          handleRoleSelection={handleRoleSelection}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      <Link href="/">
        <Image src={Logo} width={146} height={57} alt="Logo" />
      </Link>
      <div className="items-center space-x-4 md:space-x-10 hidden md:flex">
        <button
          onClick={() => router.push("/browse-listing")}
          className="text-gray-600 hover:text-primary-500 cursor-pointer text-sm font-medium"
        >
          Listing
        </button>
        <button
          // onClick={() => handleRoleSelection("vendor")}
          className="text-gray-600 hover:text-primary-500 cursor-pointer text-sm font-medium"
        >
          Communities
        </button>
        <button
          // onClick={() => handleRoleSelection("vendor")}
          className="text-gray-600 hover:text-primary-500 cursor-pointer text-sm font-medium"
        >
          How it works
        </button>
      </div>
      <nav className="hidden md:flex items-center space-x-6">
        {userLoading ? (
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-2 text-gray-600 mr-6">
            <span>{user?.user?.first_name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="border-0 outline-0">
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full focus-visible:ring-offset-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none outline-none border-none focus-within:border-none focus-within:outline-0 focus-visible:border-none focus-visible:outline-none focus-visible:right-0 focus:border-none focus:outline-0"
                >
                  <Avatar className="h-8 w-8 relative overflow-visible">
                    <AvatarImage
                      src={user?.avatar || defaultAvatar?.src}
                      alt={user?.user?.first_name || ""}
                    />
                    <AvatarFallback className="bg-primary-500 text-white">
                      {user?.user?.first_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                    <span className="absolute -right-5 top-3">
                      {" "}
                      <ChevronDownIcon />
                    </span>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white border-none"
                align="end"
                forceMount
              >
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard")}
                  className="cursor-pointer text-gray-700 text-sm"
                >
                  <DashboardIcon />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="cursor-pointer text-gray-700 text-sm"
                >
                  <ManageProfileIcon />
                  <span>Manage Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    router.push("/auth/login");
                  }}
                  className="cursor-pointer text-gray-700 text-sm"
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-primary-500 text-sm font-medium"
            >
              Log in
            </Link>
            <Button className="bg-primary-500 hover:bg-primary-700 text-white">
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </>
        )}
      </nav>
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  );
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  handleRoleSelection: (role: "tenant" | "property_owner" | "vendor") => void;
}

export function MobileNav({
  isOpen,
  onClose,
  handleRoleSelection,
}: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Sidebar */}
      <div className="relative text-left w-full max-w-md bg-white h-full overflow-y-auto animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-4 pt-4">
          <Button
            variant="ghost"
            className="bg-gray-200 rounded-full w-6 h-6"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleRoleSelection("property_owner")}
              className="text-gray-600 hover:text-primary-500 cursor-pointer text-sm font-medium"
            >
              Listing
            </button>
            <button
              onClick={() => handleRoleSelection("vendor")}
              className="text-gray-600 hover:text-primary-500 cursor-pointer text-sm font-medium"
            >
              Communities
            </button>
            <button
              onClick={() => handleRoleSelection("vendor")}
              className="text-gray-600 hover:text-primary-500 cursor-pointer text-sm font-medium"
            >
              How it works
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed w-full max-w-md bottom-0 p-4 bg-white flex gap-3">
          <Button
            variant="outline"
            className="flex-1 font-semibold border-primary-500 shadow text-primary-500 hover:bg-primary-500 hover:text-white"
          >
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button className="flex-1 bg-primary-500 hover:bg-primary-700 text-white">
            <Link href="/auth/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
