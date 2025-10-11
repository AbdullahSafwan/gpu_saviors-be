export interface CreateWarrantyRequest {
  bookingItemId: number;
  warrantyDays?: number;
  warrantyStartDate?: Date;
  warrantyEndDate?: Date;
}

export interface WarrantyEligibilityResponse {
  eligible: boolean;
  warranty?: any;
  reason?: string;
  daysRemaining?: number;
}
