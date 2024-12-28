import express from "express";
import { userController } from "./controllers/user";
import { userValidator } from "./middleware/validator/userValidator";
import { throwValidationResult } from "./services/helper";
import { systemConfigurationController } from "./controllers/systemConfiguration";
import { systemConfigurationValidator } from "./middleware/validator/systemConfigurationValidation";
import { serviceController } from "./controllers/service";
import { deliveryController } from "./controllers/delivery";
import { refundController } from "./controllers/refund";
import { bookingController } from "./controllers/booking";
import { bookingValidator } from "./middleware/validator/bookingValidator";
import { contactLogController } from "./controllers/contactLog";
import { contactLogValidator } from "./middleware/validator/contactLogValidator";
import { refundValidator } from "./middleware/validator/refundValidator";
import { deliveryValidator } from "./middleware/validator/deliveryValidator";
import { serviceValidator } from "./middleware/validator/serviceValidator";
import { authController } from "./controllers/auth";
import { verifyToken } from "./middleware/auth";
import { authValidator } from "./middleware/validator/authValidator";

const router = express.Router();

router.post("/user/", userValidator.createUserValidator, throwValidationResult, userController.createUser);
router.get("/user/:id", userController.getUserDetails);
router.patch("/user/:id", userValidator.updateUserValidator, throwValidationResult, userController.updateUser);

router.post("/booking/", bookingValidator.createBookingValidator, throwValidationResult, bookingController.createBooking);
router.get("/booking/", bookingValidator.listBookingsValidator, throwValidationResult, bookingController.listBookings);
router.patch("/booking/:id", bookingValidator.updateBookingValidator, throwValidationResult, bookingController.updateBooking);
router.get("/dashboard/", bookingController.dashboard);
router.get("/booking/:id", verifyToken, bookingController.getBookingDetails);
/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Create a new user account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               phoneNumber:
 *                 type: string
 *                 example: "03001234567"
 *               email:
 *                 type: string
 *                 example: "geogeo102@mailinator.com"
 *               password:
 *                 type: string
 *                 example: "Yourpassword1"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     phoneNumber:
 *                       type: string
 *                       example: "03001234567"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 */
router.post("/auth/signup", authValidator.signUpValidator, throwValidationResult, authController.signUp);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns an access token and refresh token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Successfully signed in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully signed in"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: The JWT access token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                     refreshToken:
 *                       type: string
 *                       description: The refresh token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Error logging in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error logging in"
 *                 error:
 *                   type: object
 *                   description: The error details.
 *                   example:
 *                     message: "User not found"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An internal server error occurred."
 */

router.post("/auth/login", authValidator.logInValidator, throwValidationResult, authController.logIn);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token.
 *     description: Generates a new access token using a valid refresh token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The refresh token used to generate a new access token.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token issued during login.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: The new access token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 message:
 *                   type: string
 *                   example: "Access token refreshed successfully"
 *                 error:
 *                   type: null
 *       400:
 *         description: Error refreshing access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Error refreshing access token"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: integer
 *                         example: 400
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Error refreshing access token", "Invalid refresh token"]
 */
router.post("/auth/refresh", authController.refreshToken);
/**
 * @openapi
 * /auth/logout:
 *   delete:
 *     summary: Log out the user.
 *     description: Invalidates the refresh token and logs the user out by deleting the session.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The refresh token used to identify the session to terminate.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token issued during login.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   description: Indicates if the logout operation was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *                 error:
 *                   type: null
 *       400:
 *         description: Error logging out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Error logging out"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: integer
 *                         example: 400
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Error logging out", "Refresh token required"]
 */
router.delete("/auth/logout", authController.logOut);
/**
 * @openapi
 * /auth/sendverificationemail:
 *   post:
 *     summary: Send a verification email to the user.
 *     description: Sends a verification email to the provided email address for account verification purposes.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The email address to send the verification mail to.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: The email address of the user to send the verification mail.
 *     responses:
 *       200:
 *         description: Verification mail sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Details of the sent verification mail.
 *                 message:
 *                   type: string
 *                   example: "Verification Mail sent successfully"
 *                 error:
 *                   type: null
 *       400:
 *         description: Error sending verification mail.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Error sending verification mail"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: integer
 *                         example: 400
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Error sending verification mail", "Email is required"]
 */
