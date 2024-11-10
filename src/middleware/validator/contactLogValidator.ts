import { contact_method } from "@prisma/client";
import { body } from "express-validator";


const contactLogCreateValidator = [
  body("bookingItemId").notEmpty().withMessage("BookingItemId is required").isInt(),

  body("userId").notEmpty().withMessage("userId is required").isInt(),

  body("bookingId").notEmpty().withMessage("bookingId is required").isInt(),

  body("contactedAt").notEmpty().isISO8601().toDate(),

  body("status").notEmpty().withMessage("status is required").bail().isIn(Object.values(contact_method)),

  body("notes").notEmpty().withMessage("notes is required")


];

const contactLogUpdateValidator = [

  body("id").notEmpty().withMessage("id is required").isInt(),

  body("bookingItemId").optional().notEmpty().withMessage("BookingItemId is required").isInt(),

  body("userId").optional().notEmpty().withMessage("userId is required").isInt(),

  body("bookingId").optional().notEmpty().withMessage("bookingId is required").isInt(),

  body("contactedAt").optional().notEmpty().isISO8601().toDate(),

  body("status").optional().notEmpty().withMessage("status is required").bail().isIn(Object.values(contact_method)),

  body("notes").optional().notEmpty().withMessage("notes is required")

];



export const contactLogValidator = { contactLogCreateValidator, contactLogUpdateValidator };