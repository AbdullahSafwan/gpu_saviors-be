import express from "express";
import { getController } from "./controllers";
import { userController } from "./controllers/user";
import { userValidator } from "./middleware/validator/userValidator";
import { throwValidationResult } from "./services/helper";
import { systemConfigurationController } from "./controllers/systemConfiguration";
import { deliveryController } from "./controllers/delivery";
import { refundController } from "./controllers/refund";
import { refundValidator } from "./middleware/validator/refundValidator";

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

router.post('/delivery/',deliveryController.createDelivery)
router.get('/delivery/:id',deliveryController.getDeliveryDetails)
router.patch('/delivery/:id',deliveryController.updateDelivery)

router.post('/refund/',refundValidator.refundCreateValidator,throwValidationResult,refundController.createRefund)
router.get('/refund/:id',refundController.getRefundDetails)
router.patch('/refund/:id',refundValidator.refundUpdateValidatior,throwValidationResult,refundController.updateRefund)


router.post('/systemConfiguration/',systemConfigurationController.createSystemConfiguration)
router.get('/systemConfiguration/:key',systemConfigurationController.getSystemConfigurationDetails)
router.patch('/systemConfiguration/:key',systemConfigurationController.updateSystemConfiguration)


export default router;
