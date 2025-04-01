import { body, query } from "express-validator";
import { booking_status, booking_item_type } from "@prisma/client";
import { formatWhatsAppNumber } from "./helper";

const createBookingValidator = [
  // Validate booking fields
  body("paidAmount").optional().isInt({ min: 0 }).withMessage("Paid amount must be a positive integer"),

  body("clientName").notEmpty().withMessage("name is required").bail().isString().withMessage("name should be valid string"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required") // Validate if it's not empty
    .bail()
    .isString()
    .withMessage("Phone number should be a valid string") // Validate if it's a string
    .bail()
    .matches(/^0[1-9]{2}[0-9]{7}$|^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid phone number"),

  body("whatsappNumber")
    .trim()
    .notEmpty()
    .withMessage("whatsapp Number is required")
    .bail()
    .isString()
    .withMessage("whatsapp number should be valid string")
    .bail()
    .matches(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid WhatsApp Number")
    .bail()
    .customSanitizer((value) => formatWhatsAppNumber(value)), // Convert Whatsapp Numbers in One format "92"

  // Validate each booking_item in the array
  body("booking_items").isArray({ min: 1 }).withMessage("Booking items are required"),
  body("booking_items.*.name").notEmpty().withMessage("Item name is required"),
  body("booking_items.*.type")
    .notEmpty()
    .withMessage("type is required")
    .bail()
    .isIn(Object.keys(booking_item_type))
    .withMessage("Invalid item type"),
  body("booking_items.*.payableAmount")
    .notEmpty()
    .withMessage("payableAmount is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Item payable amount must be a positive integer"),
  body("booking_items.*.paidAmount").optional().isInt({ min: 0 }).withMessage("Item paid amount must be a positive integer"),
];

const updateBookingValidator = [
  // Validate booking fields
  body("status").optional().isIn(Object.values(booking_status)).withMessage("Invalid booking status"),

  body("paidAmount").optional().isInt({ min: 0 }).withMessage("Paid amount must be a positive integer"),

  body("phoneNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number is optional") // Validate if it's not empty
    .bail()
    .isString()
    .withMessage("Phone number should be a valid string") // Validate if it's a string
    .bail()
    .matches(/^0[1-9]{2}[0-9]{7}$|^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid phone number"),

  body("whatsappNumber")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("whatsapp Number is optional")
    .bail()
    .isString()
    .withMessage("whatsapp number should be valid string")
    .bail()
    .matches(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid WhatsApp Number")
    .bail()
    .customSanitizer((value) => formatWhatsAppNumber(value)),

  // Validate the booking_items array if it is provided
  body("booking_items").optional().isArray().withMessage("Booking items must be an array if provided"),

  // Validate each booking_item in the array
  body("booking_items.*.name").optional().notEmpty().withMessage("Item name is required if provided"),

  body("booking_items.*.type").optional().isIn(Object.keys(booking_item_type)).withMessage("Invalid item type"),

  body("booking_items.*.payableAmount").optional().isInt({ min: 0 }).withMessage("Item payable amount must be a positive integer"),

  body("booking_items.*.paidAmount").optional().isInt({ min: 0 }).withMessage("Item paid amount must be a positive integer"),

  body("appointmentDate").optional().isISO8601().toDate().withMessage("Appointment date must be a valid date format"),
];

const listBookingsValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer.").toInt(),
  query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("Page size must be between 1 and 100.").toInt(),
  query("sortBy").optional().isString().isIn(["id", "clientName", "status", "appointmentDate", "createdAt"]).withMessage("Invalid value."),
  query("orderBy").optional().isIn(["asc", "desc"]).withMessage("OrderBy must be 'asc' or 'desc'.").default("desc"),
  query("status").optional().isString().isIn(Object.values(booking_status)).withMessage("Invalid booking status"),
];

export const bookingValidator = { createBookingValidator, updateBookingValidator, listBookingsValidator };
