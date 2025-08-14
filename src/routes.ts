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

router.post("/user/", verifyToken, userValidator.createUserValidator, throwValidationResult, userController.createUser);
router.get("/user/:id", verifyToken, userController.getUserDetails);
router.patch("/user/:id", verifyToken, userValidator.updateUserValidator, throwValidationResult, userController.updateUser);

router.post("/booking/", verifyToken, bookingValidator.createBookingValidator, throwValidationResult, bookingController.createBooking);
router.get("/booking/", verifyToken, bookingValidator.listBookingsValidator, throwValidationResult, bookingController.listBookings);
router.patch("/booking/:id", verifyToken, bookingValidator.updateBookingValidator, throwValidationResult, bookingController.updateBooking);
router.get("/dashboard/", verifyToken, bookingController.dashboard);
router.get("/booking/:id", verifyToken, bookingController.getBookingDetails);

router.post("/auth/signup", authValidator.signUpValidator, throwValidationResult, authController.signUp);
router.post("/auth/login", authValidator.logInValidator, throwValidationResult, authController.logIn);
router.post("/auth/refresh", authController.refreshToken);
router.delete("/auth/logout", authController.logOut);
router.post("/auth/sendverificationemail", authController.sendVerificationMail);
router.post("/auth/verifyemail", authController.verifyEmail);
router.post("/auth/forgotpassword", authController.forgotPassword);
router.post("/auth/resetpassword", authValidator.resetPasswordValidator, throwValidationResult, authController.resetPassword);

router.post("/service/", verifyToken, serviceValidator.createServiceValidator, throwValidationResult, serviceController.createService);
router.get("/service/:id", verifyToken, serviceController.getServiceDetails);
router.patch("/service/:id", verifyToken, serviceValidator.updateServiceValidator, throwValidationResult, serviceController.updateService);

router.post("/delivery/", verifyToken, deliveryValidator.createDeliveryValidator, throwValidationResult, deliveryController.createDelivery);
router.get("/delivery/:id", verifyToken, deliveryController.getDeliveryDetails);
router.patch("/delivery/:id", verifyToken, deliveryValidator.updateDeliveryValidator, throwValidationResult, deliveryController.updateDelivery);

router.post("/refund/", verifyToken, refundValidator.createRefundValidator, throwValidationResult, refundController.createRefund);
router.get("/refund/:id", verifyToken, refundController.getRefundDetails);
router.patch("/refund/:id", verifyToken, refundValidator.updateRefundValidator, throwValidationResult, refundController.updateRefund);

router.post(
  "/systemConfiguration/", verifyToken,
  systemConfigurationValidator.createSystemConfigurationValidator,
  throwValidationResult,
  systemConfigurationController.createSystemConfiguration
);
router.get("/systemConfiguration/:id", verifyToken, systemConfigurationController.getSystemConfigurationDetails);
router.patch(
  "/systemConfiguration/:id", verifyToken,
  systemConfigurationValidator.updateSystemConfigurationValidator,
  throwValidationResult,
  systemConfigurationController.updateSystemConfiguration
);

router.post("/contactLog", verifyToken, contactLogValidator.createContactLogValidator, throwValidationResult, contactLogController.createContactLog);
router.get("/contactLog/:id", verifyToken, contactLogController.getContactLogDetails);
router.patch("/contactLog/:id", verifyToken, contactLogValidator.updateContactLogValidator, throwValidationResult, contactLogController.updateContactLog);

export default router;
