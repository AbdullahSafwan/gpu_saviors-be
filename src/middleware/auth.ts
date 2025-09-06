// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { sendErrorResponse } from "../services/responseHelper";

const accessKeySecret = process.env.JWT_ACCESS_KEY_SECRET!;

interface CustomJwtPayload extends jwt.JwtPayload {
  email: string;
  userId: number;
}

export interface AuthenticatedRequest extends Request {
  user: CustomJwtPayload;
}
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, accessKeySecret, (err, user) => {
      if (err) {
        return sendErrorResponse(res, 401, "Forbidden", err.message);
      }
      (req as AuthenticatedRequest).user = user as CustomJwtPayload;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
