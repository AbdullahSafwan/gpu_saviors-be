// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { sendErrorResponse } from "../services/responseHelper";

const accessKeySecret = process.env.JWT_ACCESS_KEY_SECRET!;

// type jwtPayload = {
//   email: string;
//   userId: number;
// };
interface CustomRequest extends Request {
  user: string | jwt.JwtPayload | undefined;
}
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, accessKeySecret, (err, user) => {
      if (err) {
        sendErrorResponse(res, 403, "Forbidden", "Invalid access token");
      }
      (req as CustomRequest).user = user;
      next();
    });

    // const decoded = jwt.verify(token, accessKeySecret) as jwtPayload;

    // (req as CustomRequest).user = decoded;

    // const user = await userDao.getUser(prisma, decoded.userId);

    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
