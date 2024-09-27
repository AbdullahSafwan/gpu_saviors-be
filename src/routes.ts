import express from 'express';
import { getController } from './controllers';
import { userController } from './controllers/user';
import { userValidator } from './middleware/validator/userValidator';
// import { throwValidationResult } from './services/helper';

const router = express.Router();

router.get('/', getController)
router.post('/user/',userValidator.userCreateValidator, userController.createUser)


export default router;