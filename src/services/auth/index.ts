import { userDao } from "../../dao/user";
import prisma from "../../prisma";
import { RefreshTokenRequest, SignInRequest, SignUpRequest } from "../../types/authTypes";
import { debugLog } from "../helper";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

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

    const hashedPassword = await bcrypt.hash(data.password, 8);
    data.password = hashedPassword;
    const result = await userDao.createUser(prisma, data);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const signInUser = async (data: SignInRequest) => {
  try {
    const { email, password } = data;
    const user = await userDao.findUserByEmail(prisma, email);
    if (!user) throw new Error("User not found");

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("Wrong password");

    const jwtPayload: CustomJwtPayload = {
      email: user.email,
      userId: user.id,
    };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = jwt.sign(jwtPayload, refreshKeySecret, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const refreshAccessToken = async (data: RefreshTokenRequest): Promise<string> => {
  try {
    const { refreshToken } = data;

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
    return jwt.sign(jwtPayload, accessKeySecret, { expiresIn: "5s" }); // Adjust expiration as needed
  } catch (error) {
    debugLog(error);
    throw error;
  }
}

export const authService = { signUpUser, signInUser, refreshAccessToken };
