import { body, query } from "express-validator";
import { expense_category, ledger_payment_method } from "@prisma/client";
import { locationDao } from "../../dao/location";
import prisma from "../../prisma";

const createLedgerEntryValidator = [
  body("entryDate")
    .notEmpty()
    .withMessage("Entry date is required")
    .bail()
    .isISO8601()
    .withMessage("Entry date must be a valid ISO 8601 date")
    .bail()
    .custom((value) => {
      const entryDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (entryDate > today) {
        throw new Error("Entry date cannot be in the future");
      }
      return true;
    }),

  body("locationId")
    .notEmpty()
    .withMessage("Location ID is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Location ID must be a positive integer")
    .custom(async (value) => {
      if (isNaN(parseInt(value))) {
        throw new Error("Location ID must be a valid integer");
      }
      const result = await locationDao.verifyLocationExists(prisma, parseInt(value));
      if (!result) {
        throw new Error(`Location with id ${value} does not exist`);
      }
      return true;
    }),

  body("category")
    .notEmpty()
    .withMessage("Expense category is required")
    .bail()
    .isIn(Object.values(expense_category))
    .withMessage("Invalid expense category"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .bail()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .bail()
    .isIn(Object.values(ledger_payment_method))
    .withMessage("Invalid payment method"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters"),

  body("remarks")
    .optional()
    .isString()
    .withMessage("Remarks must be a string")
    .isLength({ max: 1000 })
    .withMessage("Remarks cannot exceed 1000 characters"),

  body("receiptNumber")
    .optional()
    .isString()
    .withMessage("Receipt number must be a string")
    .isLength({ max: 100 })
    .withMessage("Receipt number cannot exceed 100 characters"),

  body("receiptAttachment")
    .optional()
    .isString()
    .withMessage("Receipt attachment must be a string")
    .isLength({ max: 500 })
    .withMessage("Receipt attachment path cannot exceed 500 characters"),

  body("vendorName")
    .optional()
    .isString()
    .withMessage("Vendor name must be a string")
    .isLength({ max: 200 })
    .withMessage("Vendor name cannot exceed 200 characters"),
];

const updateLedgerEntryValidator = [
  body("entryDate")
    .optional()
    .isISO8601()
    .withMessage("Entry date must be a valid ISO 8601 date")
    .bail()
    .custom((value) => {
      const entryDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (entryDate > today) {
        throw new Error("Entry date cannot be in the future");
      }
      return true;
    }),

  body("locationId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Location ID must be a positive integer")
    .custom(async (value) => {
      if (isNaN(parseInt(value))) {
        throw new Error("Location ID must be a valid integer");
      }
      const result = await locationDao.verifyLocationExists(prisma, parseInt(value));
      if (!result) {
        throw new Error(`Location with id ${value} does not exist`);
      }
      return true;
    }),

  body("category").optional().isIn(Object.values(expense_category)).withMessage("Invalid expense category"),

  body("amount").optional().isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),

  body("paymentMethod").optional().isIn(Object.values(ledger_payment_method)).withMessage("Invalid payment method"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters"),

  body("remarks")
    .optional()
    .isString()
    .withMessage("Remarks must be a string")
    .isLength({ max: 1000 })
    .withMessage("Remarks cannot exceed 1000 characters"),

  body("receiptNumber")
    .optional()
    .isString()
    .withMessage("Receipt number must be a string")
    .isLength({ max: 100 })
    .withMessage("Receipt number cannot exceed 100 characters"),

  body("vendorName")
    .optional()
    .isString()
    .withMessage("Vendor name must be a string")
    .isLength({ max: 200 })
    .withMessage("Vendor name cannot exceed 200 characters"),
];

const listLedgerEntriesValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("Page size must be between 1 and 100"),

  query("locationId")
  .optional()
  .isInt({ min: 1 })
  .withMessage("Location ID must be a positive integer")
  .custom(async (value) => {
      if (isNaN(parseInt(value))) {
        throw new Error("Location ID must be a valid integer");
      }
      const result = await locationDao.verifyLocationExists(prisma, parseInt(value));
      if (!result) {
        throw new Error(`Location with id ${value} does not exist`);
      }
      return true;
    }),

  query("category").optional().isIn(Object.values(expense_category)).withMessage("Invalid expense category"),

  query("startDate").optional().isISO8601().withMessage("Start date must be a valid ISO 8601 date"),

  query("endDate").optional().isISO8601().withMessage("End date must be a valid ISO 8601 date"),

  query("searchString").optional().isString().withMessage("Search string must be a string"),

  query("sortBy").optional().isString().withMessage("Sort by must be a string"),

  query("orderBy").optional().isIn(["asc", "desc"]).withMessage("Order by must be 'asc' or 'desc'"),
];

const generateReportValidator = [
  query("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .bail()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  query("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .bail()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .bail()
    .custom((value, { req }) => {
      if (req.query) {
        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(value);
        if (endDate < startDate) {
          throw new Error("End date must be after start date");
        }
      }
      return true;
    }),

  query("locationId")
  .optional()
  .isInt({ min: 1 })
  .withMessage("Location ID must be a positive integer")
  .custom(async (value) => {
      if (isNaN(parseInt(value))) {
        throw new Error("Location ID must be a valid integer");
      }
      const result = await locationDao.verifyLocationExists(prisma, parseInt(value));
      if (!result) {
        throw new Error(`Location with id ${value} does not exist`);
      }
      return true;
    }),

  query("category").optional().isIn(Object.values(expense_category)).withMessage("Invalid expense category"),

  query("groupBy")
    .optional()
    .isIn(["location", "category", "date", "paymentMethod"])
    .withMessage("Invalid group by option"),
];

const dailySummaryValidator = [
  query("date")
    .notEmpty()
    .withMessage("Date is required")
    .bail()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),

  query("locationId")
  .optional()
  .isInt({ min: 1 })
  .withMessage("Location ID must be a positive integer")
  .custom(async (value) => {
      if (isNaN(parseInt(value))) {
        throw new Error("Location ID must be a valid integer");
      }
      const result = await locationDao.verifyLocationExists(prisma, parseInt(value));
      if (!result) {
        throw new Error(`Location with id ${value} does not exist`);
      }
      return true;
    }),
];

const monthlySummaryValidator = [
  query("year").optional().isInt({ min: 2000, max: 2100 }).withMessage("Year must be between 2000 and 2100"),

  query("month").optional().isInt({ min: 1, max: 12 }).withMessage("Month must be between 1 and 12"),

  query("locationId").optional().isInt({ min: 1 }).withMessage("Location ID must be a positive integer"),
];

export const ledgerEntryValidator = {
  createLedgerEntryValidator,
  updateLedgerEntryValidator,
  listLedgerEntriesValidator,
  generateReportValidator,
  dailySummaryValidator,
  monthlySummaryValidator,
};
