import { Prisma } from "@prisma/client";
import { CreateBookingRequest, UpdateBookingRequest } from "../../types/bookingTypes";
import { bookingDao } from "../../dao/booking";
import prisma from "../../prisma";
import { debugLog } from "../helper";

export const createBooking = async (data: CreateBookingRequest) => {
  try {
    data.payableAmount = data.booking_items.reduce((total: number, item) => total + item.payableAmount, 0);

    // generate unique code using timestamp
    data.code = new Date().getTime().toString(36).toUpperCase();
    const bookingData = {
      ...data,
      booking_items: {
        create: data.booking_items,
      },
    };

    const result = await bookingDao.createBooking(prisma, bookingData);

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const getBooking = async (id: number) => {
  try {
    const result = await bookingDao.getBooking(prisma, id);
    if (!result) {
      throw new Error(`delivery not found against id: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const updateBooking = async (id: number, data: UpdateBookingRequest) => {
  try {
    const { booking_items, ...otherData } = data;
    const updateData: Prisma.bookingUpdateInput = {
      ...otherData,
      ...(booking_items && {
        booking_items: {
          updateMany: booking_items.map((item) => ({
            where: { id: item.id },
            data: { ...item },
          })),
        },
      }),
    };

    const result = bookingDao.updateBooking(prisma, id, updateData);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const bookingService = { updateBooking, createBooking, getBooking };
