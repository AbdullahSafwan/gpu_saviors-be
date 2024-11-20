import { courier_type, delivery_status } from "@prisma/client";
import { body } from "express-validator";

const createDeliveryValidator = [
  body("address").notEmpty().withMessage("address is required"),

  // body("phoneNumber").notEmpty().withMessage("phoneNumber is required").bail().isMobilePhone("any").withMessage("Invalid Phone Number"),

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

  body("landmark").optional(),

  body("secondaryPhoneNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Secondary PhoneNumber is optional")
    .bail()
    .matches(/^0[1-9]{2}[0-9]{7}$|^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid Phone Number"),

  body("bookingId").isInt().notEmpty().withMessage("BookingId is required"),

  body("status").notEmpty().withMessage("status is req").bail().isIn(Object.values(delivery_status)),

  body("deliveryDate").notEmpty().withMessage("DateTime is required").isISO8601().toDate(),

  body("postalCode").notEmpty().withMessage("Postal code is required").isInt(),

  body("courier").notEmpty().isString().withMessage("Courier name is required"),

  body("type").notEmpty().withMessage("courier type is required").bail().isIn(Object.values(courier_type)),
];

const updateDeliveryValidator = [
  body("id").isInt().notEmpty().withMessage("id is required"),

  body("address").optional().notEmpty().withMessage("address is req"),

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

  body("landmark").optional(),

  body("secondaryPhoneNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Secondary PhoneNumber is optional")
    .bail()
    .matches(/^0[1-9]{2}[0-9]{7}$|^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid Phone Number"),

  body("bookingId").isInt().optional().notEmpty().withMessage("BookingId is required"),

  body("status").optional().notEmpty().withMessage("status is req").bail().isIn(Object.values(delivery_status)),

  body("deliveryDate").optional().notEmpty().withMessage("DateTime is required").isISO8601().toDate(),

  body("postalCode").optional().notEmpty().withMessage("Postal code is required").isInt(),

  body("courier").optional().notEmpty().isString().withMessage("Courier name is required"),

  body("type").optional().notEmpty().withMessage("courier type is required").bail().isIn(Object.values(courier_type)),
];

export const deliveryValidator = { createDeliveryValidator, updateDeliveryValidator };
