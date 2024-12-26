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
import { authController } from "./controllers/auth";
import { verifyToken } from "./middleware/auth";
import { authValidator } from "./middleware/validator/authValidator";

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
 *                 type: integer
 *                 example: 0
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
 * /dashboard/:
 *   get:
 *     summary: Get dashboard data
 *     description: Retrieve dashboard data with optional query parameters for pagination, sorting, and filtering.
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination.
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page.
 *         example: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, clientName, status, appointmentDate, createdAt]
 *         description: Field to sort by.
 *         example: "createdAt"
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order of sorting.
 *         example: "desc"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PENDING, IN_REVIEW, CONFIRMED, PENDING_DELIVERY, IN_QUEUE, IN_PROGRESS, RESOLVED, REJECTED, COMPLETED, CANCELLED]
 *         description: Filter by booking status.
 *         example: "confirmed"
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     draft:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           clientName:
 *                             type: string
 *                             example: "John Doe"
 *                           status:
 *                             type: string
 *                             example: "DRAFT"
 *                           appointmentDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2022-09-27T13:00:00.000Z"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2022-09-20T13:00:00.000Z"
 *                     confirmed:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           clientName:
 *                             type: string
 *                             example: "John Doe"
 *                           status:
 *                             type: string
 *                             example: "CONFIRMED"
 *                           appointmentDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2022-09-27T13:00:00.000Z"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2022-09-20T13:00:00.000Z"
 *                     inProgress:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           clientName:
 *                             type: string
 *                             example: "John Doe"
 *                           status:
 *                             type: string
 *                             example: "IN_PROGRESS"
 *                           appointmentDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2022-09-27T13:00:00.000Z"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2022-09-20T13:00:00.000Z"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 */
router.get("/dashboard/", bookingController.dashboard);
/**
 * @openapi
 * /booking/{id}:
 *   get:
 *     summary: Get booking details
 *     description: Retrieve detailed information about a specific booking by ID.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the booking to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     customerName:
 *                       type: string
 *                       example: John Doe
 *                     bookingDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-25T14:30:00.000Z"
 *                     status:
 *                       type: string
 *                       example: "CONFIRMED"
 *                 message:
 *                   type: string
 *                   example: "Booking details retrieved successfully."
 *       401:
 *         description: Unauthorized - JWT token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Missing token. Unauthorized access."
 *       403:
 *         description: Forbidden - Token verification failed or token expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: integer
 *                         example: 403
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Forbidden", "jwt malformed"]
 *       404:
 *         description: Booking not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Booking not found."
 */
router.get("/booking/:id", verifyToken, bookingController.getBookingDetails);
/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Create a new user account.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               phoneNumber:
 *                 type: string
 *                 example: "03001234567"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "yourpassword"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     phoneNumber:
 *                       type: string
 *                       example: "03001234567"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 */
router.post("/auth/signup", authValidator.signUpValidator, throwValidationResult, authController.signUp);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Generate a new JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: testpassword
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 */
router.post("/auth/login", authValidator.logInValidator, throwValidationResult, authController.logIn);
router.post("/auth/refresh", authController.refreshToken);
router.delete("/auth/logout", authController.logOut);
router.post("/auth/sendverificationemail", authController.sendVerificationMail);
router.post("/auth/verifyemail", authController.verifyEmail);
router.post("/auth/forgotpassword", authController.forgotPassword);
router.post("/auth/resetpassword", authValidator.resetPasswordValidator, throwValidationResult, authController.resetPassword);

/**
 * @openapi
 * /service/:
 *   post:
 *     summary: Create a new service
 *     description: Create a new service associated with a specific booking item.
 *     tags:
 *       - Service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingItemId
 *               - status
 *               - remarks
 *             properties:
 *               bookingItemId:
 *                 type: integer
 *                 description: ID of the booking item associated with the service.
 *                 example: 42
 *               status:
 *                 type: string
 *                 description: Status of the service.
 *                 enum: [PENDING, IN_REPAIR, IN_QA, QA_PASSED, QA_FAILED]
 *                 example: "PENDING"
 *               remarks:
 *                 type: string
 *                 description: Additional remarks or comments for the service.
 *                 example: "Service initiated successfully."
 *     responses:
 *       201:
 *         description: Service created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier for the newly created service.
 *                   example: 123
 *                 bookingItemId:
 *                   type: integer
 *                   example: 42
 *                 status:
 *                   type: string
 *                   example: "PENDING"
 *                 remarks:
 *                   type: string
 *                   example: "Service initiated successfully."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp indicating when the service was created.
 *                   example: "2024-12-25T13:28:03.451Z"
 *                 modifiedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp indicating when the service was last modified.
 *                   example: "2024-12-25T13:28:03.451Z"
 *                 isActive:
 *                   type: boolean
 *                   description: Indicates whether the service is active.
 *                   example: true
 *       400:
 *         description: Validation error due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating the service."
 */
