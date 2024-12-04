import { booking_item_type } from "@prisma/client";

export interface BookingItem {
  name: string;
  type: booking_item_type;
  payableAmount: number;
  paidAmount?: number;
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
  booking_items?:( UpdateBookingItem | CreateBookingItem)[];
}



export interface UpdateBookingItem {
  id: number;
  name?: string;
  type?: booking_item_type;
  payableAmount?: number;
  paidAmount?: number;
}

export interface CreateBookingItem {
  name: string;
  type: booking_item_type;
  payableAmount: number;
  paidAmount?: number;
}
