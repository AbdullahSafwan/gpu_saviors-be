import { body } from "express-validator";

const deliveryCreateValidator = [
  body("address").notEmpty().withMessage("address is required"),

  body("phoneNumber")
    .notEmpty()
    .isMobilePhone("any")
    .withMessage("Invalid Phone Number"),

 body("landmark").optional().withMessage("landmark is optional"),

body("secondaryPhoneNumber").optional().notEmpty().withMessage("Secondary PhoneNumber is optional")

];

export const deliveryValidator = { deliveryCreateValidator };