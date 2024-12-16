import { body } from "express-validator";

const signUpValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required.")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long.")
    .trim(),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required.")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long.")
    .trim(),
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
  body("email").isEmail().withMessage("Email must be a valid email address.").notEmpty().withMessage("Email is required.").trim().normalizeEmail(),
  body("password")
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
    .withMessage("Password must be at least 8 characters long, contain atleast one Uppercase letter and one number"),
];

const logInValidator = [
  body("email").isEmail().withMessage("Email must be a valid email address.").notEmpty().withMessage("Email is required.").trim().normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

const resetPasswordValidator = [
  body("newPassword")
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
    .withMessage("Password must be at least 8 characters long, contain atleast one Uppercase letter and one number"),
  body("token").notEmpty().isString(),
];

export const authValidator = { signUpValidator, logInValidator, resetPasswordValidator };
