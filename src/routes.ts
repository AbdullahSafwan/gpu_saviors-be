import express from 'express';
import { getController } from './controllers';
import { userController } from './controllers/user';
import { userValidator } from './middleware/validator/userValidator';
import { bookingController } from './controllers/booking';
// import { throwValidationResult } from './services/helper';

const router = express.Router();

router.get('/', getController)
router.post('/user/',userValidator.userCreateValidator, userController.createUser)
router.get('/user/:id', userController.getUserDetails)


router.post('/booking/',bookingController.createBooking)
router.get('/booking/:id',bookingController.getBookingDetails)
router.patch('/booking/:id',bookingController.updateBooking)


export default router;