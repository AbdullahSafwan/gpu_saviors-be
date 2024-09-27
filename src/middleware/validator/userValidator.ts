import { body } from "express-validator";
import { RequestHandler } from "express";
const userCreateValidator : RequestHandler = (req, res, next) => {
    body('firstName').isAlpha().withMessage("First Name is invalid");
    body('lastName').isAlpha().withMessage("LastName is invalid");
    body('phoneNumber').isMobilePhone("any").withMessage("InvalidPhone Number")
    next();
}

export const userValidator = {userCreateValidator}