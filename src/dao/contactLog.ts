import { Prisma, PrismaClient } from "@prisma/client";
import { debugLog } from "../services/helper";

const createContactLog = async (prisma: PrismaClient, data: Prisma.contact_logCreateInput) => {
  try {
    const result = await prisma.contact_log.create({
      //orm object relation model
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
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
    debugLog(error);
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
    debugLog(error);
    throw error;
  }
};

export const contactLogDao = { createContactLog, getContactLog, updateContactLog };
