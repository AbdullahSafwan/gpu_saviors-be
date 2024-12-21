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

router.post("/auth/signup", authValidator.signUpValidator, throwValidationResult, authController.signUp);
router.post("/auth/login", authValidator.logInValidator, throwValidationResult, authController.logIn);
router.post("/auth/refresh", authController.refreshToken);
router.delete("/auth/logout", authController.logOut);
router.post("/auth/sendverificationemail", authController.sendVerificationMail);
router.post("/auth/verifyemail", authController.verifyEmail);
router.post("/auth/forgotpassword", authController.forgotPassword);
router.post("/auth/resetpassword", authValidator.resetPasswordValidator, throwValidationResult, authController.resetPassword);

router.get("/dashboard/", bookingController.dashboard);
router.post("/booking/", bookingValidator.createBookingValidator, throwValidationResult, bookingController.createBooking);
router.get("/booking/", bookingValidator.listBookingsValidator, throwValidationResult, bookingController.listBookings);
router.patch("/booking/:id", bookingValidator.updateBookingValidator, throwValidationResult, bookingController.updateBooking);
router.get("/booking/:id", verifyToken, bookingController.getBookingDetails);

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
