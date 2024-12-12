import { userDao } from "../../dao/user";
import prisma from "../../prisma";
import { RefreshTokenRequest, LogInRequest, SignUpRequest } from "../../types/authTypes";
import { debugLog } from "../helper";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { userSessionDao } from "../../dao/userSession";

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

const logInUser = async (data: LogInRequest) => {
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
    return jwt.sign(jwtPayload, accessKeySecret, { expiresIn: "15s" }); // Adjust expiration as needed
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
export const authService = { signUpUser, logInUser, refreshAccessToken, logOut };
