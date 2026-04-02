import { body, query } from "express-validator";
import { service_charge_type } from "@prisma/client";

const createChargeValidator = [
  body("productName")
    .notEmpty()
    .withMessage("Product name is required")
    .bail()
    .isString()
    .withMessage("Product name must be a string")
    .bail()
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("type").notEmpty().withMessage("Type is required").bail().isIn(Object.values(service_charge_type)).withMessage("Invalid service charge type"),

  body("amount").notEmpty().withMessage("Amount is required").bail().isInt({ min: 1 }).withMessage("Amount must be a positive integer"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("effectiveFrom").optional().isISO8601().withMessage("effectiveFrom must be a valid ISO 8601 date"),
];

const listChargesValidator = [
  query("type").optional().isIn(Object.values(service_charge_type)).withMessage("Invalid service charge type"),

  query("productName").optional().isString().withMessage("Product name must be a string"),
];

const listChargeHistoryValidator = [
  query("productName").optional().isString().withMessage("Product name must be a string"),

  query("type").optional().isIn(Object.values(service_charge_type)).withMessage("Invalid service charge type"),
];

export const chargeValidator = {
  createChargeValidator,
  listChargesValidator,
  listChargeHistoryValidator,
};
