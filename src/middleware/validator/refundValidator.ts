import { body } from "express-validator";

const refundCreateValidator = [
    body ("paymentId").isInt().notEmpty().withMessage("paymentId is required"),

    body ("amount").isInt().notEmpty().withMessage("Amount is required"),

    body ("remarks").optional().withMessage("remarks is optional"),

    body ("refundDate").isInt().notEmpty().withMessage("RefundDate is required")



];

const refundUpdateValidatior = [

    body ("id").isInt().notEmpty().withMessage("id is required"),

    body ("paymentId").optional().isInt().notEmpty().withMessage("paymentId is required"),

    body ("amount").optional().isInt().notEmpty().withMessage("Amount is required"),

    body ("remarks").optional().withMessage("remarks is optional"),

    body ("refundDate").optional().isInt().notEmpty().withMessage("RefundDate is optional")

];

export const refundValidator = { refundCreateValidator , refundUpdateValidatior};