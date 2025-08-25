import { contact_method } from "@prisma/client";

export interface CreateContactLogRequest {
    bookingItemId: number ;
    userId: number;
    // bookingId: number;
    contactedAt: Date;
    status: contact_method;
    notes: string;
    isActive: boolean;
}

export interface GetContactLogDetailsRequest {
    id: number;
}

export interface UpdateContactLogRequest {
    id?: number;
    bookingItemId?: number;
    userId?: number;
    // bookingId?: number;
    contactedAt?: Date;
    status?: contact_method;
    notes?: string;
    isActive?: boolean;
}