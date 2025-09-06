import prisma from "../../prisma";
import { debugLog } from "../helper";
import { CreateDeliveryRequest, UpdateDeliveryRequest } from "../../types/deliveryTypes";
import { deliveryDao } from "../../dao/delivery";

const createDelivery = async (data: CreateDeliveryRequest, createdBy?: number) => {
  try {
    const { bookingId, ...rest } = data; // Destructure to exclude `bookingId`

    // Construct deliveryData, converting `bookingId` to a nested connect object
    const deliveryData = {
      ...rest,
      ...(createdBy && { createdBy }),
      booking: { connect: { id: bookingId } },
    };

    const result = await deliveryDao.createDelivery(prisma, deliveryData);

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getDelivery = async (id: number) => {
  try {
    const result = await deliveryDao.getDelivery(prisma, id);
    if (!result) {
      throw new Error(`delivery not found against id: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateDelivery = async (id: number, data: UpdateDeliveryRequest, modifiedBy?: number) => {
  try {
    const record = await deliveryDao.getDelivery(prisma, id);
    if (!record) {
      throw new Error(`delivery not found against id: ${id}`);
    }
    const deliveryData = {
      ...data,
      ...(modifiedBy && { modifiedBy }),
    };
    const result = await deliveryDao.updateDelivery(prisma, id, deliveryData);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const deliveryService = { createDelivery, getDelivery, updateDelivery };
