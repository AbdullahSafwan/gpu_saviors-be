import prisma from "../../prisma";
import { debugLog } from "../helper";
import { refundDao } from "../../dao/refund";
import { clientDao } from "../../dao/client";
import {
  CreateRefundRequest,
  UpdateRefundRequest,
  RefundItemRequest,
} from "../../types/refundTypes";

/**
 * Calculate maximum refundable amount for each item in a booking
 * @param bookingId - The booking ID
 * @returns Array of RefundableItemCalculation objects
 */
const calculateMaxRefundablePerItem = async (bookingId: number) => {
  try {
    const refundableItems = await refundDao.getRefundableItems(prisma, bookingId);
    return refundableItems;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Validate refund request before creating or updating
 * @param bookingId - The booking ID
 * @param items - Array of refund items
 * @param warrantyClaimId - Optional warranty claim ID
 * @param isUpdate - Whether this is an update operation
 */
const validateRefundRequest = async (
  bookingId: number,
  items: RefundItemRequest[],
  warrantyClaimId?: number,
  isUpdate: boolean = false
) => {
  try {
    // 1. Validate booking exists
    const booking = await refundDao.getBookingWithItemsAndRefunds(prisma, bookingId);

    if (!booking) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    // 2. Validate warranty claim if provided
    if (warrantyClaimId) {
      const warrantyClaim = await refundDao.getWarrantyClaim(prisma, warrantyClaimId);

      if (!warrantyClaim) {
        throw new Error(`Warranty claim ${warrantyClaimId} not found`);
      }

      // Verify warranty claim belongs to this booking
      if (warrantyClaim.originalBookingId !== bookingId) {
        throw new Error(
          `Warranty claim ${warrantyClaimId} does not belong to booking ${bookingId}`
        );
      }
    }

    // 3. Validate each refund item
    for (const item of items) {
      // Find the booking item
      const bookingItem = booking.booking_items.find((bi) => bi.id === item.bookingItemId);

      if (!bookingItem) {
        throw new Error(`Booking item ${item.bookingItemId} not found in booking ${bookingId}`);
      }

      // Check if item was paid
      if (!bookingItem.paidAmount || bookingItem.paidAmount === 0) {
        throw new Error(
          `Cannot refund booking item ${item.bookingItemId} - item has not been paid (paidAmount is ${bookingItem.paidAmount})`
        );
      }

      // Check if item already has a refund (only if creating, not updating)
      const hasExistingRefund =
        bookingItem.refundItems.length > 0 && bookingItem.refundItems[0].refund.isActive;

      if (!isUpdate && hasExistingRefund) {
        throw new Error(
          `Booking item ${item.bookingItemId} already has a refund. Please update the existing refund instead of creating a new one.`
        );
      }

      // Validate refund amount doesn't exceed item's paid amount
      if (item.amount > bookingItem.paidAmount) {
        throw new Error(
          `Refund amount ${item.amount} exceeds item paid amount ${bookingItem.paidAmount} for item ${item.bookingItemId}`
        );
      }

      // Validate positive amount
      if (item.amount <= 0) {
        throw new Error(`Refund amount must be positive for item ${item.bookingItemId}`);
      }
    }

    // 4. Validate at least one item
    if (items.length === 0) {
      throw new Error("At least one refund item is required");
    }

    return true;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Create refund with item-level breakdown
 * @param data - Refund data with items
 * @param createdBy - User ID creating the refund
 * @returns Created refund with items
 */
const createRefund = async (data: CreateRefundRequest, createdBy: number) => {
  try {
    const { bookingId, refundDate, remarks, warrantyClaimId, items } = data;

    // Validate refund request
    await validateRefundRequest(bookingId, items, warrantyClaimId, false);

    // Calculate total refund amount
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create refund record
      const refund = await tx.refund.create({
        data: {
          bookingId,
          warrantyClaimId: warrantyClaimId || null,
          amount: totalAmount,
          refundDate,
          remarks: remarks || null,
          isActive: true,
          createdBy,
          modifiedBy: createdBy,
        },
      });

      // 2. Create refund_item records for each item
      const refundItemsData = items.map((item) => ({
        refundId: refund.id,
        bookingItemId: item.bookingItemId,
        amount: item.amount,
        remarks: item.remarks || null,
      }));

      await tx.refund_item.createMany({
        data: refundItemsData,
      });

      // 3. Update booking_item.refundedAmount for each item
      for (const item of items) {
        await tx.booking_item.update({
          where: { id: item.bookingItemId },
          data: {
            refundedAmount: item.amount,
          },
        });
      }

      // 4. Update booking refund status
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          hasRefunds: true,
          totalRefunded: {
            increment: totalAmount,
          },
        },
      });

      // 5. Get booking with client info
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        select: { clientId: true },
      });

      // Return refund with items
      return tx.refund.findUnique({
        where: { id: refund.id },
        include: {
          refundItems: {
            include: {
              bookingItem: true,
            },
          },
        },
      });
    });

    // 6. Update client financials if applicable (outside transaction)
    const booking = await refundDao.getBookingById(prisma, bookingId);

    if (booking?.clientId) {
      await clientDao.updateClientFinancials(prisma, booking.clientId);
    }

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Update refund with item-level breakdown
 * @param refundId - Refund ID to update
 * @param data - Updated refund data
 * @param modifiedBy - User ID modifying the refund
 * @returns Updated refund with items
 */
