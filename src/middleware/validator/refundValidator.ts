import { body } from "express-validator";

const createRefundValidator = [
  body("bookingId").isInt().notEmpty().withMessage("bookingId is required"),

  body("refundDate").notEmpty().withMessage("refundDate is required").bail().isISO8601().toDate(),

  body("remarks").optional().isString(),

  body("warrantyClaimId").optional().isInt().withMessage("warrantyClaimId must be an integer"),

  body("items").isArray({ min: 1 }).withMessage("items array is required with at least 1 item"),

  body("items.*.bookingItemId").isInt().notEmpty().withMessage("Each item must have a valid bookingItemId"),

  body("items.*.amount").isInt({ min: 1 }).withMessage("Each item amount must be a positive integer"),

  body("items.*.remarks").optional().isString(),
];

const updateRefundValidator = [
  body("refundDate").optional().isISO8601().toDate().withMessage("refundDate must be a valid date"),

  body("remarks").optional().isString(),

  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),

  body("items").optional().isArray().withMessage("items must be an array"),

  body("items.*.bookingItemId").optional().isInt().notEmpty().withMessage("Each item must have a valid bookingItemId"),

  body("items.*.amount").optional().isInt({ min: 1 }).withMessage("Each item amount must be a positive integer"),

  body("items.*.remarks").optional().isString(),
];

export const refundValidator = {
  createRefundValidator,
  updateRefundValidator,
};
