import { serviceDao } from "../../dao/service";
import prisma from "../../prisma";
import { debugLog } from "../helper";
import { CreateServiceRequest, UpdateServiceRequest } from "../../types/serviceTypes";

const createService = async (data: CreateServiceRequest, createdBy: number) => {
  try {
    const { bookingItemId, ...rest } = data; // Destructure to exclude `bookingitemId`

    // Construct serviceData , converting `bookingitemId` to a nested connect object
    const serviceData = {
      ...rest,
      createdByUser: { connect: { id: createdBy } },
      modifiedByUser: { connect: { id: createdBy } },
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

const updateService = async (id: number, data: UpdateServiceRequest, modifiedBy: number) => {
  try {
    const record = await serviceDao.getService(prisma, id);
    if (!record) {
      throw new Error(`service not found against id: ${id}`);
    }
    const serviceData = {
      ...data,
      modifiedByUser: { connect: { id: modifiedBy } },
    };
    const result = await serviceDao.updateService(prisma, id, serviceData);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const serviceService = { createService, getService, updateService };
