export interface CreateRefundRequest {
    paymentId: number;
    refundDate: Date;
    remarks?: string;
    amount: number;
    isActive: boolean;
    createdBy: number; // Required in schema
}

export interface GetRefundDetailsRequest {
    id: number;
}

export interface UpdateRefundRequest {
    paymentId?: number;
    refundDate?: Date;
    remarks?: string;
    amount?: number;
    isActive?: boolean;
    modifiedBy?: number; // Will be set by system
}