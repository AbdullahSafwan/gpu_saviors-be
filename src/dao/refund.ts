import { Prisma, PrismaClient } from "@prisma/client";
import { debugLog } from "../services/helper";

const createRefund = async (prisma: PrismaClient, data: Prisma.refundCreateInput) => {
  try {
    const result = await prisma.refund.create({
      //orm object relation model
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getRefund = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.refund.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateRefund = async (prisma: PrismaClient, id: number, data: Prisma.refundUpdateInput) => {
  try {
    const result = await prisma.refund.update({
      where: { id },
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const refundDao = { createRefund, getRefund, updateRefund };
