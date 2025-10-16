"use client";

import Cookies from "js-cookie";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { EUserRole } from "@/layouts/dashboard-layout/sidebar-data";
import useStorage from "@/utils/useStorage";

export type UserRole = "tenant" | "property_owner" | "vendor" | null;
export type KYCStatus = "pending" | "approved" | "rejected";

export type KycRequest = {
  id: number;
  id_type: string;
  status: KYCStatus;
  created_at: string;
  review_notes?: string;
};

export interface User {
  id: string;
  roles: string[];
  avatar?: string;
  property_owner_profile: {
    id: number;
    user_id: number;
    business_name: string;
    business_address: string;
    business_type: string;
    business_website: string;
    company_registration_number: string;
    business_license: string;
    profile_image_path: string;
    registration_type: string;
    created_at: string;
    modified_at: string;
  };
  vendor_profile: {
    id: number;
    user_id: number;
    vendor_role: string;
    business_name: string;
    business_address: string;
    business_website: string;
    tax_id: string;
    business_type: string;
    profile_image_path: string;
    registration_type: string;
    business_license: string;
    created_at: string;
    modified_at: string;
  };
  tenant_profile: {
    id: number;
    user_id: number;
    full_name: string;
    phone_number: string;
    email: string;
    profile_image_path: string;
    created_at: string;
    modified_at: string;
  };
  kyc_request?: KycRequest;
  user?: {
    first_name: string;
    last_name: string;
    email?: string;
    phone_number?: string;
  };
}

interface AuthContextType {
  user: User | null;
  updateUser: (newUser: User | null) => void;
  userLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  currentUserRole: EUserRole | null;
  updateCurrentUserRole: (newRole: EUserRole | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = useStorage.getItem("rental-guru-user");

    if (storedUser && typeof storedUser === "object") {
      return storedUser as User;
    }

    return null;
  });

  const [currentUserRole, setCurrentUserRole] = useState<EUserRole | null>(
    () => {
      const storedRole = Cookies.get("current_user_role");

      if (storedRole) {
        return storedRole as EUserRole;
      }

      return null;
    }
  );

  const [isLoading, setIsLoading] = useState(true);

  const updateUser = async (newUser: User | null) => {
    setUser(newUser);

    if (newUser) {
      try {
        useStorage.setItem("rental-guru-user", newUser);
        if (newUser?.kyc_request && newUser?.kyc_request?.status) {
          Cookies.set("kyc_status", newUser.kyc_request?.status);
        }
      } catch (error) {
        useStorage.removeItem("rental-guru-user");
      }
    } else {
      useStorage.removeItem("rental-guru-user");
    }
  };

  const updateCurrentUserRole = async (newRole: EUserRole | null) => {
    setCurrentUserRole(newRole);

    if (newRole) {
      try {
        Cookies.set("current_user_role", newRole);
      } catch (error) {
        Cookies.remove("current_user_role");
      }
    } else {
      Cookies.remove("current_user_role");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const storedUser = useStorage.getItem("rental-guru-user");
    const storedRole = Cookies.get("current_user_role");

    if (typeof storedUser === "string" && storedUser && !user) {
      try {
        const decodedUser = decodeURIComponent(storedUser);
        setUser(JSON.parse(decodedUser));
      } catch (error) {
        throw new Error("Failed to parse user data from storage", {
          cause: error,
        });
      }
    }

    if (storedRole) {
      setCurrentUserRole(storedRole as EUserRole);
    }

    setIsLoading(false);
  }, [user, currentUserRole]);

  const logout = () => {
    setUser(null);
    useStorage.clearStorage();
    Cookies.remove("rental_guru_token");
    Cookies.remove("kyc_status");
    Cookies.remove("rental-guru-user");
    Cookies.remove("is_profile_completed");
    Cookies.remove("current_user_role");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        userLoading: isLoading,
        isAuthenticated: !!user,
        logout,
        currentUserRole,
        updateCurrentUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
