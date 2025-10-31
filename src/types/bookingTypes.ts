import { booking_item_type, booking_status, payment_method, payment_status, booking_item_status, client_type, ReferralSource } from "@prisma/client";
import { CreateContactLogRequest, UpdateContactLogRequest } from "./contactLogTypes";
import { CreateDeliveryRequest, UpdateDeliveryRequest } from "./deliveryTypes";

export interface BookingItem {
  name: string;
  type: booking_item_type;
  payableAmount: number;
  paidAmount?: number;
  reportedIssue?: string;
}

export interface CreateBookingRequest {
  clientName: string;
  phoneNumber: string;
  whatsappNumber: string;
  payableAmount: number;
  locationId: number;
  code?: string;
  paidAmount?: number;
  booking_items: BookingItem[];
  createdBy?: number; // Will be set by system
  clientType?: client_type;
  referralSource?: ReferralSource;
  referralSourceNotes?: string;
}

export interface GetBookingDetailsRequest {
  id: number;
}

export interface UpdateBookingRequest {
  clientName?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  paidAmount?: number;
  locationId?: number;
  booking_items?: (UpdateBookingItem | CreateBookingItem)[];
  contact_log?: (UpdateContactLogRequest | CreateContactLogRequest)[];
  delivery?: (CreateDeliveryRequest | UpdateDeliveryRequest)[];
  booking_payments?: (UpdateBookingPayment | CreateBookingPayment)[];
  status?: booking_status;
  modifiedBy?: number; // Will be set by system
  clientType?: client_type;
  referralSource?: ReferralSource;
  referralSourceNotes?: string;
}

export interface ListBookingsRequest {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  orderBy?: string;
  status?: booking_status;
  searchString?: string;
  isActive?: boolean;
}

export interface UpdateBookingItem {
  id: number;
  name?: string;
  type?: booking_item_type;
  payableAmount?: number;
  paidAmount?: number;
  reportedIssue?: string;
  status?: booking_item_status;
  modifiedBy?: number; // Will be set by system
}

export interface CreateBookingItem {
  name: string;
  type: booking_item_type;
  payableAmount: number;
  paidAmount?: number;
  createdBy?: number; // Will be set by system
}

export interface DashboardRequest {
  searchString?: string;
}

export interface CreateBookingPayment {
  payableAmount?: number;
  paidAmount?: number;
  status: payment_status;
  paymentMethod: payment_method;
  recipientName: string;
  transactionId: string;
  createdBy?: number; // Will be set by system
}

export interface UpdateBookingPayment {
  id: number;
  payableAmount?: number;
  paidAmount?: number;
  status?: payment_status;
  paymentMethod?: payment_method;
  recipientName?: string;
  transactionId?: string;
  modifiedBy?: number; // Will be set by system
}
