import prisma from "../../prisma";
import { debugLog } from "../helper";
import { refundDao } from "../../dao/refund";
import { CreateRefundRequest, UpdateRefundRequest } from "../../types/refundTypes";

const createRefund = async (data: CreateRefundRequest, createdBy?: number) => {
  try {
    const { paymentId, ...otherData } = data;
    const userId = createdBy || data.createdBy;
    const refundData = {
      ...otherData,
      booking_payment: {
        connect: { id: data.paymentId },
      },
      createdByUser: {
        connect: { id: userId },
      },
      modifiedByUser: {
        connect: { id: userId },
      },
    };

    const result = await refundDao.createRefund(prisma, refundData);

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

const updateRefund = async (id: number, data: UpdateRefundRequest, modifiedBy?: number) => {
  try {
    const record = await refundDao.getRefund(prisma, id);
    if (!record) {
      throw new Error(`refund not found against id: ${id}`);
    }
    const refundData = {
      ...data,
      ...(modifiedBy && {
        modifiedByUser: {
          connect: { id: modifiedBy },
        },
      }),
    };
    const result = await refundDao.updateRefund(prisma, id, refundData);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const refundService = { createRefund, getRefund, updateRefund };
