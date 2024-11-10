import { body } from "express-validator";

const createUserValidator = [
  body("firstName").notEmpty().withMessage("First Name is required"),

  body("lastName").notEmpty().withMessage("LastName is required"),

  body("phoneNumber").notEmpty().isMobilePhone("any").withMessage("Invalid Phone Number"),

  body("email").isEmail().optional().notEmpty().withMessage("Email is optional"),
];

const updateUserValidator = [
  body("id").isInt().notEmpty().withMessage("id is required"),

  body("firstName").optional().notEmpty().withMessage("First Name is required"),

  body("lastName").optional().notEmpty().withMessage("LastName is required"),

  body("phoneNumber").optional().notEmpty().isMobilePhone("any").withMessage("Invalid Phone Number"),

  body("email").isEmail().optional().notEmpty().withMessage("Email is optional"),
];
export const userValidator = { createUserValidator, updateUserValidator };
