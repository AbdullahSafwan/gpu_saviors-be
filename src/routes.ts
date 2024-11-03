import express from "express";
import { getController } from "./controllers";
import { userController } from "./controllers/user";
import { userValidator } from "./middleware/validator/userValidator";
import { throwValidationResult } from "./services/helper";
import { systemConfigurationController } from "./controllers/systemConfiguration";
import { refundController } from "./controllers/refund";

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


router.post('/refund/',refundController.createRefund)
router.get('/refund/:id',refundController.getRefundDetails)
router.patch('/refund/:id',refundController.updateRefund)


router.post('/systemConfiguration/',systemConfigurationController.createSystemConfiguration)
router.get('/systemConfiguration/:key',systemConfigurationController.getSystemConfigurationDetails)
router.patch('/systemConfiguration/:key',systemConfigurationController.updateSystemConfiguration)


export default router;
