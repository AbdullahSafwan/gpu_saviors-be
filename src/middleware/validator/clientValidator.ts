import { body, query } from "express-validator";
import { client_status } from "@prisma/client";
import { locationDao } from "../../dao/location";
import { clientDao } from "../../dao/client";
import prisma from "../../prisma";

const createClientValidator = [
  body("businessName")
    .notEmpty()
    .withMessage("Business name is required")
    .bail()
    .isString()
    .withMessage("Business name should be a valid string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Business name must not exceed 200 characters"),

  body("contactPersonName")
    .notEmpty()
    .withMessage("Contact person name is required")
    .bail()
    .isString()
    .withMessage("Contact person name should be a valid string"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .isString()
    .withMessage("Phone number should be a valid string")
    .bail()
    .matches(/^0[1-9]{2}[0-9]{7}$|^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid phone number format"),

  body("whatsappNumber")
    .trim()
    .notEmpty()
    .withMessage("WhatsApp number is required")
    .bail()
    .isString()
    .withMessage("WhatsApp number should be a valid string")
    .bail()
    .matches(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid WhatsApp number format"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format"),

  body("businessAddress")
    .optional()
    .isString()
    .withMessage("Business address should be a valid string"),

  body("city")
    .optional()
    .isString()
    .withMessage("City should be a valid string"),

  body("postalCode")
    .optional()
    .isString()
    .withMessage("Postal code should be a valid string"),

  body("paymentTermsDays")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Payment terms must be a positive integer"),

  body("creditLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Credit limit must be a positive integer or zero"),

  body("locationId")
    .notEmpty()
    .withMessage("Location ID is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Location ID must be a positive integer")
    .custom(async (value) => {
      const location = await locationDao.getLocation(prisma, parseInt(value));
      if (!location) {
        throw new Error(`Location with id ${value} does not exist`);
      }
      if (!location.isActive) {
        throw new Error(`Location with id ${value} is not active`);
      }
      return true;
    }),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes should be a valid string"),
];

const updateClientValidator = [
  body("businessName")
    .optional()
    .notEmpty()
    .withMessage("Business name cannot be empty")
    .bail()
    .isString()
    .withMessage("Business name should be a valid string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Business name must not exceed 200 characters"),

  body("contactPersonName")
    .optional()
    .notEmpty()
    .withMessage("Contact person name cannot be empty")
    .bail()
    .isString()
    .withMessage("Contact person name should be a valid string"),

  body("phoneNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty")
    .bail()
    .isString()
    .withMessage("Phone number should be a valid string")
    .bail()
    .matches(/^0[1-9]{2}[0-9]{7}$|^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid phone number format"),

  body("whatsappNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("WhatsApp number cannot be empty")
    .bail()
    .isString()
    .withMessage("WhatsApp number should be a valid string")
    .bail()
    .matches(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/)
    .withMessage("Invalid WhatsApp number format"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format"),

  body("businessAddress")
    .optional()
    .isString()
    .withMessage("Business address should be a valid string"),

  body("city")
    .optional()
    .isString()
    .withMessage("City should be a valid string"),

  body("postalCode")
    .optional()
    .isString()
    .withMessage("Postal code should be a valid string"),

  body("paymentTermsDays")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Payment terms must be a positive integer"),

  body("creditLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Credit limit must be a positive integer or zero"),

  body("status")
    .optional()
    .isIn(Object.values(client_status))
    .withMessage("Invalid client status"),

  body("locationId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Location ID must be a positive integer")
    .custom(async (value) => {
      if (value) {
        const location = await locationDao.getLocation(prisma, parseInt(value));
        if (!location) {
          throw new Error(`Location with id ${value} does not exist`);
        }
        if (!location.isActive) {
          throw new Error(`Location with id ${value} is not active`);
        }
      }
      return true;
    }),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes should be a valid string"),
];

const listClientsValidator = [
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
    .isIn(["id", "businessName", "code", "contactPersonName", "createdAt", "outstandingBalance"])
    .withMessage("Invalid sortBy value"),

  query("orderBy")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("OrderBy must be 'asc' or 'desc'"),

  query("status")
    .optional()
    .isString()
    .isIn(Object.values(client_status))
    .withMessage("Invalid client status"),

  query("locationId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Location ID must be a positive integer")
    .toInt(),

  query("searchString")
    .optional()
    .isString()
    .withMessage("Search string should be a valid string"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value")
    .toBoolean(),
];

const getClientDetailsValidator = [
  query("id")
    .notEmpty()
    .withMessage("Client ID is required")
    .isInt({ min: 1 })
    .withMessage("Client ID must be a positive integer")
    .toInt()
    .custom(async (value) => {
      const exists = await clientDao.checkClientExists(prisma, value);
      if (!exists) {
        throw new Error("Client not found");
      }
      return true;
    }),
];

const deleteClientValidator = [
  query("id")
    .notEmpty()
    .withMessage("Client ID is required")
    .isInt({ min: 1 })
    .withMessage("Client ID must be a positive integer")
    .toInt()
    .custom(async (value) => {
      const exists = await clientDao.checkClientExists(prisma, value);
      if (!exists) {
        throw new Error("Client not found");
      }
      return true;
    }),
];

const getClientBookingsValidator = [
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

  query("status")
    .optional()
    .isString()
    .withMessage("Status should be a valid string"),
];

export const clientValidator = {
  createClientValidator,
  updateClientValidator,
  listClientsValidator,
  getClientDetailsValidator,
  deleteClientValidator,
  getClientBookingsValidator,
};
