import { Prisma, PrismaClient } from "@prisma/client";
import { debugLog } from "../services/helper";

const createBookingItem = async (prisma: PrismaClient, data: Prisma.booking_itemCreateInput) => {
  try {
    const result = await prisma.booking_item.create({
      //orm object relation model
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getBookingItem = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.booking_item.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
const getBookingIdByBookingItemId = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.booking_item.findUnique({
      where: { id },
      select: { bookingId: true },
    }); // Fetch only the bookingId

    if (!result) {
      throw new Error(`Booking not found for bookingItemId: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateBookingItem = async (prisma: PrismaClient, id: number, data: Prisma.booking_itemUpdateInput) => {
  try {
    const result = await prisma.booking_item.update({
      where: { id },
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const bookingItemDao = { createBookingItem, getBookingItem, updateBookingItem, getBookingIdByBookingItemId };
