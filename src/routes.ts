import express from "express";
import { getController } from "./controllers";
import { userController } from "./controllers/user";
import { userValidator } from "./middleware/validator/userValidator";
import { throwValidationResult } from "./services/helper";
import { systemConfigurationController } from "./controllers/systemConfiguration";
import { systemConfigurationValidator } from "./middleware/validator/systemConfigurationValidation";

const router = express.Router();

router.get("/", getController);
router.post(
  "/user/",
  userValidator.userCreateValidator,
  throwValidationResult,
  userController.createUser
);
router.get("/user/:id", userController.getUserDetails);


router.post('/systemConfiguration/',systemConfigurationValidator.systemConfigurationCreateValidator,throwValidationResult,systemConfigurationController.createSystemConfiguration)
router.get('/systemConfiguration/:id',systemConfigurationController.getSystemConfigurationDetails)
router.patch('/systemConfiguration/:id',systemConfigurationValidator.systemConfigurationUpdateValidator,throwValidationResult,systemConfigurationController.updateSystemConfiguration)


export default router;
