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
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: 03001234567
 *               whatsappNumber:
 *                 type: string
 *                 example: +923001234567
 *               booking_items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: GPU NAME
 *                     type:
 *                       type: string
 *                       example: GPU
 *                     payableAmount:
 *                       type: integer
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
 *                 id:
 *                       type: string
 *                       example: "1"
 *                 clientName:
 *                   type: string
 *                   example: "John Doe"
 *                 phoneNumber:
 *                   type: string
 *                   example: "03001234567"
 *                 whatsappNumber:
 *                   type: string
 *                   example: "+923001234567"
 *                 createdAt:
 *                   type: string
 *                   example: "2024-11-22T22:26:01.723Z"
 *                 modifiedAt:
 *                   type: string
 *                   example: "2024-11-22T22:26:01.723Z"
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 appointmentDate:
 *                   type: string
 *                   example: "null"
 *                 status:
 *                   type: string
 *                   example: "DRAFT"
 *                 code:
 *                   type: string
 *                   example: "XYZ"
 *                 paidAmount:
 *                   type: boolean
 *                   example: null
 *                 payableAmount:
 *                   type: integer
 *                   example: 7000
 *                 booking_items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: RTX 2090
 *                           type:
 *                             type: string
 *                             example: GPU
 *                           payableAmount:
 *                             type: integer
 *                             example: 1500
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

/**
 * @openapi
 * /booking/{id}:
 *   patch:
 *     summary: Update booking details
 *     description: Update the details of an existing booking by its ID. Only the provided fields will be updated.
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the booking to update.
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: 
 *                 type: integer
 *                 example: "1"
 *               clientName: 
 *                 type: string
 *                 example: "AK"
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled,Draft ] 
 *                 example: "DRAFT"
 *               paidAmount:
 *                 type: boolean
 *                 example: null
 *               payableAmount:
 *                 type: integer
 *                 example: 7000
 *               createdAt:
 *                 type: string
 *                 example: "2024-11-22T22:26:01.723Z"
 *               modifiedAt:
 *                 type: string
 *                 example: "2024-11-22T22:26:01.723Z"
 *               phoneNumber:
 *                 type: string
 *                 example: "03001234567"
 *               code:
 *                 type: string
 *                 example: "XYZ"
 *               whatsappNumber:
 *                 type: string
 *                 example: "+923001234567"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               appointmentDate:
 *                 type: string
 *                 example: "2024-11-22T22:26:01.723Z"
 *               booking_items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "GPU"
 *                     type:
 *                       type: string
 *                       enum: [GPU,LAPTOP,MOTHERBOARD] # Example enums for booking_item_type
 *                       example: "GPU"
 *                     payableAmount:
 *                       type: integer
 *                       example: 1500
 *     responses:
 *       200:
 *         description: Booking updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking updated successfully."
 *                 data:
 *                   type: object
 *                   description: The updated booking details.
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "phoneNumber"
 *                       message:
 *                         type: string
 *                         example: "Phone number should be a valid string."
 *       404:
 *         description: Booking not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking not found."
 */
router.patch("/booking/:id", bookingValidator.updateBookingValidator, throwValidationResult, bookingController.updateBooking);
/**
 * @openapi
 * /booking/{id}:
 *   get:
 *     summary: Get booking details
 *     description: Retrieve the details of a specific booking by its ID.
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the booking.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 clientName:
 *                   type: string
 *                   example: "John Doe"
 *                 phoneNumber:
 *                   type: string
 *                   example: "03001234567"
 *                 whatsappNumber:
 *                   type: string
 *                   example: "+923001234567"
 *                 createdAt:
 *                   type: string
 *                   example: "2024-11-22T22:26:01.723Z"
 *                 modifiedAt:
 *                   type: string
 *                   example: "2024-11-22T22:26:01.723Z"
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 appointmentDate:
 *                   type: string
 *                   example: "null"
 *                 status:
 *                   type: string
 *                   example: "DRAFT"
 *                 code:
 *                   type: string
 *                   example: "XYZ"
 *                 paidAmount:
 *                   type: boolean
 *                   example: null
 *                 payableAmount:
 *                   type: integer
 *                   example: 7000
 *                 booking_items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "RTX 3060"
 *                       type:
 *                         type: string
 *                         example: "GPU"
 *                       payableAmount:
 *                         type: integer
 *                         example: 5000
 *       404:
 *         description: Booking not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "invalid id."
 */
router.get("/booking/:id", bookingController.getBookingDetails);

router.post("/service/", serviceValidator.createServiceValidator, throwValidationResult, serviceController.createService);
router.get("/service/:id", serviceController.getServiceDetails);
router.patch("/service/:id", serviceValidator.updateServiceValidator, throwValidationResult, serviceController.updateService);

