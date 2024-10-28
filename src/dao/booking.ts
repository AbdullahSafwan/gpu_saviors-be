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
export const bookingDao = { createBooking }