import { Prisma, PrismaClient } from "@prisma/client";


const createBookingpayment = async (prisma: PrismaClient, data: Prisma.booking_paymentCreateInput) => {
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

const getBookingpaymet = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.booking_payment.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateBookingpayment = async (
  prisma: PrismaClient,
  id: number,
  data: Prisma.booking_paymentUpdateInput
) => {
  try {
    const result = await prisma.booking_payment.update({
      where: { id },
      data,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userDao = { createBookingpayment, getBookingpaymet, updateBookingpayment };

