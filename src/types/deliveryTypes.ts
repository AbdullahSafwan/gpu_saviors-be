import { delivery_status, courier_type } from "@prisma/client";

// Interface for creating a new delivery
export interface CreateDeliveryRequest {
  bookingId: number;
  status: delivery_status;
  address: string;
  postalCode: number;
  courier: string;
  type: courier_type;
  phoneNumber: string;
  landmark?: string;
  secondaryPhoneNumber?: string;
  deliveryDate: Date;
  isActive?: boolean; // Optional, defaults to true in the model
}

// Interface for getting delivery details (by ID)
export interface GetDeliveryDetailsRequest {
  id: number;
}

// Interface for updating a delivery
export interface UpdateDeliveryRequest {
  id?: number;
  bookingId?: number;
  status?: delivery_status;
  address?: string;
  postalCode?: number;
  courier?: string;
  type?: courier_type;
  phoneNumber?: string;
  landmark?: string;
  secondaryPhoneNumber?: string;
  deliveryDate?: Date;
  isActive?: boolean;
}
