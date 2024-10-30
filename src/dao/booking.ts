import prisma from "../prisma";
import { Prisma } from "@prisma/client";


const createBooking = async (data: Prisma.bookingCreateInput)=> {
  try{ const result = await prisma.booking.create({ //orm object relation model
    data,
    
  }); return result
 } catch (error) {
    console.log(error);
    throw error;
  }
}

const getBooking = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.booking.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateBooking = async (
  prisma: PrismaClient,
  id: number,
  data: Prisma.bookingUpdateInput
) => {
  try {
    const result = await prisma.booking.update({
      where: { id },
      data,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const bookingDao = { createBooking, getBooking, updateBooking };
