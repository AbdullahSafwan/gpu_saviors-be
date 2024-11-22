import { body } from "express-validator";
import { booking_status, booking_item_type } from "@prisma/client";

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

export const bookingValidator = { createBookingValidator, updateBookingValidator };


const formatWhatsAppNumber = (number: string): string => {
  // Remove any non-digit characters (including spaces, dashes, etc.)
  let cleanedNumber = number.replace(/[^\d]/g, "");

  // Check for different variations of the number (like +92, 0092, etc.) and normalize
  if (cleanedNumber.startsWith("+92") && cleanedNumber.length === 11) {
    // If the number starts with "92" (Pakistan country code) and is 11 digits, return as is
    return `+${cleanedNumber}`;
  } else if (cleanedNumber.startsWith("0092") && cleanedNumber.length === 14) {
    // If the number starts with "0092" and is 13 digits, replace with +92
    return `92${cleanedNumber.slice(4)}`;
  } else if (cleanedNumber.startsWith("92") && cleanedNumber.length === 13) {
    // If the number already starts with +92 and is 13 digits, return it as is
    return cleanedNumber;
  } else if (cleanedNumber.startsWith("0") && cleanedNumber.length === 11) {
    // If the number starts with "0", replace it with "+92"
    return `92${cleanedNumber.slice(1)}`;
  } else if (cleanedNumber.startsWith("3")&& cleanedNumber.length === 10) {
    
    return `92${cleanedNumber.slice(0)}`;
  } 
  // If the number is not valid, return null or an empty string
  return cleanedNumber;  // or return "" if you want to keep it empty when invalid
};
