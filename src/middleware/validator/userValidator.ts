import { body } from "express-validator";

const userCreateValidator = [
  body("firstName").notEmpty().withMessage("First Name is required"),

  body("lastName").notEmpty().withMessage("LastName is required"),

  body("phoneNumber")
    .notEmpty()
    .isMobilePhone("any")
    .withMessage("Invalid Phone Number"),
];

export const userValidator = { userCreateValidator };
