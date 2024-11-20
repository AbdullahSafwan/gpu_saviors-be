import prisma from "../../prisma";
import { debugLog } from "../helper";
import { refundDao } from "../../dao/refund";

const createRefund = async (data: any) => {
  try {
    const result = await refundDao.createRefund(prisma, data);

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getRefund = async (id: number) => {
  try {
    const result = await refundDao.getRefund(prisma, id);
    if (!result) {
      throw new Error(`refund not found against id: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateRefund = async (id: number, data: any) => {
  try {
    const result = await refundDao.updateRefund(prisma, id, data);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const refundService = { createRefund, getRefund, updateRefund };
