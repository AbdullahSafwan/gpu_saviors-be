import { PrismaClient } from "@prisma/client";
import { locationDao } from "../../dao/location";

const getActiveLocations = async (prisma: PrismaClient) => {
  try {
    const locations = await locationDao.listActiveLocations(prisma);
    return locations;
  } catch (error) {
    throw error;
  }
};

export const locationService = { getActiveLocations };
