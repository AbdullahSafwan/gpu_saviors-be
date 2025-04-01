import { body } from "express-validator";

const createSystemConfigurationValidator = [
  body("key").notEmpty().withMessage("key is required").isString(),

  body("value").notEmpty().withMessage("value is required").isString(),
];

const updateSystemConfigurationValidator = [
  body("key").notEmpty().withMessage("key is required").isString(),

  body("value").notEmpty().withMessage("value is required").isString(),
];

export const systemConfigurationValidator = { updateSystemConfigurationValidator, createSystemConfigurationValidator };
