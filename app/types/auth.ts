import { KycRequest } from "@/lib/contexts/auth-context";

// Auth related types
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string | null;
  kycStatus: string;
  avatar?: string;
  property_owner_profile: {};
  kyc_request: KycRequest;
  roles: [];
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  refreshToken: string | null;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}
// Common API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}
