import { user_status } from "@prisma/client";
import { body } from "express-validator";

const createUserValidator = [
  body("firstName").notEmpty().withMessage("First Name is required"),

  body("lastName").notEmpty().withMessage("LastName is required"),

  body("phoneNumber")
    .notEmpty()
    .trim()
    .withMessage("Phone number is required") // Validate if it's not empty
    .bail()
    .isString()
    .withMessage("Phone number should be a valid string") // Validate if it's a string
    .bail()
    .matches(/^0[1-9]{2}[0-9]{7}$|^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid phone number"),

  body("email").isEmail().optional().notEmpty().withMessage("Email is optional"),

  body("status").notEmpty().withMessage("status is required").bail().isIn(Object.values(user_status)),
];

const updateUserValidator = [
  body("id").isInt().notEmpty().withMessage("id is required"),

  body("firstName").optional().notEmpty().withMessage("First Name is required"),

  body("lastName").optional().notEmpty().withMessage("LastName is required"),

  body("phoneNumber")
    .optional()
    .notEmpty()
    .trim()
    .withMessage("Phone number is optional") // Validate if it's not empty
    .bail()
    .isString()
    .withMessage("Phone number should be a valid string") // Validate if it's a string
    .bail()
    .matches(/^0[1-9]{2}[0-9]{7}$|^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid phone number"),

  body("email").isEmail().optional().notEmpty().withMessage("Email is optional"),

  body("status").optional().notEmpty().withMessage("status is required").bail().isIn(Object.values(user_status)),
];
export const userValidator = { createUserValidator, updateUserValidator };
