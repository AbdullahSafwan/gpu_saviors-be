import express from "express";
import { userController } from "./controllers/user";
import { userValidator } from "./middleware/validator/userValidator";
import { throwValidationResult } from "./services/helper";
import { systemConfigurationController } from "./controllers/systemConfiguration";
import { systemConfigurationValidator } from "./middleware/validator/systemConfigurationValidation";
import { serviceController } from "./controllers/service";
import { deliveryController } from "./controllers/delivery";
import { refundController } from "./controllers/refund";
import { bookingController } from "./controllers/booking";
import { bookingValidator } from "./middleware/validator/bookingValidator";
import { contactLogController } from "./controllers/contactLog";
import { contactLogValidator } from "./middleware/validator/contactLogValidator";
import { refundValidator } from "./middleware/validator/refundValidator";
import { deliveryValidator } from "./middleware/validator/deliveryValidator";
import { serviceValidator } from "./middleware/validator/serviceValidator";

const router = express.Router();

router.post("/user/", userValidator.createUserValidator, throwValidationResult, userController.createUser);

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user details
 *     description: Retrieve details of a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the user.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Successfully fetched user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       404:
 *         description: User not found.
 */
router.get("/user/:id", userController.getUserDetails);
router.patch("/user/:id", userValidator.updateUserValidator, throwValidationResult, userController.updateUser);


/**
 * @openapi
 * /booking/:
 *   post:
 *     summary: Create a new booking
 *     description: Creates a new booking
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: Name of the client. Cannot be empty.
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 description: Client's phone number in a valid format.
 *                 example: 03001234567
 *               whatsappNumber:
 *                 type: string
 *                 description: Client's WhatsApp number in a valid format.
 *                 example: +923001234567
 *               booking_items:
 *                 type: array
 *                 description: A list of items included in the booking.
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the booking item. Cannot be empty.
 *                       example: GPU NAME
 *                     type:
 *                       type: string
 *                       description: Type of the booking item. Must match one of the allowed types.
 *                       example: GPU
 *                     payableAmount:
 *                       type: integer
 *                       description: Payable amount for the booking item. Must be a positive integer.
 *                       example: 1500
 *     responses:
 *       200:
 *         description: Booking successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique booking ID.
 *                       example: "1"
 *                     clientName:
 *                       type: string
 *                       example: John Doe
 *                     phoneNumber:
 *                       type: string
 *                       example: 03001234567
 *                     whatsappNumber:
 *                       type: string
 *                       example: +923001234567
 *                     booking_items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Room Booking
 *                           type:
 *                             type: string
 *                             example: room
 *                           payableAmount:
 *                             type: integer
 *                             example: 1500
 *                           paidAmount:
 *                             type: integer
 *                             example: 1000
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating booking.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: Phone number is required.
 */

router.post("/booking/", bookingValidator.createBookingValidator, throwValidationResult, bookingController.createBooking);
router.get("/booking/", bookingValidator.listBookingsValidator, throwValidationResult, bookingController.listBookings);
router.patch("/booking/:id", bookingValidator.updateBookingValidator, throwValidationResult, bookingController.updateBooking);
router.get("/booking/:id", bookingController.getBookingDetails);

router.post("/service/", serviceValidator.createServiceValidator, throwValidationResult, serviceController.createService);
router.get("/service/:id", serviceController.getServiceDetails);
router.patch("/service/:id", serviceValidator.updateServiceValidator, throwValidationResult, serviceController.updateService);

router.post("/delivery/", deliveryValidator.createDeliveryValidator, throwValidationResult, deliveryController.createDelivery);
router.get("/delivery/:id", deliveryController.getDeliveryDetails);
router.patch("/delivery/:id", deliveryValidator.updateDeliveryValidator, throwValidationResult, deliveryController.updateDelivery);

router.post("/refund/", refundValidator.createRefundValidator, throwValidationResult, refundController.createRefund);
router.get("/refund/:id", refundController.getRefundDetails);
router.patch("/refund/:id", refundValidator.updateRefundValidator, throwValidationResult, refundController.updateRefund);

router.post(
  "/systemConfiguration/",
  systemConfigurationValidator.createSystemConfigurationValidator,
  throwValidationResult,
  systemConfigurationController.createSystemConfiguration
);
router.get("/systemConfiguration/:id", systemConfigurationController.getSystemConfigurationDetails);
router.patch(
  "/systemConfiguration/:id",
  systemConfigurationValidator.updateSystemConfigurationValidator,
  throwValidationResult,
  systemConfigurationController.updateSystemConfiguration
);

router.post("/contactLog", contactLogValidator.createContactLogValidator, throwValidationResult, contactLogController.createContactLog);
router.get("/contactLog/:id", contactLogController.getContactLogDetails);
router.patch("/contactLog/:id", contactLogValidator.updateContactLogValidator, throwValidationResult, contactLogController.updateContactLog);

export default router;
