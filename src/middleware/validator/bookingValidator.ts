import { body } from "express-validator";
import { booking_status, booking_item_type } from "@prisma/client";

const createBookingValidator = [
  // Validate booking fields
  body("status").notEmpty().withMessage("status is required").bail().isIn(Object.values(booking_status)).withMessage("Invalid booking status"),
  body("paidAmount").optional().isInt({ min: 0 }).withMessage("Paid amount must be a positive integer"),

  // Validate each booking_item in the array
  body("booking_items").isArray({ min: 1 }).withMessage("Booking items are required"),
  body("booking_items.*.name").notEmpty().withMessage("Item name is required"),
  body("booking_items.*.type")
    .notEmpty()
    .withMessage("type is required")
    .bail()
    .isIn(Object.keys(booking_item_type)) // adjust according to your `order_item_type` enum values
    .withMessage("Invalid item type"),
  body("booking_items.*.payableAmount")
    .notEmpty()
    .withMessage("payableAmount is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Item payable amount must be a positive integer"),
  body("booking_items.*.paidAmount").optional().isInt({ min: 0 }).withMessage("Item paid amount must be a positive integer"),
  // body("booking_items.*.status")
  //   .notEmpty()
  //   .withMessage("status is required")
  //   .bail()
  //   .isIn(Object.keys(booking_item_status)) // adjust according to your `booking_item_status` enum values
  //   .withMessage("Invalid item status"),
];

export const bookingValidator = { createBookingValidator };