router.post("/service/", serviceValidator.createServiceValidator, throwValidationResult, serviceController.createService);
/**
 * @openapi
 * /service/{id}:
 *   get:
 *     summary: Get service details
 *     description: Retrieve the details of a specific service by its ID.
 *     tags:
 *       - Service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the service.
 *         example: 123
 *     responses:
 *       200:
 *         description: Service details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier for the service.
 *                   example: 123
 *                 bookingItemId:
 *                   type: integer
 *                   description: ID of the associated booking item.
 *                   example: 42
 *                 status:
 *                   type: string
 *                   description: Status of the service.
 *                   enum: [PENDING, IN_REPAIR, IN_QA, QA_PASSED, QA_FAILED]
 *                   example: "PENDING"
 *                 remarks:
 *                   type: string
 *                   description: Additional remarks or comments for the service.
 *                   example: "Service is currently in progress."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp indicating when the service was created.
 *                   example: "2024-12-25T13:28:03.451Z"
 *                 modifiedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp indicating when the service was last modified.
 *                   example: "2024-12-25T13:28:03.451Z"
 *                 isActive:
 *                   type: boolean
 *                   description: Indicates whether the service is active.
 *                   example: true
 *       404:
 *         description: Service not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the service details."
 */
router.get("/service/:id", serviceController.getServiceDetails);
/**
 * @openapi
 * /service/{id}:
 *   patch:
 *     summary: Update service details
 *     description: Update specific fields of a service by its ID.
 *     tags:
 *       - Service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingItemId:
 *                 type: integer
 *                 example: 1
 *                 description: The booking item ID associated with the service.
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_REPAIR, IN_QA, QA_PASSED, QA_FAILED]
 *                 example: "IN_REPAIR"
 *                 description: The status of the service.
 *               remarks:
 *                 type: string
 *                 example: "Service completed successfully."
 *                 description: Additional remarks for the service.
 *             required:
 *               - At least one field (bookingItemId, status, or remarks) must be provided.
 *     responses:
 *       200:
 *         description: Successfully updated the service.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 bookingItemId:
 *                   type: integer
 *                   example: 101
 *                 status:
 *                   type: string
 *                   example: "COMPLETED"
 *                 remarks:
 *                   type: string
 *                   example: "Service completed successfully."
 *       400:
 *         description: Validation error or bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error: bookingItemId must be a positive integer."
 *       404:
 *         description: Service not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the service."
 */
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
 *                 example: 1
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
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-20 18:00:00.000"
 *                 modifiedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-20 18:00:00.000"
 *                 landmark:
 *                   type: boolean
 *                   example: null
 *                 isActive:
 *                   type: boolean
 *                   example: true
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
 *                 example: 1
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
 *                 type: string
 *                 example: "null"
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
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     landmark:
 *                       type: boolean
 *                       example: null
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
/**
 * @openapi
 * /refund/:
 *   post:
 *     summary: Create a refund
 *     description: Creates a refund record for a payment.
 *     tags:
 *       - Refund
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: integer
 *                 description: The ID of the payment to refund.
 *                 example: 12345
 *               amount:
 *                 type: integer
 *                 description: The amount to refund.
 *                 example: 100
 *               remarks:
 *                 type: string
 *                 description: Optional remarks for the refund.
 *                 example: "Customer request"
 *               refundDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the refund (ISO 8601 format).
 *                 example: "2024-12-25T13:28:03.451Z"
 *     responses:
 *       200:
 *         description: Refund created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Details of the created refund.
 *                   properties:
 *                     refundId:
 *                       type: integer
 *                       description: The unique ID of the created refund.
 *                       example: 56789
 *                     paymentId:
 *                       type: integer
 *                       description: The ID of the refunded payment.
 *                       example: 12345
 *                     amount:
 *                       type: integer
 *                       description: The refunded amount.
 *                       example: 100
 *                     remarks:
 *                       type: string
 *                       description: Remarks for the refund.
 *                       example: "Customer request"
 *                     refundDate:
 *                       type: string
 *                       format: date-time
 *                       description: The date of the refund.
 *                       example: "2024-12-25T13:28:03.451Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the refund was created.
 *                       example: "2024-12-25T13:28:03.451Z"
 *                     isActive:
 *                       type: boolean
 *                       description: Indicates if the refund is active.
 *                       example: true
 *       400:
 *         description: Bad request (validation failed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   description: List of validation errors.
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         description: The field that failed validation.
 *                         example: "paymentId"
 *                       message:
 *                         type: string
 *                         description: The validation error message.
 *                         example: "paymentId is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An error occurred while creating the refund"
 */
