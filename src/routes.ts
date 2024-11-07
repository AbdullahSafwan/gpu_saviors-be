import express from "express";
import { getController } from "./controllers";
import { userController } from "./controllers/user";
import { userValidator } from "./middleware/validator/userValidator";
import { throwValidationResult } from "./services/helper";
import { systemConfigurationController } from "./controllers/systemConfiguration";
import { deliveryController } from "./controllers/delivery";
import { refundController } from "./controllers/refund";
import { bookingController } from "./controllers/booking";
import { bookingValidator } from "./middleware/validator/bookingValidator";

const router = express.Router();

router.get("/", getController);
router.post(
  "/user/",
  userValidator.userCreateValidator,
  throwValidationResult,
  userController.createUser
);
router.get("/user/:id", userController.getUserDetails);
router.patch("/user/:id", userController.updateUser);

router.post("/delivery/", deliveryController.createDelivery);
router.get("/delivery/:id", deliveryController.getDeliveryDetails);
router.patch("/delivery/:id", deliveryController.updateDelivery);

router.post("/refund/", refundController.createRefund);
router.get("/refund/:id", refundController.getRefundDetails);
router.patch("/refund/:id", refundController.updateRefund);

router.post("/booking/",bookingValidator.createBookingValidator, throwValidationResult, bookingController.createBooking);
router.get("/booking/:id", bookingController.getBookingDetails);
router.patch("/booking/:id", bookingController.updateBooking);

router.post("/systemConfiguration/", systemConfigurationController.createSystemConfiguration);
router.get(
  "/systemConfiguration/:key",
  systemConfigurationController.getSystemConfigurationDetails
);
router.patch("/systemConfiguration/:key", systemConfigurationController.updateSystemConfiguration);

export default router;
