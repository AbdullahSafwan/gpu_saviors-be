import { contact_method } from "@prisma/client";
import { body } from "express-validator";


const contactLogCreateValidator = [
  body("bookingItemId").notEmpty().withMessage("BookingItemId is required").isInt(),

  body("userId").notEmpty().withMessage("userId is required").isInt(),

  body("bookingId").notEmpty().withMessage("bookingId is required").isInt(),

  body("contactedAt").notEmpty().isISO8601().toDate(),

  body("status").notEmpty().is(object.value(contact_method)),

  body("notes").notEmpty().withMessage("notes is required")


];

export const contactLogValidator = { contactLogCreateValidator };