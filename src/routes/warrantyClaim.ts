import express from "express";
import { warrantyClaimController } from "../controllers/warrantyClaim";
import { warrantyClaimValidator } from "../middleware/validator/warrantyClaimValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, warrantyClaimValidator.createWarrantyClaimValidator, throwValidationResult, warrantyClaimController.createWarrantyClaim);
router.get("/", verifyToken, warrantyClaimValidator.listWarrantyClaimsValidator, throwValidationResult, warrantyClaimController.listWarrantyClaims);
router.get("/:id", verifyToken, warrantyClaimValidator.getWarrantyClaimByIdValidator, throwValidationResult, warrantyClaimController.getWarrantyClaimById);
router.get("/claim/:claimNumber", verifyToken, warrantyClaimValidator.getWarrantyClaimByClaimNumberValidator, throwValidationResult, warrantyClaimController.getWarrantyClaimByClaimNumber);

export default router;
