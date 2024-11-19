import { courier_type, delivery_status } from "@prisma/client";
import { body } from "express-validator";

const createDeliveryValidator = [
  body("address").notEmpty().withMessage("address is required"),

  body("phoneNumber").notEmpty().withMessage("phoneNumber is required").bail().isMobilePhone("any").withMessage("Invalid Phone Number"),

  body("landmark").optional().isInt(),

  body("secondaryPhoneNumber").optional().notEmpty().withMessage("Secondary PhoneNumber is optional"),

  body("bookingId").isInt().notEmpty().withMessage("BookingId is required"),

  body("status").notEmpty().withMessage("status is req").bail().isIn(Object.values(delivery_status)),

  body("deliveryDate").notEmpty().withMessage("DateTime is required").isISO8601().toDate(),

  body ("postalCode").notEmpty().withMessage("Postal code is required").isInt(),

  body ("courier").notEmpty().isString().withMessage("Courier name is required"),

  body ("type").notEmpty().withMessage("courier type is required").bail().isIn(Object.values(courier_type))
];

const updateDeliveryValidator = [
  body("id").isInt().notEmpty().withMessage("id is required"),

  body("address").optional().notEmpty().withMessage("address is req"),

  body("phoneNumber").optional().notEmpty().isMobilePhone("any").withMessage("Invalid Phone Number"),

  body("landmark").optional().isInt(),

  body("secondaryPhoneNumber").optional().notEmpty().withMessage("Secondary PhoneNumber is optional"),

  body("bookingId").isInt().optional().notEmpty().withMessage("BookingId is required"),

  body("status").optional().notEmpty().withMessage("status is req").bail().isIn(Object.values(delivery_status)),

  body("deliveryDate").optional().notEmpty().withMessage("DateTime is required").isISO8601().toDate(),

  body ("postalCode").optional().notEmpty().withMessage("Postal code is required").isInt(),

  body ("courier").optional().notEmpty().isString().withMessage("Courier name is required"),

  body ("type").optional().notEmpty().withMessage("courier type is required").bail().isIn(Object.values(courier_type))
];

export const deliveryValidator = { createDeliveryValidator, updateDeliveryValidator };
