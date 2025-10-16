import {
  Bot,
  Building,
  Calendar,
  CreditCard,
  Heart,
  Home,
  MessageCircle,
  NotebookIcon,
  Settings,
  User,
  Users,
  UsersRound,
} from "lucide-react";

export enum EUserRole {
  PROPERTY_OWNER = "property_owner",
  VENDOR = "vendor",
  TENANT = "tenant",
  GENERAL = "general",
}

export interface NavigationItem {
  id?: string;
  title?: string;
  icon: React.ElementType;
  href: string;
  hasChild?: boolean;
  children?: NavigationSubItem[];
  roles?: EUserRole[];
}

export interface NavigationSubItem {
  id: string;
  text: string;
  title?: string;
  href: string;
  icon: React.ElementType;
  roles: EUserRole[];
}

const navigation: NavigationItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    roles: [EUserRole.PROPERTY_OWNER, EUserRole.VENDOR, EUserRole.TENANT],
  },
  //   {
  //     id: "home",
  //     text: "Home",
  //     title: "Home",
  //     icon: Home,
  //     href: "/dashboard",
  //     roles: [EUserRole.PROPERTY_OWNER, EUserRole.VENDOR, EUserRole.TENANT],
  //   },
  {
    id: "engagement",
    title: "Engagement",
    icon: Calendar,
    href: "/engagement",
    roles: [EUserRole.PROPERTY_OWNER],
  },
  {
    id: "guru-ai",
    title: "Guru AI",
    icon: Bot,
    href: "/guru-ai",
    roles: [EUserRole.PROPERTY_OWNER, EUserRole.TENANT],
  },
  {
    id: "my-properties",
    title: "My Properties",
    icon: Building,
    href: "/my-properties",
    roles: [EUserRole.PROPERTY_OWNER, EUserRole.TENANT],
  },
  {
    id: "vendors",
    title: "Vendors",
    icon: Heart,
    href: "/vendors",
    roles: [EUserRole.PROPERTY_OWNER],
  },
  {
    id: "communication",
    title: "Communication",
    icon: MessageCircle,
    href: "/communication",
    roles: [EUserRole.PROPERTY_OWNER, EUserRole.TENANT],
  },
  {
    id: "tenants",
    title: "Tenants",
    icon: Users,
    href: "/tenants",
    roles: [EUserRole.PROPERTY_OWNER],
  },
  {
    id: "payments",
    title: "Payments",
    icon: CreditCard,
    href: "/payments",
    roles: [EUserRole.PROPERTY_OWNER, EUserRole.TENANT],
  },
  {
    id: "administration",
    title: "Administration",
    icon: User,
    href: "/administration",
    roles: [EUserRole.PROPERTY_OWNER],
  },
  {
    id: "investors",
    title: "Investors",
    icon: UsersRound,
    href: "/investors",
    roles: [EUserRole.PROPERTY_OWNER],
  },

  //   tenant
  {
    id: "my-applications",
    title: "My Applications",
    icon: NotebookIcon,
    href: "/my-applications",
    roles: [EUserRole.TENANT],
  },
  {
    id: "maintenance-requests",
    title: "Maintenance Requests",
    icon: Settings,
    href: "/maintenance-requests",
    roles: [EUserRole.TENANT],
  },
];

/**
 * Function to get navigation items based on the user's role
 * @param role UserRole - The role of the logged-in user
 * @returns NavigationItem[] - List of accessible navigation items
 */
export const getNavigationByRole = (role: EUserRole): NavigationItem[] => {
  return navigation
    .filter((item) => item?.roles?.includes(role))
    .map((item) => ({
      ...item,
      children: item?.hasChild
        ? item?.children?.filter((child) => child?.roles?.includes(role))
        : undefined,
    }));
};
