import express from "express";
import { getController } from "./controllers";
import { userController } from "./controllers/user";
import { userValidator } from "./middleware/validator/userValidator";
import { throwValidationResult } from "./services/helper";
import { systemConfigurationController } from "./controllers/systemConfiguration";
import { systemConfigurationValidator } from "./middleware/validator/systemConfigurationValidation";
import { serviceController } from "./controllers/service";
import { deliveryController } from "./controllers/delivery";
import { refundController } from "./controllers/refund";
import { contact_logController } from "./controllers/contactLog"
import { contactLogValidator } from "./middleware/validator/contactLogValidator";
import { refundValidator } from "./middleware/validator/refundValidator";
import { deliveryValidator } from "./middleware/validator/deliveryValidator";
import { serviceValidator } from "./middleware/validator/serviceValidator";

const router = express.Router();

router.get("/", getController);
router.post(
  "/user/",
  userValidator.userCreateValidator,
  throwValidationResult,
  userController.createUser
);
router.get("/user/:id", userController.getUserDetails);
router.patch("/user/:id", userValidator.userUpdateValidator,throwValidationResult,userController.updateUser);

router.post('/service/',serviceValidator.serviceCreateValidator,throwValidationResult,serviceController.createService)
router.get('/service/:id', serviceController.getServiceDetails)
router.patch('/service/:id',serviceValidator.serviceUpdateValidator,throwValidationResult,serviceController.updateService)

router.post('/delivery/',deliveryValidator.deliveryCreateValidator,throwValidationResult, deliveryController.createDelivery)
router.get('/delivery/:id',deliveryController.getDeliveryDetails)
router.patch('/delivery/:id',deliveryValidator.deliveryUpdateValidator,throwValidationResult,deliveryController.updateDelivery)

router.post('/refund/',refundValidator.refundCreateValidator,throwValidationResult,refundController.createRefund)
router.get('/refund/:id',refundController.getRefundDetails)
router.patch('/refund/:id',refundValidator.refundUpdateValidatior,throwValidationResult,refundController.updateRefund)


router.post('/systemConfiguration/',systemConfigurationValidator.systemConfigurationCreateValidator,throwValidationResult,systemConfigurationController.createSystemConfiguration)
router.get('/systemConfiguration/:id',systemConfigurationController.getSystemConfigurationDetails)
router.patch('/systemConfiguration/:id',systemConfigurationValidator.systemConfigurationUpdateValidator,throwValidationResult,systemConfigurationController.updateSystemConfiguration)

router.post('/contactLog',contactLogValidator.contactLogCreateValidator,throwValidationResult,contact_logController.createContactLog)
router.get('/contactLog/:id',contact_logController.getContactLogDetails)
router.patch('/contactLog/:id',contactLogValidator.contactLogUpdateValidator,throwValidationResult,contact_logController.updateContactLog)



export default router;
