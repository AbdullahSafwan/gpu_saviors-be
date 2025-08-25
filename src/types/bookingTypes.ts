import { booking_item_type, booking_status, payment_method, payment_status } from "@prisma/client";
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
  code?: string;
  paidAmount?: number;
  booking_items: BookingItem[];
}

export interface GetBookingDetailsRequest {
  id: number;
}

export interface UpdateBookingRequest {
  clientName?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  paidAmount?: number;
  booking_items?: (UpdateBookingItem | CreateBookingItem)[];
  contact_log?: (UpdateContactLogRequest | CreateContactLogRequest)[];
  delivery?: (CreateDeliveryRequest | UpdateDeliveryRequest)[];
  booking_payment?: (UpdateBookingPayment | CreateBookingPayment)[];
  status?: booking_status;
}

export interface ListBookingsRequest {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  orderBy?: string;
  status?: booking_status;
  searchString?: string;
}

export interface UpdateBookingItem {
  id: number;
  name?: string;
  type?: booking_item_type;
  payableAmount?: number;
  paidAmount?: number;
  reportedIssue?: string;
}

export interface CreateBookingItem {
  name: string;
  type: booking_item_type;
  payableAmount: number;
  paidAmount?: number;
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
}

export interface UpdateBookingPayment {
  id: number;
  payableAmount?: number;
  paidAmount?: number;
  status?: payment_status;
  paymentMethod?: payment_method;
  recipientName?: string;
  transactionId?: string;
}