router.post("/refund/", refundValidator.createRefundValidator, throwValidationResult, refundController.createRefund);
/**
 * @openapi
 * /refund/{id}:
 *   get:
 *     summary: Get refund details
 *     description: Retrieve detailed information about a specific refund by its ID.
 *     tags:
 *       - Refund
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the refund to retrieve.
 *         example: 1
 *     responses:
 *       200:
 *         description: Refund details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The details of the refund.
 *                   properties:
 *                     refundId:
 *                       type: integer
 *                       description: The unique ID of the refund.
 *                       example: 56789
 *                     paymentId:
 *                       type: integer
 *                       description: The ID of the refunded payment.
 *                       example: 12345
 *                     amount:
 *                       type: integer
 *                       description: The refunded amount.
 *                       example: 100
 *                     remarks:
 *                       type: string
 *                       description: Remarks for the refund.
 *                       example: "Customer request"
 *                     refundDate:
 *                       type: string
 *                       format: date-time
 *                       description: The date of the refund.
 *                       example: "2024-12-25T13:28:03.451Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the refund was created.
 *                       example: "2024-12-25T13:28:03.451Z"
 *                     modifiedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the refund was last updated.
 *                       example: "2024-12-26T10:30:00.451Z"
 *                     isActive:
 *                       type: boolean
 *                       description: Indicates if the refund is active.
 *                       example: true
 *       400:
 *         description: Bad request (invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid refund ID"
 *       404:
 *         description: Refund not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Refund not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An error occurred while retrieving the refund details"
 */
router.get("/refund/:id", refundController.getRefundDetails);
/**
 * @openapi
 * /refund/{id}:
 *   patch:
 *     summary: Update refund details
 *     description: Update specific details of an existing refund using its ID.
 *     tags:
 *       - Refund
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the refund to update.
 *         example: 56789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: integer
 *                 description: The payment ID related to the refund.
 *                 example: 1
 *               amount:
 *                 type: integer
 *                 description: The amount to refund.
 *                 example: 100
 *               remarks:
 *                 type: string
 *                 description: Remarks or comments for the refund.
 *                 example: "Partial refund for returned item."
 *               refundDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the refund.
 *                 example: "2022-09-27 18:00:00.000"
 *     responses:
 *       200:
 *         description: Refund details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The updated refund details.
 *                   properties:
 *                     refundId:
 *                       type: integer
 *                       description: The unique ID of the refund.
 *                       example: 56789
 *                     paymentId:
 *                       type: integer
 *                       description: The payment ID related to the refund.
 *                       example: 12345
 *                     amount:
 *                       type: integer
 *                       description: The updated refund amount.
 *                       example: 150
 *                     remarks:
 *                       type: string
 *                       description: Remarks or comments for the refund.
 *                       example: "Refund adjusted."
 *                     refundDate:
 *                       type: string
 *                       format: date-time
 *                       description: The updated date of the refund.
 *                       example: "2024-12-27T11:00:00.451Z"
 *                     modifiedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the refund was last updated.
 *                       example: "2024-12-28T10:00:00.451Z"
 *       400:
 *         description: Bad request (invalid input or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid input"
 *       404:
 *         description: Refund not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Refund not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An error occurred while updating the refund details"
 */
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

