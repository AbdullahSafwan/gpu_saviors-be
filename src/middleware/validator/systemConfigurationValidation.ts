import { body } from "express-validator";

const systemConfigurationCreateValidator = [

  body("key").notEmpty().withMessage("key is required"),

  body ("value").notEmpty().withMessage("value is required")


];

const systemConfigurationUpdateValidator = [

    body("key").notEmpty().withMessage("key is required"),
  
    body ("value").notEmpty().withMessage("value is required")

];

export const systemConfigurationValidator = { systemConfigurationUpdateValidator ,systemConfigurationCreateValidator };
