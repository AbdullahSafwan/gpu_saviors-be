import { Prisma, PrismaClient } from "@prisma/client";


const createBookingitem = async (prisma: PrismaClient, data: Prisma.booking_itemCreateInput) => {
  try {
    const result = await prisma.booking_item.create({ //orm object relation model
      data,
    });
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getBookingitem = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.booking_item.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateBookingitem = async (
  prisma: PrismaClient,
  id: number,
  data: Prisma.booking_itemUpdateInput
) => {
  try {
    const result = await prisma.booking_item.update({
      where: { id },
      data,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const bookingitemDao = { createBookingitem, getBookingitem, updateBookingitem };

