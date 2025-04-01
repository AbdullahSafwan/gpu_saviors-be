export interface CreateRefundRequest {
    paymentId: number;
    refundDate: Date;
    remarks?: string;
    amount: number;
    isActive: boolean;
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
}