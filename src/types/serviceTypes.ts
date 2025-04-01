import { service_status } from "@prisma/client";

export interface CreateServiceRequest {
    bookingItemId: number;
    status : service_status;
    remarks: string;
    isActive: boolean;
}

export interface GetServiceRequestDetails {
    id: number;
}

export interface UpdateServiceRequest {
    bookingItemId?: number;
    status?: service_status;
    remarks?: string;
    isActive?: boolean;
}
