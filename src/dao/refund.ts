import prisma from "../prisma";
import { Prisma } from "@prisma/client";


const createRefund = async (data: Prisma.refundCreateInput) => {
  try {
    const result = await prisma.refund.create({ //orm object relation model
      data,
    });
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const refundDao = { createRefund }