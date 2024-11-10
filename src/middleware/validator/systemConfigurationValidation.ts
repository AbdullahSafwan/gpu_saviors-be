import { body } from "express-validator";

const createSystemConfigurationValidator = [

  body("key").notEmpty().withMessage("key is required"),

  body ("value").notEmpty().withMessage("value is required")


];

const updateSystemConfigurationValidator = [

    body("key").notEmpty().withMessage("key is required"),
  
    body ("value").notEmpty().withMessage("value is required")

];

export const systemConfigurationValidator = { updateSystemConfigurationValidator ,createSystemConfigurationValidator };
