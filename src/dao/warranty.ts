import { Prisma, PrismaClient } from "@prisma/client";
import { debugLog } from "../services/helper";

const createWarranty = async (prisma: PrismaClient, data: Prisma.warrantyCreateInput) => {
  try {
    const result = await prisma.warranty.create({
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getWarrantyByBookingItem = async (prisma: PrismaClient, bookingItemId: number) => {
  try {
    const result = await prisma.warranty.findUnique({
      where: { bookingItemId },
      include: {
        bookingItem: {
          include: {
            booking: true,
          },
        },
        warrantyClaimItems: {
          include: {
            warrantyClaim: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const warrantyDao = {
  createWarranty,
  getWarrantyByBookingItem,
};