/**
 * @openapi
 * /contactLog:
 *   post:
 *     summary: Create a new contact log entry.
 *     description: Creates a contact log entry associated with a booking item and user.
 *     tags:
 *       - ContactLog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingItemId:
 *                 type: integer
 *                 description: The ID of the booking item associated with the contact log.
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: The ID of the user who made the contact.
 *                 example: 5
 *               contactedAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the contact was made.
 *                 example: "2022-09-27T13:00:00.000Z"
 *               status:
 *                 type: string
 *                 description: The method used for contacting (e.g., SMS, call, or email).
 *                 enum:
 *                   - SMS
 *                   - CALL
 *                   - EMAIL
 *                 example: "SMS"
 *               notes:
 *                 type: string
 *                 description: Notes regarding the contact log.
 *                 example: "Customer requested an update on the delivery status."
 *     responses:
 *       201:
 *         description: Successfully created the contact log entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the newly created contact log entry.
 *                       example: 1
 *                     bookingItemId:
 *                       type: integer
 *                       description: The ID of the booking item associated with the contact log.
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       description: The ID of the user who made the contact.
 *                       example: 5
 *                     bookingId:
 *                       type: integer
 *                       description: The ID of the booking associated with the contact log.
 *                       example: 1
 *                     contactedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the contact was made.
 *                       example: "2022-09-27T13:00:00.000Z"
 *                     status:
 *                       type: string
 *                       description: The method used for contacting (e.g., SMS, call, or email).
 *                       example: "SMS"
 *                     notes:
 *                       type: string
 *                       description: Notes regarding the contact log.
 *                       example: "gdfas"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the contact log entry was created.
 *                       example: "2024-12-26T13:09:55.192Z"
 *                     modifiedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the contact log entry was last modified.
 *                       example: "2024-12-26T13:09:55.192Z"
 *                     isActive:
 *                       type: boolean
 *                       description: Indicates whether the contact log entry is active.
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully created contactLog"
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   description: Error details if any occurred.
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: integer
 *                         example: 400
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["BookingItemId is required"]
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating the contact log."
 */
router.post("/contactLog", contactLogValidator.createContactLogValidator, throwValidationResult, contactLogController.createContactLog);
/**
 * @swagger
 * /contactLog/{id}:
 *   get:
 *     summary: Retrieve contact log details.
 *     description: Fetches the details of a specific contact log entry by its ID.
 *     tags:
 *       - ContactLog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the contact log to retrieve.
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved contact log details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the contact log entry.
 *                       example: 1
 *                     bookingItemId:
 *                       type: integer
 *                       description: The ID of the booking item associated with the contact log.
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       description: The ID of the user who made the contact.
 *                       example: 5
 *                     bookingId:
 *                       type: integer
 *                       description: The ID of the booking associated with the contact log.
 *                       example: 1
 *                     contactedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the contact was made.
 *                       example: "2022-09-27T13:00:00.000Z"
 *                     status:
 *                       type: string
 *                       description: The method used for contacting (e.g., SMS, CALL, or EMAIL).
 *                       example: "SMS"
 *                     notes:
 *                       type: string
 *                       description: Notes regarding the contact log.
 *                       example: "Customer requested an update on the delivery status."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the contact log entry was created.
 *                       example: "2024-12-26T13:09:55.192Z"
 *                     modifiedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the contact log entry was last modified.
 *                       example: "2024-12-26T13:09:55.192Z"
 *                     isActive:
 *                       type: boolean
 *                       description: Indicates whether the contact log entry is active.
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully retrieved contact log details."
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   description: Error details if any occurred.
 *       404:
 *         description: Contact log not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Contact log not found."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the contact log."
 */
router.get("/contactLog/:id", contactLogController.getContactLogDetails);
/**
 * @openapi
 * /contactLog/{id}:
 *   patch:
 *     summary: Update a contact log
 *     description: Update the details of an existing contact log by ID.
 *     tags:
 *       - ContactLog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the contact log to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 example: 5
 *               contactedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2022-09-27T13:00:00.000Z"
 *               status:
 *                 type: string
 *                 example: "SMS"
 *               notes:
 *                 type: string
 *                 example: "NOTES"
 *     responses:
 *       200:
 *         description: Contact log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     bookingItemId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     bookingId:
 *                       type: integer
 *                       example: 1
 *                     contactedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2022-09-27T13:00:00.000Z"
 *                     status:
 *                       type: string
 *                       example: "SMS"
 *                     notes:
 *                       type: string
 *                       example: "NOTES"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-26T13:09:55.192Z"
 *                     modifiedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-26T13:09:55.192Z"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully updated contactLog"
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *       404:
 *         description: Contact log not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Contact log not found"
 */
router.patch("/contactLog/:id", contactLogValidator.updateContactLogValidator, throwValidationResult, contactLogController.updateContactLog);

export default router;
