import { body, query, param } from "express-validator";
import { bookingDao } from "../../dao/booking";
import prisma from "../../prisma";
import { warrantyClaimDao } from "../../dao/warrantyClaim";
import { booking_status } from "@prisma/client";

const createWarrantyClaimValidator = [
  // Validate bookingId
  body("bookingId")
    .notEmpty()
    .withMessage("Booking ID is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Booking ID must be a valid positive integer")
    .custom(async (value) => {
      const res = await bookingDao.validateBookingExists(prisma, parseInt(value))
      if (!res) {
        return Promise.reject("Booking not found");
      }
      return true;
    }),

  // Validate claimedItems array
  body("claimedItems")
    .notEmpty()
    .withMessage("Claimed items are required")
    .bail()
    .isArray({ min: 1 })
    .withMessage("At least one claimed item is required"),

  // Validate each claimed item
  body("claimedItems.*.bookingItemId")
    .notEmpty()
    .withMessage("Booking item ID is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Booking item ID must be a valid positive integer"),

  body("claimedItems.*.reportedIssue")
    .notEmpty()
    .withMessage("Reported issue is required for each claimed item")
    .bail()
    .isString()
    .withMessage("Reported issue must be a string")
    .bail()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Reported issue must be between 5 and 1000 characters"),

  body("claimedItems.*.remarks")
    .optional()
    .isString()
    .withMessage("Remarks must be a string if provided")
    .bail()
    .isLength({ max: 1000 })
    .withMessage("Remarks must not exceed 1000 characters"),

  // Validate optional remarks for the entire claim
  body("remarks")
    .optional()
    .isString()
    .withMessage("Remarks must be a string if provided")
    .bail()
    .isLength({ max: 1000 })
    .withMessage("Remarks must not exceed 1000 characters"),
];

const getWarrantyClaimByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Warranty claim ID is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Warranty claim ID must be a valid positive integer")
    .toInt()
    .custom(async (value) => {
      const claim = await warrantyClaimDao.validateWarrantyClaimExists(prisma, parseInt(value));
      if (!claim) {
        return Promise.reject("Warranty claim not found");
      }
      return true;
    }),
];

const getWarrantyClaimByClaimNumberValidator = [
  param("claimNumber")
    .notEmpty()
    .withMessage("Claim number is required")
    .bail()
    .isString()
    .withMessage("Claim number must be a string")
    .bail()
    .matches(/^WC-[A-Z0-9]+-[A-Z0-9]+$/)
    .withMessage("Invalid claim number format"),
];

const listWarrantyClaimsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("pageSize")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Page size must be between 1 and 100")
    .toInt(),

  query("sortBy")
    .optional()
    .isString()
    .isIn(["id", "claimNumber", "claimDate", "createdAt"])
    .withMessage("Invalid sortBy field"),

  query("orderBy")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("OrderBy must be 'asc' or 'desc'"),

  query("searchString")
    .optional()
    .isString()
    .withMessage("Search string must be a string if provided"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be 'true' or 'false'").toBoolean(),

  query("claimBookingStatus")
    .optional()
    .isString()
    .isIn(Object.values(booking_status)).withMessage("Invalid claim booking status"),
];

export const warrantyClaimValidator = {
  createWarrantyClaimValidator,
  getWarrantyClaimByIdValidator,
  getWarrantyClaimByClaimNumberValidator,
  listWarrantyClaimsValidator,
};
