import { booking_status } from "@prisma/client";

export interface ClaimedItemRequest {
  bookingItemId: number;
  reportedIssue: string;
  remarks?: string;
}

export interface CreateWarrantyClaimRequest {
  bookingId: number;
  claimedItems: ClaimedItemRequest[];
  remarks?: string;
}

export interface ListWarrantyClaimsRequest {
  page?: string;
  pageSize?: string;
  searchString?: string;
  sortBy?: string;
  orderBy?: string;
  isActive?: boolean;
  claimBookingStatus?: booking_status;
}
