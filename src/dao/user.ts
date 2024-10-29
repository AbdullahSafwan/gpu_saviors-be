import { Prisma, PrismaClient } from "@prisma/client";


const createUser = async (prisma: PrismaClient, data: Prisma.userCreateInput) => {
  try {
    const result = await prisma.user.create({ //orm object relation model
      data,
    });
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userDao = { createUser }