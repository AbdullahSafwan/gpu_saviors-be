import { bookingDao } from "../../dao/booking";
import prisma from "../../prisma";
import { debugLog } from "../helper";
import { contactLogDao } from "../../dao/contactLog";

const createContactLog = async (data: any) => {
  try {
    const result = await bookingDao.createBooking(prisma, data);

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getContactLog = async (id: number) => {
  try {
    const result = await contactLogDao.getContactLog(prisma, id);
    if (!result) {
      throw new Error(`contact log not found against id: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateContactLog = async (id: number, data: any) => {
  try {
    const result = await contactLogDao.updateContactLog(prisma, id, data);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const contactLogService = { updateContactLog, createContactLog, getContactLog };
