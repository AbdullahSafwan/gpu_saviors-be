import express from "express";
import { authController } from "../controllers/auth";
import { authValidator } from "../middleware/validator/authValidator";
import { throwValidationResult } from "../services/helper";

const router = express.Router();

// router.post("/signup", authValidator.signUpValidator, throwValidationResult, authController.signUp);
router.post("/login", authValidator.logInValidator, throwValidationResult, authController.logIn);
router.post("/refresh", authController.refreshToken);
router.delete("/logout", authController.logOut);
// router.post("/sendverificationemail", authController.sendVerificationMail);
// router.post("/verifyemail", authController.verifyEmail);
// router.post("/forgotpassword", authController.forgotPassword);
// router.post("/resetpassword", authValidator.resetPasswordValidator, throwValidationResult, authController.resetPassword);

export default router;
