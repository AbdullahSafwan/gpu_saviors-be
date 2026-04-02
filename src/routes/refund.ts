import express from "express";
import { refundController } from "../controllers/refund";
import { refundValidator } from "../middleware/validator/refundValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Specific routes must come before generic /:id routes
router.get("/booking/:bookingId/refundable-items", verifyToken, refundController.getRefundableItems);
router.get("/booking/:bookingId", verifyToken, refundController.getBookingRefunds);

router.post("/", verifyToken, refundValidator.createRefundValidator, throwValidationResult, refundController.createRefund);

router.get("/:id", verifyToken, refundController.getRefund);

router.patch("/:id", verifyToken, refundValidator.updateRefundValidator, throwValidationResult, refundController.updateRefund);

export default router;
