import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const throwValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const valResult = validationResult(req);

  if (!valResult.isEmpty()) {
    return res.status(400).json({ errors: valResult.array() });
  }
  next();
};
