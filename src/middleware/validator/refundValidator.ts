import { body } from "express-validator";

const refundCreateValidator = [
    body ("paymentId").isInt().notEmpty().withMessage("paymentId is required"),

    body ("amount").isInt().notEmpty().withMessage("Amount is required"),

    body ("remarks").optional(),

    body ("refundDate").notEmpty().withMessage("RefundDate is required").bail().isISO8601().toDate()



];

const refundUpdateValidatior = [

    body ("paymentId").optional().isInt().notEmpty().withMessage("paymentId is required"),

    body ("amount").optional().isInt().notEmpty().withMessage("Amount is required"),

    body ("remarks").optional(),

    body ("refundDate").optional().isInt().notEmpty().withMessage("RefundDate is optional")

];

export const refundValidator = { refundCreateValidator , refundUpdateValidatior};