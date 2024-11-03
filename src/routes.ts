import express from "express";
import { getController } from "./controllers";
import { userController } from "./controllers/user";
import { userValidator } from "./middleware/validator/userValidator";
import { throwValidationResult } from "./services/helper";
import { system_configurationController } from "./controllers/systemConfiguration";

const router = express.Router();

router.get("/", getController);
router.post(
  "/user/",
  userValidator.userCreateValidator,
  throwValidationResult,
  userController.createUser
);
router.get("/user/:id", userController.getUserDetails);


router.post('/systemConfiguration/',system_configurationController.createSystemConfiguration)
router.get('/systemConfiguration/:key',system_configurationController.getSystemConfigurationDetails)
router.patch('/systemConfiguration/:key',system_configurationController.updateSystemConfiguration)


export default router;
