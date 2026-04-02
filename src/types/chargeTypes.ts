import { service_charge_type } from "@prisma/client";

export interface CreateChargeRequest {
  productName: string;
  type: service_charge_type;
  amount: number;
  description?: string;
  effectiveFrom?: string;
}

export interface ListChargesRequest {
  type?: service_charge_type;
  productName?: string;
}

export interface ListChargeHistoryRequest {
  productName?: string;
  type?: service_charge_type;
}
