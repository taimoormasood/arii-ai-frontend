export interface RefreshTokenBody {
  refresh: string;
}
export interface SignupBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number: string;
  invitation_id?: string;
  invitation_role?: string;
}

export interface VerifyOtp {
  email: string;
  otp: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
export interface ResendBody {
  email: string;
  action?: "SIGNUP" | "FORGOT-PASSWORD" | "SEND-OTP";
}
export interface UpdateEmailBody {
  email: string;
  otp: string;
}
export interface UpdatePhoneBody {
  phone: string;
  otp: string;
}
export interface VerifyMFACodeBody {
  otp: string;
  email: string;
  mfaEnabled: boolean;
}
export interface VerifySecurityQuestionBody {
  securityAnswer: string;
  securityQuestionField: string;
  otp: string;
}
export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  new_password: string;
  confirm_password: string;
  email: string;
}
export interface VerifPasswordBody {
  password: string;
}

export interface LogoutBody {
  refresh_token: string;
}

export interface VerifyKyc {
  id_type: string;
  front_image: File;
  back_image: File;
  notes: string;
}

export interface SetupOwnerProfile {
  registration_type: string;
  business_name: string;
  business_website: string;
  business_address: string;
  company_registration_number: string;
  business_type: string;
  profile_image_path: File;
  business_license: File;
  user_id?: number;
}

export interface SetupVendorProfileBody {
  services_offered?: string;
  service_area?: string;
  years_of_experience?: string;
  availability?: string;
  daily_availability?: string;
  emergency_services?: string;
  languages?: string;
  insurance_coverage?: string;
  insurance_years_of_experience?: string;
  other_certificates?: File[];
  description?: string;
  vendor_role?: string;
  registration_type?: string;
  business_name?: string;
  business_website?: string;
  business_address?: string;
  company_registration_number?: string;
  business_type?: string;
  business_license?: File;
  profile_image_path?: File;
}
