import { warrantyClaimDao } from "../../dao/warrantyClaim";
import { warrantyService } from "../warranty";
import { bookingDao } from "../../dao/booking";
import { CreateWarrantyClaimRequest, ListWarrantyClaimsRequest } from "../../types/warrantyClaimTypes";
import { debugLog } from "../helper";
import prisma from "../../prisma";

const generateClaimNumber = (): string => {
  const timestamp = new Date().getTime().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `WC-${timestamp}-${random}`;
};

const createWarrantyClaim = async (
  data: CreateWarrantyClaimRequest,
  userId: number
) => {
  try {
    const { bookingId, claimedItems, remarks } = data;

    // Validate booking exists
    const originalBooking = await bookingDao.getBooking(prisma, bookingId);
    if (!originalBooking) {
      throw new Error(`Booking not found with id: ${bookingId}`);
    }

    // Validate all claimed items have warranties and are eligible
    const eligibilityChecks = await Promise.all(
      claimedItems.map(async (item) => {
        const eligibility = await warrantyService.checkWarrantyEligibility(prisma, item.bookingItemId);

        if (!eligibility.eligible) {
          throw new Error(
            `Booking item ${item.bookingItemId} is not eligible for warranty claim. Reason: ${eligibility.reason}`
          );
        }

        // Verify the booking item belongs to the specified booking
        const bookingItem = originalBooking.booking_items.find(bi => bi.id === item.bookingItemId);
        if (!bookingItem) {
          throw new Error(
            `Booking item ${item.bookingItemId} does not belong to booking ${bookingId}`
          );
        }

        return {
          bookingItemId: item.bookingItemId,
          warrantyId: eligibility.warranty!.id,
          reportedIssue: item.reportedIssue,
          remarks: item.remarks,
          originalBookingItem: bookingItem,
        };
      })
    );

    // Generate unique claim number
    const claimNumber = generateClaimNumber();

    // Create warranty claim with new booking in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create new booking for warranty claim
      const claimBookingData = {
        clientName: originalBooking.clientName,
        phoneNumber: originalBooking.phoneNumber,
        whatsappNumber: originalBooking.whatsappNumber,
        status: originalBooking.status,
        code: new Date().getTime().toString(36).toUpperCase(),
        payableAmount: 0, // Warranty repairs are free
        paidAmount: 0,
        isWarrantyClaim: true,
        createdByUser: { connect: { id: userId } },
        modifiedByUser: { connect: { id: userId } },
        booking_items: {
          create: eligibilityChecks.map((check) => ({
            name: check.originalBookingItem.name,
            serialNumber: check.originalBookingItem.serialNumber,
            type: check.originalBookingItem.type,
            reportedIssue: check.reportedIssue,
            payableAmount: 0, // Warranty repairs are free
            paidAmount: 0,
            status: check.originalBookingItem.status,
            vendor: check.originalBookingItem.vendor,
            createdByUser: { connect: { id: userId } },
            modifiedByUser: { connect: { id: userId } },
          })),
        },
        booking_payments: {
          create: {
            payableAmount: 0,
            paidAmount: 0,
            status: "PAID" as const,
            paymentMethod: "CASH" as const,
            createdByUser: { connect: { id: userId } },
            modifiedByUser: { connect: { id: userId } },
          },
        },
      };

      const claimBooking = await tx.booking.create({
        data: claimBookingData,
        include: {
          booking_items: true,
          booking_payments: true,
        },
      });

      // Create warranty claim
      const warrantyClaim = await tx.warranty_claim.create({
        data: {
          originalBooking: { connect: { id: bookingId } },
          claimBooking: { connect: { id: claimBooking.id } },
          claimNumber,
          remarks,
          createdByUser: { connect: { id: userId } },
          modifiedByUser: { connect: { id: userId } },
          warrantyClaimItems: {
            create: eligibilityChecks.map((check) => ({
              warranty: { connect: { id: check.warrantyId } },
              reportedIssue: check.reportedIssue,
              remarks: check.remarks,
            })),
          },
        },
        include: {
          originalBooking: true,
          claimBooking: {
            include: {
              booking_items: true,
              booking_payments: true,
            },
          },
          warrantyClaimItems: {
            include: {
              warranty: {
                include: {
                  bookingItem: true,
                },
              },
            },
          },
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return warrantyClaim;
    });

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getWarrantyClaim = async (id: number) => {
  try {
    const result = await warrantyClaimDao.getWarrantyClaim(prisma, id);
    if (!result) {
      throw new Error(`Warranty claim not found with id: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getWarrantyClaimByClaimNumber = async (claimNumber: string) => {
  try {
    const result = await warrantyClaimDao.getWarrantyClaimByClaimNumber(prisma, claimNumber);
    if (!result) {
      throw new Error(`Warranty claim not found with claim number: ${claimNumber}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const listWarrantyClaims = async (params: ListWarrantyClaimsRequest) => {
  try {
    const page = parseInt(params.page || "1");
    const pageSize = parseInt(params.pageSize || "10");
    const sortBy = params.sortBy || null;
    const orderBy = params.orderBy || null;
    const searchString = params.searchString;

    const result = await warrantyClaimDao.listWarrantyClaims(
      prisma,
      page,
      pageSize,
      sortBy,
      orderBy,
      searchString
    );

    if (!result) {
      throw new Error("Failed to fetch warranty claims list");
    }

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const warrantyClaimService = {
  createWarrantyClaim,
  getWarrantyClaim,
  getWarrantyClaimByClaimNumber,
  listWarrantyClaims,
};
