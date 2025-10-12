import { PrismaClient } from "@prisma/client";
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
  searchString?: string
) => {
  try {
    const sort = (_sort ?? "id").toString();
    const order = _orderBy ?? "desc";
    const orderBy = { [sort]: order };

    const where: any = {};

    if (searchString) {
      where.OR = [
        { claimNumber: { contains: searchString } },
        { originalBooking: { clientName: { contains: searchString } } },
        { originalBooking: { code: { contains: searchString } } },
        { claimBooking: { code: { contains: searchString } } },
      ];
    }

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
}

export const warrantyClaimDao = {
  getWarrantyClaim,
  getWarrantyClaimByClaimNumber,
  listWarrantyClaims,
  validateWarrantyClaimExists,
};
