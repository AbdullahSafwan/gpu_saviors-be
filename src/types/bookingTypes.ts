import { booking_item_type, booking_status, payment_method, payment_status, booking_item_status, client_type, ReferralSource, delivery } from "@prisma/client";
import { CreateContactLogRequest, UpdateContactLogRequest } from "./contactLogTypes";
import { CreateDeliveryRequest, UpdateDeliveryRequest } from "./deliveryTypes";

export interface BookingItem {
  name: string;
  type: booking_item_type;
  payableAmount: number;
  paidAmount?: number;
  reportedIssue?: string;
  discountAmount?: number;
}

export interface CreateBookingRequest {
  clientName?: string; // Optional for CORPORATE (auto-populated from client)
  phoneNumber?: string; // Optional for CORPORATE
  whatsappNumber?: string; // Optional for CORPORATE
  payableAmount: number;
  locationId: number;
  code?: string;
  paidAmount?: number;
  booking_items: BookingItem[];
  delivery?: delivery[];
  createdBy?: number; // Will be set by system
  clientType?: client_type;
  clientId?: number; // REQUIRED for CORPORATE bookings
  referralSource?: ReferralSource;
  referralSourceNotes?: string;
  comments?: string;
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
  clientId?: number; // Optional: link/update client
  referralSource?: ReferralSource;
  referralSourceNotes?: string;
  comments?: string;
}

export interface ListBookingsRequest {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  orderBy?: string;
  locationId?: string;
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
  modifiedBy?: number;
  discountAmount?: number;
}

export interface CreateBookingItem {
  name: string;
  type: booking_item_type;
  payableAmount: number;
  paidAmount?: number;
  createdBy?: number; // Will be set by system
  status?: booking_item_status;
  discountAmount?: number;
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
