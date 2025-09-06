import { service_status } from "@prisma/client";

export interface CreateServiceRequest {
    bookingItemId: number;
    status : service_status;
    remarks: string;
    isActive: boolean;
    createdBy?: number; // Will be set by system
}

export interface GetServiceRequestDetails {
    id: number;
}

export interface UpdateServiceRequest {
    bookingItemId?: number;
    status?: service_status;
    remarks?: string;
    isActive?: boolean;
    modifiedBy?: number; // Will be set by system
}
