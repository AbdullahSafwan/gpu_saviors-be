import express from "express";
import { userController } from "../controllers/user";
import { userValidator } from "../middleware/validator/userValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, userValidator.createUserValidator, throwValidationResult, userController.createUser);
router.get("/:id", verifyToken, userController.getUserDetails);
router.patch("/:id", verifyToken, userValidator.updateUserValidator, throwValidationResult, userController.updateUser);

export default router;
