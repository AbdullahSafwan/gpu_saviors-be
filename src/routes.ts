import express from 'express';
import { getController } from './controllers';
import { userController } from './controllers/user';
import { userValidator } from './middleware/validator/userValidator';
import { system_configurationController } from './controllers/systemConfiguration';
// import { throwValidationResult } from './services/helper';

const router = express.Router();

router.get('/', getController)
router.post('/user/',userValidator.userCreateValidator, userController.createUser)
router.get('/user/:id', userController.getUserDetails)


router.post('/systemConfiguration/',system_configurationController.createSystemConfiguration)
router.get('/systemConfiguration/:key',system_configurationController.getSystemConfigurationDetails)
router.patch('/systemConfiguration/:key',system_configurationController.updateSystemConfiguration)


export default router;