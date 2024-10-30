import { Prisma, PrismaClient } from "@prisma/client";

const createSystemconfiguration = async (
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

export const system_configurationDao = { createSystemconfiguration };