router.post("/auth/sendverificationemail", authController.sendVerificationMail);
/**
 * @swagger
 * /auth/verifyemail:
 *   post:
 *     summary: Verify the user's email address.
 *     description: Validates the email verification token and marks the user's email as verified.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The token required to verify the user's email address.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 description: The email verification token.
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Details of the verification result.
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully"
 *                 error:
 *                   type: null
 *       400:
 *         description: Error during email verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Error during email verification"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: integer
 *                         example: 400
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Error during email verification", "Token is required"]
 */
router.post("/auth/verifyemail", authController.verifyEmail);
/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: Send a password reset link to the user's email.
 *     description: Sends a password reset link to the specified email address if the user exists in the system.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The email address for which the password reset link should be sent.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *                 description: The email address of the user.
 *     responses:
 *       200:
 *         description: Password reset link sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Details of the reset link generation.
 *                 message:
 *                   type: string
 *                   example: "Password reset link sent successfully"
 *                 error:
 *                   type: null
 *       400:
 *         description: Error sending the password reset email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Error sending password reset email"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: integer
 *                         example: 400
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Error sending password reset email", "Email is required"]
 */
router.post("/auth/forgotpassword", authController.forgotPassword);
/**
 * @swagger
 * /auth/resetpassword:
 *   post:
 *     summary: Reset a user's password.
 *     description: Resets the user's password using the provided reset token and new password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The token and new password for the reset operation.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "NewPassword123"
 *                 minLength: 8
 *                 pattern: "^(?=.*[A-Z])(?=.*\\d).{8,}$"
 *               token:
 *                 type: string
 *                 description: The password reset token provided via email.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: string
 *                       example: Password reset successfully
 *                       description: Details about the password reset operation.
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *                 error:
 *                   type: null
 *       400:
 *         description: Error resetting the password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Error sending password reset email"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: integer
 *                         example: 400
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Error sending password reset email", "Password must be at least 8 characters long, contain at least one Uppercase letter and one number"]
 */
router.post("/auth/resetpassword", authValidator.resetPasswordValidator, throwValidationResult, authController.resetPassword);


router.post("/service/", serviceValidator.createServiceValidator, throwValidationResult, serviceController.createService);
router.get("/service/:id", serviceController.getServiceDetails);
router.patch("/service/:id", serviceValidator.updateServiceValidator, throwValidationResult, serviceController.updateService);


router.post("/delivery/", deliveryValidator.createDeliveryValidator, throwValidationResult, deliveryController.createDelivery);
router.get("/delivery/:id", deliveryController.getDeliveryDetails);
router.patch("/delivery/:id", deliveryValidator.updateDeliveryValidator, throwValidationResult, deliveryController.updateDelivery);

router.post("/refund/", refundValidator.createRefundValidator, throwValidationResult, refundController.createRefund);
router.get("/refund/:id", refundController.getRefundDetails);
router.patch("/refund/:id", refundValidator.updateRefundValidator, throwValidationResult, refundController.updateRefund);

router.post(
  "/systemConfiguration/",
  systemConfigurationValidator.createSystemConfigurationValidator,
  throwValidationResult,
  systemConfigurationController.createSystemConfiguration
);
router.get("/systemConfiguration/:id", systemConfigurationController.getSystemConfigurationDetails);
router.patch(
  "/systemConfiguration/:id",
  systemConfigurationValidator.updateSystemConfigurationValidator,
  throwValidationResult,
  systemConfigurationController.updateSystemConfiguration
);


router.post("/contactLog", contactLogValidator.createContactLogValidator, throwValidationResult, contactLogController.createContactLog);

router.get("/contactLog/:id", contactLogController.getContactLogDetails);

router.patch("/contactLog/:id", contactLogValidator.updateContactLogValidator, throwValidationResult, contactLogController.updateContactLog);

export default router;
