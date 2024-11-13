import { delivery_status } from "@prisma/client";
import { body, param } from "express-validator";

const createDeliveryValidator = [
  body("address").notEmpty().withMessage("address is required"),

  body("phoneNumber").notEmpty().isMobilePhone("any").withMessage("Invalid Phone Number"),

  body("landmark").optional(),

  body("secondaryPhoneNumber").optional().notEmpty().withMessage("Secondary PhoneNumber is optional"),

  body("bookingId").isInt().notEmpty().withMessage("BookingId is required"),

  body("status").notEmpty().withMessage("status is req").bail().isIn(Object.values(delivery_status)),

  body("deliveryDate").notEmpty().withMessage("DateTime is required").isISO8601().toDate(),
];

const updateDeliveryValidator = [
  param("id").isInt().notEmpty().withMessage("id is required"),

  body("address").optional().notEmpty().withMessage("address is req"),

  body("phoneNumber").optional().notEmpty().isMobilePhone("any").withMessage("Invalid Phone Number"),

  body("landmark").optional(),

  body("secondaryPhoneNumber").optional().notEmpty().withMessage("Secondary PhoneNumber is optional"),

  body("bookingId").isInt().optional().notEmpty().withMessage("BookingId is required"),

  body("status").optional().notEmpty().withMessage("status is req"),

  body("deliveryDate").optional().notEmpty().withMessage("DateTime is required").isISO8601().toDate(),
];

export const deliveryValidator = { createDeliveryValidator, updateDeliveryValidator };
