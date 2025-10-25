import { body, query } from "express-validator";
import { booking_status, booking_item_type, client_type, courier_type, ReferralSource } from "@prisma/client";
import { formatWhatsAppNumber } from "./helper";
import { bookingDao } from "../../dao/booking";
import prisma from "../../prisma";
import { deliveryDao } from "../../dao/delivery";

const createBookingValidator = [
  // Validate booking fields
  body("paidAmount").optional().isInt({ min: 0 }).withMessage("Paid amount must be a positive integer"),
  body("clientType").optional().isIn(Object.values(client_type)).withMessage("Invalid client type"),
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
  body("booking_items.*.serialNumber").optional().isString().withMessage("Serial number should be a valid string if provided"),
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
  body("appointmentDate").optional().isISO8601().toDate().withMessage("Appointment date must be a valid date format"),
  body("referralSource").optional().isIn(Object.values(ReferralSource)).withMessage("Invalid referral source"),
  body("referralSourceNotes").optional().isString().withMessage("Referral source notes must be a string").isLength({ max: 500 }).withMessage("Referral source notes must not exceed 500 characters"),
];

const updateBookingValidator = [
  // Validate booking fields
  body("status").optional().isIn(Object.values(booking_status)).withMessage("Invalid booking status"),
  body("clientType").optional().isIn(Object.values(client_type)).withMessage("Invalid client type"),
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

  body("booking_items.*.serialNumber").optional().isString().withMessage("Serial number should be a valid string if provided"),

  body("delivery").optional().isArray().withMessage("Delivery must be an array if provided"),

  body("delivery.*.id").optional().isInt().withMessage("Delivery id must be a valid integer")
    .custom(async (value) => {
      if (isNaN(parseInt(value))) {
        throw new Error("Location ID must be a valid integer");
      }
      const result = await deliveryDao.checkDeliveryExists(prisma, value);
      if (!result) {
        throw new Error(`Location with id ${value} does not exist`);
      }
      return true;
    }),

  body("delivery.*.address").if(body("delivery.*.id").not().exists()).notEmpty().withMessage("address is required"),

  body("delivery.*.courier").if(body("delivery.*.id").not().exists()).notEmpty().isString().withMessage("Courier name is required"),

  body("delivery.*.type")
    .if(body("delivery.*.id").not().exists())
    .notEmpty()
    .withMessage("courier type is required")
    .bail()
    .isIn(Object.values(courier_type)),

  body("delivery.*.phoneNumber")
    .if(body("delivery.*.id").not().exists())
    .notEmpty()
    .trim()
    .withMessage("Phone number is required")
    .bail()
    .isString()
    .withMessage("Phone number should be a valid string"),

  body("delivery.*.postalCode")
    .if(body("delivery.*.id").not().exists())
    .notEmpty()
    .withMessage("Postal code is required")
    .bail()
    .isInt()
    .withMessage("Postal code must be a valid integer"),
  
  body("delivery.*.landmark").optional().isString(),

  body("delivery.*.deliveryDate")
    .if(body("delivery.*.id").not().exists())
    .notEmpty().withMessage("DateTime is required").isISO8601().toDate(),

  body("appointmentDate").optional().isISO8601().toDate().withMessage("Appointment date must be a valid date format"),
  body("referralSource").optional().isIn(Object.values(ReferralSource)).withMessage("Invalid referral source"),
  body("referralSourceNotes").optional().isString().withMessage("Referral source notes must be a string").isLength({ max: 500 }).withMessage("Referral source notes must not exceed 500 characters"),
];

const listBookingsValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer.").toInt(),
  query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("Page size must be between 1 and 100.").toInt(),
  query("sortBy").optional().isString().isIn(["id", "clientName", "status", "appointmentDate", "createdAt"]).withMessage("Invalid value."),
  query("orderBy").optional().isIn(["asc", "desc"]).withMessage("OrderBy must be 'asc' or 'desc'.").default("desc"),
  query("status").optional().isString().isIn(Object.values(booking_status)).withMessage("Invalid booking status"),
  query("isActive").optional().isBoolean().withMessage("isActive must be a boolean value").toBoolean(),
];

const removeBookingValidator = [
  query("id").notEmpty().withMessage("Booking ID is required").isInt({ min: 1 }).withMessage("Booking ID must be a positive integer").toInt(),
  query("id").custom((value) => {
    if (isNaN(value) || value <= 0) {
      throw new Error("Invalid booking ID");
    }
    const isPresent = bookingDao.getBooking(prisma, value);
    if (!isPresent) {
      throw new Error("Booking not found");
    }
    return true;
  })
];

const generateDocumentValidator = [
  query("type")
    .notEmpty()
    .withMessage("Document type is required")
    .isIn(["receipt", "invoice"])
    .withMessage("Document type must be either 'receipt' or 'invoice'"),
  query("format")
    .optional()
    .isIn(["pdf"])
    .withMessage("Format must be 'pdf' (currently only PDF is supported)"),
];

export const bookingValidator = { createBookingValidator, updateBookingValidator, listBookingsValidator, removeBookingValidator, generateDocumentValidator };
