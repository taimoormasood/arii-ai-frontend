"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import {
  CommunicationUniversalIcon,
  DashboardIcon,
  JobListingIcon,
  LockUniversalIcon,
  LogoutIcon,
  ManageProfileIcon,
  PaymentUniversalIcon,
  RentalListingIcon,
  UniversalDashboardIcon,
} from "@/assets/icons";
import { defaultAvatar, guruLogo, Logo } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EUserRole } from "@/layouts/dashboard-layout/sidebar-data";
import SidebarSkeleton from "@/layouts/dashboard-layout/sidebar-skeleton";
import { useAuth } from "@/lib/contexts/auth-context";
import { usePropertyStore } from "@/lib/stores/use-property-store";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

const navItems = [
  {
    label: "Dashboard",
    icon: UniversalDashboardIcon,
    href: "/universal-dashboard",
    locked: false,
  },
  {
    label: "Rental Listing",
    icon: RentalListingIcon,
    href: "/universal-dashboard/rental-listing",
    locked: false,
  },
  {
    label: "Job Listing",
    icon: JobListingIcon,
    href: "/job-listing",
    locked: false,
  },
  {
    label: "Communication",
    icon: CommunicationUniversalIcon,
    href: "/communication",
    active: true,
    locked: true,
  },
  {
    label: "Payments",
    icon: PaymentUniversalIcon,
    href: "/payments",
    locked: true,
  },
];

const roles: { label: string; value: EUserRole }[] = [
  { label: "Property Manager", value: EUserRole.PROPERTY_OWNER },
  { label: "Tenant", value: EUserRole.TENANT },
  { label: "Vendor", value: EUserRole.VENDOR },
  { label: "General", value: EUserRole.GENERAL },
];

export default function UniversalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userLoading } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col w-full">
        <Header />
        <div className="flex flex-1">
          {userLoading ? <SidebarSkeleton /> : <DashboardSidebar />}
          <main className="flex-1 overflow-y-auto bg-gray-50 md:p-6 p-2">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Header() {
  const { user, logout, updateCurrentUserRole, currentUserRole } = useAuth();
  const router = useRouter();

  const handleRoleChange = async (value: UserRole | undefined) => {
    if (value === "property_owner") {
      await updateCurrentUserRole(EUserRole.PROPERTY_OWNER);
      router.push("/my-properties");
    } else if (value === "tenant") {
      await updateCurrentUserRole(EUserRole.TENANT);
      router.push("/dashboard");
    } else if (value === "vendor") {
      await updateCurrentUserRole(EUserRole.VENDOR);
      router.push("/dashboard");
    } else if (value === "general") {
      await updateCurrentUserRole(EUserRole.GENERAL);
      router.push("/universal-dashboard");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b-[#E6D6FF] bg-[#F3E8FF] px-6 py">
      <SidebarTrigger className="md:hidden" />
      <Link href={"/"}>
        <Image src={Logo} alt="Rental Guru" width={112} height={50} />
      </Link>

      <div className="ml-auto flex items-center gap-6">
        <CustomSelect<EUserRole>
          onValueChange={handleRoleChange}
          placeholder="Select Role"
          options={roles}
          value={currentUserRole ?? undefined}
        />
        <Button
          variant="ghost"
          size="icon"
          className="relative max-h-fit max-w-fit"
        >
          <Bell className="h-7 w-7 text-gray-600" />
          <Badge className="absolute flex items-center justify-center -top-2 -right-2 h-4 w-4 rounded-full bg-red-500 p-0 text-xs text-white">
            1
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="border-0 outline-0 ">
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full focus-visible:ring-offset-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none outline-none border-none focus-within:border-none focus-within:outline-0 focus-visible:border-none focus-visible:outline-none focus-visible:right-0 focus:border-none focus:outline-0"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.avatar || defaultAvatar?.src}
                  alt={user?.user?.first_name || ""}
                />
                <AvatarFallback className="bg-primary-500 text-white">
                  {user?.user?.first_name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
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
              onClick={() => {
                router.push("/dashboard");
              }}
              className="cursor-pointer text-gray-700 text-sm"
            >
              <DashboardIcon />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-gray-700 text-sm">
              <ManageProfileIcon />
              <span>Manage Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
    </header>
  );
}

function DashboardSidebar() {
  const pathname = usePathname();
  const { resetStore } = usePropertyStore();

  const { user } = useAuth();

  return (
  <Sidebar className="border-[#E6D6FF] bg-white">
      <SidebarHeader className="p-4">
        <div className="hidden md:flex md:items-center md:gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="Guru Logo"
            />
            <AvatarFallback className="bg-amber-100 text-amber-800">
              G
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold text-gray-900">Guru</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarMenu>
          {navItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            const isMyProperties = pathname.startsWith("/my-properties");

            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  onClick={() => {
                    if (isMyProperties) {
                      resetStore();
                    }
                  }}
                  className={cn(
                    "font-medium text-gray-700 hover:bg-gray-100",
                    isActive &&
                        "text-primary-500 bg-primary-200 hover:bg-primary-300 hover:text-primary-700"
                  )}
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <div className="flex items-center gap-x-3">
                      <item.icon className="h-4 w-4 max-h-4 max-w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.locked && user?.kyc_request?.status === "pending" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <LockUniversalIcon className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent className="w-80 p-3 border-none">
                            <div className="space-y-1 text-xs">
                              <h4 className="font-medium">
                                This section will unlock after your KYC is
                                approved.
                              </h4>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <div className="mt-auto p-4">
        <Image src={guruLogo} alt="Guru Logo" width={54} height={54} />
      </div>
    </Sidebar>
  );
}
