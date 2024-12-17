import { Prisma, PrismaClient, token_type } from "@prisma/client";
import { debugLog } from "../services/helper";

const createUserVerificationToken = async (prisma: PrismaClient, data: Prisma.user_verification_tokenCreateInput) => {
  try {
    const result = await prisma.user_verification_token.create({
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const findUniqueUserVerificationToken = async (prisma: PrismaClient, token: string) => {
  try {
    const result = await prisma.user_verification_token.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const upsertToken = async (
  prisma: PrismaClient,
  type: token_type,
  userId: number,
  update: Prisma.user_verification_tokenUpdateInput,
  create: Prisma.user_verification_tokenCreateInput
) => {
  try {
    const result = await prisma.user_verification_token.upsert({
      where: { userId_type: { userId, type } },
      update,
      create,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const deleteUniqueUserVerificationToken = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.user_verification_token.delete({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const userVerificationTokenDao = {
  createUserVerificationToken,
  findUniqueUserVerificationToken,
  deleteUniqueUserVerificationToken,
  upsertToken,
};
