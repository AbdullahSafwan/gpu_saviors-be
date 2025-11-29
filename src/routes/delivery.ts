import express from "express";
import { deliveryController } from "../controllers/delivery";
import { deliveryValidator } from "../middleware/validator/deliveryValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, deliveryValidator.createDeliveryValidator, throwValidationResult, deliveryController.createDelivery);
router.get("/:id", verifyToken, deliveryController.getDeliveryDetails);
router.patch("/:id", verifyToken, deliveryValidator.updateDeliveryValidator, throwValidationResult, deliveryController.updateDelivery);

export default router;
