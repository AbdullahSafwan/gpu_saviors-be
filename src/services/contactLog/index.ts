import prisma from "../../prisma";
import { debugLog } from "../helper";
import { contactLogDao } from "../../dao/contactLog";
import { CreateContactLogRequest, UpdateContactLogRequest } from "../../types/contactLogTypes";
import { bookingItemDao } from "../../dao/bookingItem";

const createContactLog = async (data: CreateContactLogRequest) => {
  try {
    const { userId, bookingItemId, ...otherData } = data;

    // find bookingId using BookingItemId
    const bookingId = (await bookingItemDao.getBookingIdByBookingItemId(prisma, bookingItemId)).bookingId;

    const contactLogData = {
      ...otherData,
      booking_item: {
        connect: { id: bookingItemId },
      },
      user: {
        connect: { id: userId },
      },

      booking: {
        connect: { id: bookingId },
      },
    };
    const result = await contactLogDao.createContactLog(prisma, contactLogData);

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

const updateContactLog = async (id: number, data: UpdateContactLogRequest) => {
  try {
    const record = await contactLogDao.getContactLog(prisma, id);
    if (!record) {
      throw new Error(`contact log not found against id: ${id}`);
    }

    const result = await contactLogDao.updateContactLog(prisma, id, data);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const contactLogService = { updateContactLog, createContactLog, getContactLog };
