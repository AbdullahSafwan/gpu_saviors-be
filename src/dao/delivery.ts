import prisma from "../prisma";
import { Prisma } from "@prisma/client";


const createDelivery = async (data: Prisma.deliveryCreateInput) => {
  try {
    const result = await prisma.delivery.create({ //orm object relation model
      data,
    });
    return result
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

export const deliveryDao = { createDelivery }