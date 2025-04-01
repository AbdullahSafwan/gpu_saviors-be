import { user_status } from "@prisma/client";

// Interface for creating a new user
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  status?: user_status; // Optional, defaults to ENABLED in Prisma model
}

// Interface for getting user details (by ID)
export interface GetUserDetailsRequest {
  id: number;
}

// Interface for updating a user
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  status?: user_status;
}
