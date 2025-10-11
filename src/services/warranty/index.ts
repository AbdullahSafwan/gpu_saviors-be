import { PrismaClient } from "@prisma/client";
import { warrantyDao } from "../../dao/warranty";
import { CreateWarrantyRequest, WarrantyEligibilityResponse } from "../../types/warrantyTypes";
import { debugLog } from "../helper";

const createWarranty = async (
  prisma: PrismaClient,
  data: CreateWarrantyRequest,
  userId: number
) => {
  try {
    const { bookingItemId, warrantyDays = 15, warrantyStartDate, warrantyEndDate } = data;

    // Calculate warranty dates if not provided
    const startDate = warrantyStartDate || new Date();
    const endDate = warrantyEndDate || new Date(startDate.getTime() + warrantyDays * 24 * 60 * 60 * 1000);

    const warranty = await warrantyDao.createWarranty(prisma, {
      bookingItem: {
        connect: { id: bookingItemId },
      },
      warrantyStartDate: startDate,
      warrantyEndDate: endDate,
      warrantyDays,
      createdByUser: {
        connect: { id: userId },
      },
      modifiedByUser: {
        connect: { id: userId },
      },
    });

    return warranty;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getWarrantyByBookingItem = async (prisma: PrismaClient, bookingItemId: number) => {
  try {
    const warranty = await warrantyDao.getWarrantyByBookingItem(prisma, bookingItemId);
    return warranty;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const checkWarrantyEligibility = async (
  prisma: PrismaClient,
  bookingItemId: number
): Promise<WarrantyEligibilityResponse> => {
  try {
    // Get warranty for the booking item
    const warranty = await warrantyDao.getWarrantyByBookingItem(prisma, bookingItemId);

    if (!warranty) {
      return {
        eligible: false,
        reason: "No warranty found for this booking item",
      };
    }

    if (!warranty.isActive) {
      return {
        eligible: false,
        warranty,
        reason: "Warranty is inactive",
      };
    }

    // Check if warranty has expired
    const currentDate = new Date();
    const warrantyEndDate = new Date(warranty.warrantyEndDate);

    if (currentDate > warrantyEndDate) {
      return {
        eligible: false,
        warranty,
        reason: "Warranty has expired",
      };
    }

    // Calculate days remaining
    const daysRemaining = Math.ceil(
      (warrantyEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      eligible: true,
      warranty,
      daysRemaining,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const warrantyService = {
  createWarranty,
  getWarrantyByBookingItem,
  checkWarrantyEligibility,
};
