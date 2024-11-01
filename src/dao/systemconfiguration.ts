import { Prisma, PrismaClient } from "@prisma/client";

const createSystemConfiguration = async (
  prisma: PrismaClient,
  data: Prisma.system_configurationCreateInput
) => {
  try {
    const result = await prisma.system_configuration.create({
      data,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getSystemConfiguration = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.system_configuration.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateSystemConfiguration = async (
  prisma: PrismaClient,
  id: number,
  data: Prisma.system_configurationUpdateInput
) => {
  try {
    const result = await prisma.system_configuration.update({
      where: { id },
      data,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const system_configurationDao = { createSystemConfiguration, getSystemConfiguration, updateSystemConfiguration };