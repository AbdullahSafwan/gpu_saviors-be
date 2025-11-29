import { PrismaClient, booking_status } from "@prisma/client";
import { debugLog } from "../services/helper";

const getWarrantyClaim = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.warranty_claim.findUnique({
      where: { id },
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
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getWarrantyClaimByClaimNumber = async (prisma: PrismaClient, claimNumber: string) => {
  try {
    const result = await prisma.warranty_claim.findUnique({
      where: { claimNumber },
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
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const listWarrantyClaims = async (
  prisma: PrismaClient,
  page: number,
  pageSize: number,
  _sort: string | null,
  _orderBy: string | null,
  searchString?: string,
  isActive?: boolean,
  claimBookingStatus?: booking_status
) => {
  try {
    const sort = (_sort ?? "id").toString();
    const order = _orderBy ?? "desc";
    const orderBy = { [sort]: order };

    const where = {
      AND: [
        isActive !== undefined ? { isActive } : {},
        claimBookingStatus ? { claimBooking: { is: { status: claimBookingStatus } } } : {},
        searchString
          ? {
              OR: [
                { claimNumber: { contains: searchString } },
                { originalBooking: { is: { clientName: { contains: searchString } } } },
                { originalBooking: { is: { code: { contains: searchString } } } },
                { claimBooking: { is: { code: { contains: searchString } } } },
              ],
            }
          : {},
      ],
    };

    const result = await prisma.warranty_claim.findMany({
      orderBy,
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        originalBooking: {
          select: {
            id: true,
            code: true,
            clientName: true,
            status: true,
          },
        },
        claimBooking: {
          select: {
            id: true,
            code: true,
            status: true,
          },
        },
        warrantyClaimItems: {
          select: {
            id: true,
            reportedIssue: true,
          },
        },
      },
    });

    const totalClaims = await prisma.warranty_claim.count({ where });
    const totalPages = Math.ceil(totalClaims / pageSize);

    return {
      claims: result,
      totalPages,
      totalClaims,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const validateWarrantyClaimExists = async (prisma: PrismaClient, id: number) => {
  const claim = await prisma.warranty_claim.findUnique({
    where: { id },
  });
  return !!claim;
};

export const warrantyClaimDao = {
  getWarrantyClaim,
  getWarrantyClaimByClaimNumber,
  listWarrantyClaims,
  validateWarrantyClaimExists,
};