const updateRefund = async (
  refundId: number,
  data: UpdateRefundRequest,
  modifiedBy: number
) => {
  try {
    const { refundDate, remarks, isActive, items } = data;

    // Get existing refund
    const existingRefund = await refundDao.getRefundWithRefundItems(prisma, refundId);

    if (!existingRefund) {
      throw new Error(`Refund ${refundId} not found`);
    }

    // If items are being updated, validate them
    if (items && items.length > 0) {
      await validateRefundRequest(existingRefund.bookingId, items, existingRefund.warrantyClaimId || undefined, true);
    }

    // Calculate new total amount if items provided
    const newTotalAmount = items ? items.reduce((sum, item) => sum + item.amount, 0) : existingRefund.amount;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update refund record
      const updatedRefund = await tx.refund.update({
        where: { id: refundId },
        data: {
          ...(refundDate && { refundDate }),
          ...(remarks !== undefined && { remarks }),
          ...(isActive !== undefined && { isActive }),
          ...(items && { amount: newTotalAmount }),
          modifiedBy,
        },
      });

      // 2. If items provided, update refund_item amounts
      if (items && items.length > 0) {
        for (const item of items) {
          // Update or create refund_item
          await tx.refund_item.upsert({
            where: {
              bookingItemId: item.bookingItemId,
            },
            update: {
              amount: item.amount,
              remarks: item.remarks || null,
            },
            create: {
              refundId,
              bookingItemId: item.bookingItemId,
              amount: item.amount,
              remarks: item.remarks || null,
            },
          });

          // Update booking_item.refundedAmount
          await tx.booking_item.update({
            where: { id: item.bookingItemId },
            data: {
              refundedAmount: item.amount,
            },
          });
        }
      }

      // 3. Recalculate booking refund status
      const allRefunds = await tx.refund.findMany({
        where: {
          bookingId: existingRefund.bookingId,
          isActive: true,
        },
        select: {
          amount: true,
        },
      });

      const totalRefunded = allRefunds.reduce((sum, r) => sum + r.amount, 0);

      await tx.booking.update({
        where: { id: existingRefund.bookingId },
        data: {
          hasRefunds: totalRefunded > 0,
          totalRefunded,
        },
      });

      // Return updated refund with items
      return tx.refund.findUnique({
        where: { id: refundId },
        include: {
          refundItems: {
            include: {
              bookingItem: true,
            },
          },
        },
      });
    });

    // 4. Update client financials if applicable (outside transaction)
    const booking = await refundDao.getBookingById(prisma, existingRefund.bookingId);

    if (booking?.clientId) {
      await clientDao.updateClientFinancials(prisma, booking.clientId);
    }

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get refund with all item details
 * @param id - Refund ID
 * @returns Refund with items and related data
 */
const getRefund = async (id: number) => {
  try {
    const result = await refundDao.getRefundWithItems(prisma, id);
    if (!result) {
      throw new Error(`Refund not found with id: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Update booking refund status (hasRefunds and totalRefunded)
 * @param bookingId - Booking ID
 * @returns Updated refund status
 */
const updateBookingRefundStatus = async (bookingId: number) => {
  try {
    const result = await refundDao.updateBookingRefundStatus(prisma, bookingId);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const refundService = {
  calculateMaxRefundablePerItem,
  validateRefundRequest,
  createRefund,
  updateRefund,
  getRefund,
  updateBookingRefundStatus,
};
