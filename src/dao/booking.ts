import { Prisma, PrismaClient } from "@prisma/client";


const createBooking = async (prisma: PrismaClient, data: Prisma.bookingCreateInput)=> {
  try{ const result = await prisma.booking.create({ //orm object relation model
    data,
    
  }); return result
 } catch (error) {
    console.log(error);
    throw error;
  }
}
export const bookingDao = { createBooking }