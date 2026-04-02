import { Prisma, PrismaClient } from "../../generated/prisma/client";
import { debugLog } from "../services/helper";
import { RefundableItemCalculation } from "../types/refundTypes";

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

const getRefundWithItems = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.refund.findUnique({
      where: { id },
      include: {
        refundItems: {
          include: {
            bookingItem: {
              select: {
                id: true,
                code: true,
                name: true,
                type: true,
                serialNumber: true,
                payableAmount: true,
                paidAmount: true,
              },
            },
          },
        },
        booking: {
          select: {
            id: true,
            code: true,
            clientName: true,
            phoneNumber: true,
          },
        },
        warrantyClaim: {
          select: {
            id: true,
            claimNumber: true,
            claimDate: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        modifiedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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

const getBookingRefunds = async (prisma: PrismaClient, bookingId: number) => {
  try {
    const result = await prisma.refund.findMany({
      where: {
        bookingId,
        isActive: true,
      },
      include: {
        refundItems: {
          include: {
            bookingItem: {
              select: {
                id: true,
                code: true,
                name: true,
                type: true,
                serialNumber: true,
                payableAmount: true,
                paidAmount: true,
              },
            },
          },
        },
        warrantyClaim: {
          select: {
            id: true,
            claimNumber: true,
            claimDate: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        modifiedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        refundDate: 'desc',
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getRefundableItems = async (prisma: PrismaClient, bookingId: number): Promise<RefundableItemCalculation[]> => {
  try {
    // Get all booking items with their refund information
    const bookingItems = await prisma.booking_item.findMany({
      where: {
        bookingId,
        isActive: true,
      },
      include: {
        refundItems: {
          include: {
            refund: {
              select: {
                id: true,
                amount: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    // Map to RefundableItemCalculation
    const refundableItems: RefundableItemCalculation[] = bookingItems.map((item: any) => {
      const existingRefundItem = item.refundItems[0]; // Only one refund per item
      const hasExistingRefund = !!existingRefundItem && existingRefundItem.refund.isActive;
      const existingRefundAmount = hasExistingRefund ? existingRefundItem.amount : 0;
      const existingRefundId = hasExistingRefund ? existingRefundItem.refund.id : null;

      // maxRefundable = paidAmount (no deductions since only one refund allowed)
      const maxRefundable = item.paidAmount || 0;

      return {
        bookingItemId: item.id,
        itemCode: item.code,
        itemName: item.name,
        type: item.type,
        payableAmount: item.payableAmount,
        paidAmount: item.paidAmount,
        discountAmount: item.discountAmount,
        hasExistingRefund,
        existingRefundAmount,
        existingRefundId,
        maxRefundable,
      };
    });

    return refundableItems;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateBookingRefundStatus = async (prisma: PrismaClient, bookingId: number) => {
  try {
    // Calculate total refunded amount from all active refunds
    const refunds = await prisma.refund.findMany({
      where: {
        bookingId,
        isActive: true,
      },
      select: {
        amount: true,
      },
    });

    const totalRefunded = refunds.reduce((sum: number, refund: any) => sum + refund.amount, 0);
    const hasRefunds = totalRefunded > 0;

    // Update booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        hasRefunds,
        totalRefunded,
      },
    });

    return { hasRefunds, totalRefunded };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getBookingWithItemsAndRefunds = async (prisma: PrismaClient, bookingId: number) => {
  try {
    const result = await prisma.booking.findUnique({
      where: { id: bookingId, isActive: true },
      include: {
        booking_items: {
          where: { isActive: true },
          include: {
            refundItems: {
              include: {
                refund: {
                  select: {
                    id: true,
                    isActive: true,
                  },
                },
              },
            },
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

const getWarrantyClaim = async (prisma: PrismaClient, warrantyClaimId: number) => {
  try {
    const result = await prisma.warranty_claim.findUnique({
      where: { id: warrantyClaimId },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getBookingById = async (prisma: PrismaClient, bookingId: number) => {
  try {
    const result = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        clientId: true,
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getRefundWithRefundItems = async (prisma: PrismaClient, refundId: number) => {
  try {
    const result = await prisma.refund.findUnique({
      where: { id: refundId },
      include: {
        refundItems: true,
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const refundDao = {
  createRefund,
  getRefund,
  getRefundWithItems,
  updateRefund,
  getBookingRefunds,
  getRefundableItems,
  updateBookingRefundStatus,
  getBookingWithItemsAndRefunds,
  getWarrantyClaim,
  getBookingById,
  getRefundWithRefundItems,
};
