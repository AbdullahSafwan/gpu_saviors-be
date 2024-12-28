// This file contains the annotations for the swagger documentation

// user annotations

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Retrieve user details by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: integer
 *           example: 6
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
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
 *                       example: 6
 *                     firstName:
 *                       type: string
 *                       example: "dsa"
 *                     lastName:
 *                       type: string
 *                       example: "ss"
 *                     phoneNumber:
 *                       type: string
 *                       example: "03048667563"
 *                     email:
 *                       type: string
 *                       example: "abx@gmail.com"
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: string
 *                       example: "ENABLED"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-26T10:00:54.753Z"
 *                     modifiedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-26T10:00:54.753Z"
 *                 message:
 *                   type: string
 *                   example: "User details retrieved successfully"
 *                 error:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Bad request. Invalid user ID or other validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Error retrieving user details"
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
 *                           example: "Invalid user ID"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: integer
 *                         example: 404
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "No user exists with the provided ID"
 */


// booking annotations

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

// update booking annotations

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

// get booking annotations

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

// DashBoard annotations

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

//  POST service annotations

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

//  GET service annotations

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

//  PATCH service annotations

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

// POST device annotations

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

// GET delivery annotations

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

// PATCH delivery annotations

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