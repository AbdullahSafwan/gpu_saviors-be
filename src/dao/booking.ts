import { Prisma, PrismaClient } from "@prisma/client";
import { debugLog } from "../services/helper";

const createBooking = async (prisma: PrismaClient, data: Prisma.bookingCreateInput) => {
  try {
    const result = await prisma.booking.create({
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getBooking = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.booking.findUnique({
      where: { id },
      include: {
        booking_items: true,
        booking_payments: true,
        contact_log: true,
        delivery: true,
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const listBookings = async (prisma: PrismaClient, page: number, pageSize: number) => {
  try {
    console.log(page, pageSize);
    const result = await prisma.booking.findMany({
      select: {
        clientName: true,
        code: true,
        createdAt: true,
        appointmentDate: true,
        whatsappNumber: true,
        id: true,
        booking_items: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateBooking = async (prisma: PrismaClient, id: number, data: Prisma.bookingUpdateInput) => {
  try {
    const result = await prisma.booking.update({
      where: { id },
      data,
      include: {
        booking_items: true,
        booking_payments: true,
        contact_log: true,
        delivery: true,
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const bookingDao = { createBooking, getBooking, updateBooking, listBookings };
