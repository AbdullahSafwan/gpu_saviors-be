import { body, query, param } from "express-validator";

const createWarrantyClaimValidator = [
  // Validate bookingId
  body("bookingId")
    .notEmpty()
    .withMessage("Booking ID is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Booking ID must be a valid positive integer"),

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
    .toInt(),
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
];

export const warrantyClaimValidator = {
  createWarrantyClaimValidator,
  getWarrantyClaimByIdValidator,
  getWarrantyClaimByClaimNumberValidator,
  listWarrantyClaimsValidator,
};
