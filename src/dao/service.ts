import { Prisma, PrismaClient } from "@prisma/client";


const createService = async (prisma: PrismaClient, data: Prisma.serviceCreateInput) => {
  try {
    const result = await prisma.service.create({ //orm object relation model
      data,
    });
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getService = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.service.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateService = async (
  prisma: PrismaClient,
  id: number,
  data: Prisma.serviceUpdateInput
) => {
  try {
    const result = await prisma.service.update({
      where: { id },
      data,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const serviceDao = { createService, getService, updateService };

