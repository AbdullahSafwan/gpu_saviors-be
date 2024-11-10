import { body } from "express-validator";
import { booking_status, booking_item_type } from "@prisma/client";

const createBookingValidator = [
  // Validate booking fields
  body("paidAmount").optional().isInt({ min: 0 }).withMessage("Paid amount must be a positive integer"),
  body("clientName").notEmpty().withMessage("name is required").bail().isString().withMessage("name should be valid string"),
  body("phoneNumber").notEmpty().withMessage("phone Number is required").bail().isString().withMessage("phone number should be valid string"),
  body("whatsappNumber").notEmpty().withMessage("whatsapp Number is required").bail().isString().withMessage("whatsapp number should be valid string"),

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

  body("whatsappNumber").optional().isString().withMessage("WhatsApp number must be a valid string"),

  // Validate the booking_items array if it is provided
  body("booking_items").optional().isArray().withMessage("Booking items must be an array if provided"),

  // Validate each booking_item in the array
  body("booking_items.*.name").optional().notEmpty().withMessage("Item name is required if provided"),

  body("booking_items.*.type").optional().isIn(Object.keys(booking_item_type)).withMessage("Invalid item type"),

  body("booking_items.*.payableAmount").optional().isInt({ min: 0 }).withMessage("Item payable amount must be a positive integer"),

  body("booking_items.*.paidAmount").optional().isInt({ min: 0 }).withMessage("Item paid amount must be a positive integer"),

  body("appointmentDate").optional().isISO8601().toDate().withMessage("Appointment date must be a valid date format"),
];

export const bookingValidator = { createBookingValidator, updateBookingValidator };
