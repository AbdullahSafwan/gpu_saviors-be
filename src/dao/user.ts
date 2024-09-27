import prisma from "../prisma";
import { Prisma } from "@prisma/client";
const createUser = async (data: Prisma.userCreateInput) => {
  try {
    const result = await prisma.user.create({
      data,
    });
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userDao = { createUser }