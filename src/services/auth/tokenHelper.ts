import crypto from "crypto";
import { PrismaClient, token_type } from "@prisma/client";
import { userVerificationTokenDao } from "../../dao/userVerificationToken";

/**
 * Generates a unique token for user verification or password reset and stores it in the database.
 *
 * @param {PrismaClient} prisma - The Prisma Client instance to interact with the database.
 * @param {number} userId - The ID of the user for whom the token is being generated.
 * @param {token_type} tokenType - The type of token being generated (e.g., EMAIL_VERIFICATION, PASSWORD_RESET).
 * @param {number} expiresInM - The expiration time of the token in minutes.
 *
 * @returns {Promise<{ token: string; expiresAt: Date }>} - Returns the generated token and its expiration timestamp.
 *
 * @throws {Error} - Throws an error if the token creation in the database fails.
 *
 * @example
 * // Generate a password reset token for a user
 * const { token, expiresAt } = await generateUserToken(prisma, 1, token_type.PASSWORD_RESET, 60);
 * console.log(token); // Randomly generated token
 * console.log(expiresAt); // Expiration timestamp
 *
 * @description
 * This function generates a secure random token using `crypto.randomBytes`, calculates its expiration
 * time, and saves the token along with the associated user and type in the database. It ensures
 * that tokens are linked to users and can be used for various purposes like email verification
 * or password reset based on the provided `tokenType`.
 */

export const generateUserToken = async (
  prisma: PrismaClient,
  userId: number,
  tokenType: token_type,
  expiresInM: number
): Promise<{ token: string; expiresAt: Date }> => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + expiresInM * 60 * 1000);

  const create = {
    user: {
      connect: {
        id: userId,
      },
    },
    token,
    type: tokenType,
    expiresAt,
  };

  const update = {
    token,
    expiresAt,
  };

  // Use upsert to ensure only the latest token is stored
  const result = await userVerificationTokenDao.upsertToken(prisma, tokenType, userId, update, create);

  return { token: result.token, expiresAt: result.expiresAt };
};
