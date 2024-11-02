import express from 'express';
import { getController } from './controllers';
import { userController } from './controllers/user';
import { userValidator } from './middleware/validator/userValidator';
import { refundController } from './controllers/refund';
// import { throwValidationResult } from './services/helper';

const router = express.Router();

router.get('/', getController)
router.post('/user/',userValidator.userCreateValidator, userController.createUser)
router.get('/user/:id', userController.getUserDetails)


router.post('/refund/',refundController.createRefund)
router.get('/refund/:id',refundController.getRefundDetails)
router.patch('/refund/:id',refundController.updateRefund)


export default router;