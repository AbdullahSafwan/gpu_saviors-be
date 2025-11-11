import { client_status } from "@prisma/client";

export interface CreateClientRequest {
  businessName: string;
  contactPersonName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email?: string;
  businessAddress?: string;
  city?: string;
  postalCode?: string;
  paymentTermsDays?: number;
  creditLimit?: number;
  locationId: number;
  notes?: string;
  createdBy?: number;
}

export interface UpdateClientRequest {
  businessName?: string;
  contactPersonName?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  businessAddress?: string;
  city?: string;
  postalCode?: string;
  paymentTermsDays?: number;
  creditLimit?: number;
  status?: client_status;
  locationId?: number;
  notes?: string;
  modifiedBy?: number;
}

export interface GetClientDetailsRequest {
  id: number;
}

export interface ListClientsRequest {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  orderBy?: string;
  status?: client_status;
  locationId?: string;
  searchString?: string;
  isActive?: boolean;
}

export interface DeleteClientRequest {
  id: number;
}

export interface GetClientBookingsRequest {
  clientId: number;
  page?: string;
  pageSize?: string;
  status?: string;
}

export interface GetClientFinancialSummaryRequest {
  clientId: number;
}
