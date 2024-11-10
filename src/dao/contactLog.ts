import { Prisma, PrismaClient } from "@prisma/client";

const createContactLog = async (prisma: PrismaClient, data: Prisma.contact_logCreateInput) => {
  try {
    const result = await prisma.contact_log.create({
      //orm object relation model
      data,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getContactLog = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.contact_log.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateContactLog = async (prisma: PrismaClient, id: number, data: Prisma.contact_logUpdateInput) => {
  try {
    const result = await prisma.contact_log.update({
      where: { id },
      data,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const contact_logDao = { createContactLog, getContactLog, updateContactLog };
