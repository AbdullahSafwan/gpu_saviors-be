import { service_status } from "@prisma/client";
import { body } from "express-validator";

const createServiceValidator = [
  body("bookingItemId").notEmpty().withMessage("bookingItemId is required").isInt(),

  body("status").notEmpty().withMessage("status is required").bail().isIn(Object.values(service_status)),

  body("remarks").notEmpty().withMessage("Remarks required"),
];

const updateServiceValidator = [
  body("bookingItemId").optional().notEmpty().withMessage("bookingItemId is required").isInt(),

  body("status").optional().notEmpty().withMessage("status is required").bail().isIn(Object.values(service_status)),

  body("remarks").optional().notEmpty().withMessage("Remarks required"),
];
export const serviceValidator = { createServiceValidator, updateServiceValidator };
