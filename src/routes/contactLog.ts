import express from "express";
import { contactLogController } from "../controllers/contactLog";
import { contactLogValidator } from "../middleware/validator/contactLogValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, contactLogValidator.createContactLogValidator, throwValidationResult, contactLogController.createContactLog);
router.get("/:id", verifyToken, contactLogController.getContactLogDetails);
router.patch("/:id", verifyToken, contactLogValidator.updateContactLogValidator, throwValidationResult, contactLogController.updateContactLog);

export default router;
