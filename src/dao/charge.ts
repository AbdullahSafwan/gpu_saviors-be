import { Prisma, PrismaClient, service_charge_type } from "@prisma/client";
import { debugLog } from "../services/helper";

const createCharge = async (prisma: PrismaClient, data: Prisma.service_chargeCreateInput) => {
  try {
    const result = await prisma.service_charge.create({
      data,
      include: {
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

const getChargeById = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.service_charge.findUnique({
      where: { id },
      include: {
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

const listCurrentCharges = async (
  prisma: PrismaClient,
  filters: {
    type?: service_charge_type;
    productName?: string;
  },
) => {
  try {
    const where: Prisma.service_chargeWhereInput = {
      isActive: true,
      ...(filters.type && { type: filters.type }),
      ...(filters.productName && { productName: { contains: filters.productName } }),
    };

    const result = await prisma.service_charge.findMany({
      where,
      orderBy: { effectiveFrom: "desc" },
      distinct: ["productName", "type"],
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const listChargeHistory = async (
  prisma: PrismaClient,
  filters: {
    productName?: string;
    type?: service_charge_type;
  },
) => {
  try {
    const where: Prisma.service_chargeWhereInput = {
      ...(filters.type && { type: filters.type }),
      ...(filters.productName && { productName: filters.productName }),
    };

    const result = await prisma.service_charge.findMany({
      where,
      orderBy: { effectiveFrom: "desc" },
      include: {
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

const softDeleteCharge = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.service_charge.update({
      where: { id },
      data: { isActive: false },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const chargeDao = {
  createCharge,
  getChargeById,
  listCurrentCharges,
  listChargeHistory,
  softDeleteCharge,
};
