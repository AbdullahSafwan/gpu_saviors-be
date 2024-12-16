import { PrismaClient } from "@prisma/client";
import { debugLog } from "../services/helper";

const createSession = async (prisma: PrismaClient, userId: number, refreshToken: string) => {
  try {
    return prisma.user_session.create({
      data: { userId, refreshToken },
    });
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const findSessionByToken = async (prisma: PrismaClient, refreshToken: string) => {
  try {
    return prisma.user_session.findUnique({
      where: { refreshToken },
    });
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const deleteSessionByToken = async (prisma: PrismaClient, refreshToken: string) => {
  try {
    return prisma.user_session.delete({
      where: { refreshToken },
    });
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const deleteAllSessionsForUser = async (prisma: PrismaClient, userId: number) => {
  try {
    return prisma.user_session.deleteMany({
      where: { userId },
    });
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const userSessionDao = { createSession, findSessionByToken, deleteSessionByToken, deleteAllSessionsForUser };
