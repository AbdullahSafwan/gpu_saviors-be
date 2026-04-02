import express from "express";
import { chargeController } from "../controllers/charge";
import { chargeValidator } from "../middleware/validator/chargeValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, chargeValidator.createChargeValidator, throwValidationResult, chargeController.createCharge);
router.get("/", verifyToken, chargeValidator.listChargesValidator, throwValidationResult, chargeController.listCurrentCharges);
router.get("/history", verifyToken, chargeValidator.listChargeHistoryValidator, throwValidationResult, chargeController.listChargeHistory);
router.delete("/:id", verifyToken, chargeController.deleteCharge);

export default router;
