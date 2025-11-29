import express from "express";
import { refundController } from "../controllers/refund";
import { refundValidator } from "../middleware/validator/refundValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, refundValidator.createRefundValidator, throwValidationResult, refundController.createRefund);
router.get("/:id", verifyToken, refundController.getRefundDetails);
router.patch("/:id", verifyToken, refundValidator.updateRefundValidator, throwValidationResult, refundController.updateRefund);

export default router;
