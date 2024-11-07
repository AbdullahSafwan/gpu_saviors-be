import { body } from "express-validator";

const deliveryCreateValidator = [
  body("address").notEmpty().withMessage("address is required"),

  body("phoneNumber")
    .notEmpty()
    .isMobilePhone("any")
    .withMessage("Invalid Phone Number"),

 body("landmark").optional().withMessage("landmark is optional"),

 body("secondaryPhoneNumber").optional().notEmpty().withMessage("Secondary PhoneNumber is optional"),

 body("bookingId").isInt().notEmpty().withMessage("BookingId is required"),

 body("status").notEmpty().withMessage("status is req"),

 body ("deliveryDate").isInt().notEmpty().withMessage("DateTime is required")

];

const deliveryUpdateValidator = [

  body("id").isInt().notEmpty().withMessage("id is required"),

  body("address").optional().notEmpty().withMessage("address is req"),

    body("phoneNumber").optional()
    .notEmpty()
    .isMobilePhone("any")
    .withMessage("Invalid Phone Number"),

 body("landmark").optional().withMessage("landmark is optional"),

 body("secondaryPhoneNumber").optional().notEmpty().withMessage("Secondary PhoneNumber is optional"),

 body("bookingId").isInt().optional().notEmpty().withMessage("BookingId is required"),

 body("status").optional().notEmpty().withMessage("status is req"),

 body ("deliveryDate").optional().isInt().notEmpty().withMessage("DateTime is required")


];


export const deliveryValidator = { deliveryCreateValidator,deliveryUpdateValidator };