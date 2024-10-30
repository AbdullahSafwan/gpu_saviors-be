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

export const booking_itemDao = { createBookingitem }