/**
 * @openapi
 * /delivery/:
 *   post:
 *     summary: Create a delivery
 *     description: Endpoint to create a new delivery entry with the specified details.
 *     tags:
 *       - Delivery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 70
 *                 description: Unique identifier for the booking associated with the delivery.
 *               address:
 *                 type: string
 *                 example: "town"
 *               phoneNumber:
 *                 type: string
 *                 example: "923048667563"
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-11-20 18:00:00.000"
 *                 description: Scheduled delivery date and time in ISO8601 format.
 *               status:
 *                 type: string
 *                 enum: [PENDING, DELIVERED, IN_TRANSIT_INBOUND ,IN_TRANSIT_OUTBOUND, CANCELLED, IN_WAREHOUSE, PENDING_INBOUND,PENDING_OUTBOUND]
 *                 example: "DELIVERED"
 *               postalCode:
 *                 type: integer
 *                 example: 231
 *                 description: Postal code for the delivery address.
 *               courier:
 *                 type: string
 *                 example: "leopard"
 *                 description: Courier service handling the delivery.
 *               type:
 *                 type: string
 *                 enum: [INBOUND, OUTBOUND] 
 *                 example: "INBOUND"
 *                 description: Type of delivery, either inbound or outbound.
 *               secondaryPhoneNumber:
 *                 type: string
 *                 example: "0813456789"
 *             required:
 *               - bookingId
 *               - address
 *               - phoneNumber
 *               - deliveryDate
 *               - status
 *               - postalCode
 *               - courier
 *               - type
 *     responses:
 *       200:
 *         description: Delivery created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delivery created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     bookingId:
 *                       type: integer
 *                       example: 70
 *                     address:
 *                       type: string
 *                       example: "town"
 *                     phoneNumber:
 *                       type: string
 *                       example: "923048667563"
 *                     deliveryDate:
 *                       type: string
 *                       example: "2024-11-20 18:00:00.000"
 *                     status:
 *                       type: string
 *                       example: "DELIVERED"
 *                     postalCode:
 *                       type: integer
 *                       example: 231
 *                     courier:
 *                       type: string
 *                       example: "leopard"
 *                     type:
 *                       type: string
 *                       example: "INBOUND"
 *                     secondaryPhoneNumber:
 *                       type: string
 *                       example: "0813456789"
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "phoneNumber"
 *                       message:
 *                         type: string
 *                         example: "Invalid phone number format."
 */
router.post("/delivery/", deliveryValidator.createDeliveryValidator, throwValidationResult, deliveryController.createDelivery);
/**
 * @openapi
 * /delivery/{id}:
 *   get:
 *     summary: Get delivery details
 *     description: Retrieve the details of a specific delivery by its ID.
 *     tags:
 *       - Delivery
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the delivery to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved delivery details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 bookingId:
 *                   type: integer
 *                   example: 70
 *                 address:
 *                   type: string
 *                   example: "town"
 *                 phoneNumber:
 *                   type: string
 *                   example: "923048667563"
 *                 deliveryDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-20 18:00:00.000"
 *                 status:
 *                   type: string
 *                   example: "DELIVERED"
 *                 postalCode:
 *                   type: integer
 *                   example: 231
 *                 courier:
 *                   type: string
 *                   example: "leopard"
 *                 type:
 *                   type: string
 *                   enum: [INBOUND, OUTBOUND]
 *                   example: "INBOUND"
 *                 secondaryPhoneNumber:
 *                   type: string
 *                   example: "0813456789"
 *       404:
 *         description: Delivery not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delivery not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the delivery."
 */
router.get("/delivery/:id", deliveryController.getDeliveryDetails);

/**
 * @openapi
 * /delivery/{id}:
 *   patch:
 *     summary: Update a delivery
 *     description: Update the details of an existing delivery by its ID.
 *     tags:
 *       - Delivery
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the delivery to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 70
 *                 description: Unique identifier for the booking associated with the delivery.
 *               address:
 *                 type: string
 *                 example: "new town"
 *                 description: Updated delivery address.
 *               phoneNumber:
 *                 type: string
 *                 example: "923048667563"
 *                 description: Updated primary contact number for the delivery.
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-11-25 18:00:00.000"
 *               status:
 *                 type: string
 *                 enum: [PENDING, DELIVERED, IN_TRANSIT_INBOUND ,IN_TRANSIT_OUTBOUND, CANCELLED, IN_WAREHOUSE, PENDING_INBOUND,PENDING_OUTBOUND]
 *                 example: "PENDING"
 *               postalCode:
 *                 type: integer
 *                 example: 231
 *               courier:
 *                 type: string
 *                 example: "leoperd"
 *               type:
 *                 type: string
 *                 enum: [INBOUND, OUTBOUND]
 *                 example: "OUTBOUND"
 *               secondaryPhoneNumber:
 *                 type: string
 *                 example: "0312353486"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               landmark:
 *                 type: boolean
 *                 example: null
 *             required: []
 *     responses:
 *       200:
 *         description: Delivery updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delivery updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     bookingId:
 *                       type: integer
 *                       example: 70
 *                     address:
 *                       type: string
 *                       example: "new town"
 *                     phoneNumber:
 *                       type: string
 *                       example: "923048667563"
 *                     deliveryDate:
 *                       type: string
 *                       example: "2024-11-25 18:00:00.000"
 *                     status:
 *                       type: string
 *                       example: "IN_TRANSIT"
 *                     postalCode:
 *                       type: integer
 *                       example: 231
 *                     courier:
 *                       type: string
 *                       example: "TCS"
 *                     type:
 *                       type: string
 *                       example: "OUTBOUND"
 *                     secondaryPhoneNumber:
 *                       type: string
 *                       example: "08123456789"
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "phoneNumber"
 *                       message:
 *                         type: string
 *                         example: "Invalid phone number format."
 *       404:
 *         description: Delivery not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delivery not found."
 */
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
