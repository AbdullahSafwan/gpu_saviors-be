import { body } from "express-validator";

const refundCreateValidator = [
    body ("paymentId").isInt().notEmpty().withMessage("paymentId is required"),

    body ("amount").isInt().notEmpty().withMessage("Amount is required"),

    body ("remarks").optional().withMessage("remarks is optional")

];

export const refundValidator = { refundCreateValidator };