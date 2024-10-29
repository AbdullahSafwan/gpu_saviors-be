import prisma from "../prisma";
import { Prisma } from "@prisma/client";


const createBookingpayment = async (data: Prisma.booking_paymentCreateInput) => {
  try {
    const result = await prisma.booking_payment.create({ //orm object relation model
      data,
    });
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const booking_paymentDao = { createBookingpayment }