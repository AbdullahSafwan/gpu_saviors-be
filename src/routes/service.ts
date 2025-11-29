import express from "express";
import { serviceController } from "../controllers/service";
import { serviceValidator } from "../middleware/validator/serviceValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, serviceValidator.createServiceValidator, throwValidationResult, serviceController.createService);
router.get("/:id", verifyToken, serviceController.getServiceDetails);
router.patch("/:id", verifyToken, serviceValidator.updateServiceValidator, throwValidationResult, serviceController.updateService);

export default router;
