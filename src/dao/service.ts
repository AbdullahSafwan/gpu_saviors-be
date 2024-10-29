import prisma from "../prisma";
import { Prisma } from "@prisma/client";


const createService = async (data: Prisma.serviceCreateInput) => {
  try {
    const result = await prisma.service.create({ //orm object relation model
      data,
    });
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const serviceDao = { createService }