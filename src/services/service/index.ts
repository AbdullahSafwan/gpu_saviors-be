import { serviceDao } from "../../dao/service";
import prisma from "../../prisma";
import { debugLog } from "../helper";
import { CreateServiceRequest, UpdateServiceRequest } from "../../types/serviceTypes";

const createService = async (data: CreateServiceRequest) => {
  try {
    const { bookingItemId, ...rest } = data; // Destructure to exclude `bookingitemId`

    // Construct serviceData , converting `bookingitemId` to a nested connect object
    const serviceData = {
      ...rest,
      booking_item: { connect: { id: bookingItemId } },
    };
    const result = await serviceDao.createService(prisma, serviceData);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getService = async (id: number) => {
  try {
    const result = await serviceDao.getService(prisma, id);
    if (!result) {
      throw new Error(`service not found against id: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateService = async (id: number, data: UpdateServiceRequest) => {
  try {
    const record = await serviceDao.getService(prisma, id);
    if (!record) {
      throw new Error(`service not found against id: ${id}`);
    }
    const result = await serviceDao.updateService(prisma, id, data);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const serviceService = { createService, getService, updateService };
