export interface RefundItemRequest {
    bookingItemId: number;
    amount: number;
    remarks?: string;
}

export interface CreateRefundRequest {
    bookingId: number;
    refundDate: Date;
    remarks?: string;
    warrantyClaimId?: number;
    items: RefundItemRequest[];
}

export interface UpdateRefundRequest {
    refundDate?: Date;
    remarks?: string;
    isActive?: boolean;
    items?: RefundItemRequest[];
}

export interface RefundableItemCalculation {
    bookingItemId: number;
    itemCode: string | null;
    itemName: string;
    type: string;
    payableAmount: number;
    paidAmount: number | null;
    discountAmount: number | null;
    hasExistingRefund: boolean;
    existingRefundAmount: number;
    existingRefundId: number | null;
    maxRefundable: number;
}

export interface Refund {
    id: number;
    bookingId: number;
    warrantyClaimId: number | null;
    amount: number;
    refundDate: Date;
    remarks: string | null;
    isActive: boolean;
    createdAt: Date;
    modifiedAt: Date;
    createdBy: number;
    modifiedBy: number;
    items: RefundItemDetail[];
}

export interface RefundItemDetail {
    id: number;
    refundId: number;
    bookingItemId: number;
    amount: number;
    remarks: string | null;
    bookingItem?: {
        id: number;
        code: string | null;
        name: string;
        type: string;
        serialNumber: string | null;
        payableAmount: number;
        paidAmount: number | null;
    };
}