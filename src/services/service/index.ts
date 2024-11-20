import { serviceDao } from "../../dao/service";
import prisma from "../../prisma";
import { debugLog } from "../helper";

const createService = async (data: any) => {
  try {
    const result = await serviceDao.createService(prisma, data);
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

const updateService = async (id: number, data: any) => {
  try {
    const result = await serviceDao.updateService(prisma, id, data);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const serviceService = { createService, getService, updateService };
