import { PrismaClient } from "@prisma/client";
import { debugLog } from "../services/helper";

const getLocation = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.location.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const verifyLocationExists = async (prisma: PrismaClient, id: number) => {
  try {
    const location = await getLocation(prisma, id);
    return !!location;
  } catch (error) {
    debugLog(error);
    throw error;
  }
}

const listActiveLocations = async (prisma: PrismaClient) => {
  try {
    const result = await prisma.location.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
      },
      orderBy: { name: "asc" },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const locationDao = { getLocation, listActiveLocations, verifyLocationExists };
