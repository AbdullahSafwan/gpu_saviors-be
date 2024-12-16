import { user_status } from "@prisma/client";

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  status?: user_status; // Optional, defaults to ENABLED in Prisma model
}

export interface LogInRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
export interface VerifyMailRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
