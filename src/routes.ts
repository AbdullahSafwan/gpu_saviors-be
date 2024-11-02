import express from 'express';
import { getController } from './controllers';
import { userController } from './controllers/user';
import { userValidator } from './middleware/validator/userValidator';
import { serviceController } from './controllers/service';
// import { throwValidationResult } from './services/helper';

const router = express.Router();

router.get('/', getController)
router.post('/user/',userValidator.userCreateValidator, userController.createUser)
router.get('/user/:id', userController.getUserDetails)

router.get('/user/',serviceController.createService)
router.post('/service/:id', serviceController.getServiceDetails)
router.get('/service/:id',serviceController.updateService)


export default router;