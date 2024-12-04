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

const router = express.Router();

router.post("/user/", userValidator.createUserValidator, throwValidationResult, userController.createUser);
router.get("/user/:id", userController.getUserDetails);
router.patch("/user/:id", userValidator.updateUserValidator, throwValidationResult, userController.updateUser);

router.post("/booking/", bookingValidator.createBookingValidator, throwValidationResult, bookingController.createBooking);
router.get("/booking/:id", bookingController.getBookingDetails);
router.get("/booking/", bookingController.listBookings);
router.patch("/booking/:id", bookingValidator.updateBookingValidator, throwValidationResult, bookingController.updateBooking);

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
