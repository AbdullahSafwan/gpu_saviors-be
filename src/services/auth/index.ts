import { userDao } from "../../dao/user";
import prisma from "../../prisma";
import {
  RefreshTokenRequest,
  LogInRequest,
  SignUpRequest,
  VerifyMailRequest,
  VerifyTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../../types/authTypes";
import { debugLog } from "../helper";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { userSessionDao } from "../../dao/userSession";
import { sendEmail } from "../email";
import { token_type } from "@prisma/client";
import { userVerificationTokenDao } from "../../dao/userVerificationToken";
import { generateUserToken } from "./tokenHelper";

const accessKeySecret = process.env.JWT_ACCESS_KEY_SECRET!;
const refreshKeySecret = process.env.JWT_REFRESH_KEY_SECRET!;

interface CustomJwtPayload extends JwtPayload {
  email: string;
  userId: number;
}

const signUpUser = async (data: SignUpRequest) => {
  try {
    const existingUser = await userDao.findUserByEmail(prisma, data.email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const result = await userDao.createUser(prisma, data);
    await sendVerificationMail({ email: result.email });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const logInUser = async (data: LogInRequest) => {
  try {
    const { email, password } = data;
    const user = await userDao.findUserByEmail(prisma, email);
    if (!user) throw new Error("User not found");
    if (!user.isVerified) throw new Error("Account not verified");

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("Wrong password");

    const jwtPayload: CustomJwtPayload = {
      email: user.email,
      userId: user.id,
    };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = jwt.sign(jwtPayload, refreshKeySecret, { expiresIn: "7d" });
    await userSessionDao.createSession(prisma, user.id, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const refreshAccessToken = async (data: RefreshTokenRequest): Promise<string> => {
  try {
    const { refreshToken } = data;
    if (!refreshToken) throw new Error("Refresh token required");

    const session = await userSessionDao.findSessionByToken(prisma, refreshToken);
    if (!session) throw new Error("Invalid refresh token");

    const user = jwt.verify(refreshToken, refreshKeySecret) as CustomJwtPayload;

    if (!user || !user.email || !user.userId) {
      throw new Error("Invalid token payload");
    }

    const accessToken = generateAccessToken({ email: user.email, userId: user.userId });
    return accessToken;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

function generateAccessToken(jwtPayload: CustomJwtPayload): string {
  try {
    return jwt.sign(jwtPayload, accessKeySecret, { expiresIn: "60m" });
  } catch (error) {
    debugLog(error);
    throw error;
  }
}

const logOut = async (data: RefreshTokenRequest) => {
  try {
    const { refreshToken } = data;
    const result = await userSessionDao.deleteSessionByToken(prisma, refreshToken);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const sendVerificationMail = async (data: VerifyMailRequest) => {
  try {
    const { email } = data;
    const user = await userDao.findUserByEmail(prisma, email);
    if (!user) throw new Error("Email not found");
    if (user.isVerified) throw new Error("User already verified");
    // Generate a unique token of 24 hours validity
    const { token } = await generateUserToken(prisma, user.id, token_type.EMAIL_VERIFICATION, 24 * 60);
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const emailRes = await sendEmail(email, "Email Verification", `Verify your email by clicking this link: ${verificationUrl}`);
    return emailRes;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const verifyEmail = async (data: VerifyTokenRequest) => {
  try {
    const { token } = data;
    const storedToken = await userVerificationTokenDao.findUniqueUserVerificationToken(prisma, token);
    if (!storedToken || storedToken.type !== token_type.EMAIL_VERIFICATION || storedToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired token.");
    }
    const result = await userDao.updateUser(prisma, storedToken.user.id, {
      isVerified: true,
    });
    await userVerificationTokenDao.deleteUniqueUserVerificationToken(prisma, storedToken.id);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const forgotPassword = async (data: ForgotPasswordRequest) => {
  try {
    const { email } = data;
    const user = await userDao.findUserByEmail(prisma, email);
    if (!user) throw new Error(`No user found against the email ${email}`);

    // generate token valid for 1 hour
    const { token } = await generateUserToken(prisma, user.id, token_type.PASSWORD_RESET, 60);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const emailRes = await sendEmail(email, "Password Reset", `Reset your password by clicking this link: ${resetUrl}`);
    return emailRes;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const resetPassword = async (data: ResetPasswordRequest) => {
  const { token, newPassword } = data;

  // Find the token in the database
  const storedToken = await userVerificationTokenDao.findUniqueUserVerificationToken(prisma, token);

  if (!storedToken || storedToken.type !== token_type.PASSWORD_RESET || storedToken.expiresAt < new Date()) {
    throw new Error("Invalid or expired token.");
  }

  // Hash the new password
  const bcrypt = require("bcrypt");
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userDao.updateUser(prisma, storedToken.user.id, {
    password: hashedPassword,
  });
  await userVerificationTokenDao.deleteUniqueUserVerificationToken(prisma, storedToken.id);

  return "Password reset successfully.";
};
export const authService = {
  signUpUser,
  logInUser,
  refreshAccessToken,
  logOut,
  sendVerificationMail,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
