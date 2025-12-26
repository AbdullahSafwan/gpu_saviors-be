import express from "express";
import { bookingController } from "../controllers/booking";
import { bookingValidator } from "../middleware/validator/bookingValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, bookingValidator.createBookingValidator, throwValidationResult, bookingController.createBooking);
router.get("/", verifyToken, bookingValidator.listBookingsValidator, throwValidationResult, bookingController.listBookings);
router.get("/:id", verifyToken, bookingController.getBookingDetails);
router.patch("/:id", verifyToken, bookingValidator.updateBookingValidator, throwValidationResult, bookingController.updateBooking);
router.delete("/:id", verifyToken, bookingValidator.deleteBookingValidator, bookingController.deleteBooking);
router.post("/:id/reopen", verifyToken, bookingValidator.reopenBookingValidator, throwValidationResult, bookingController.reopenBooking);
router.get("/:id/document", verifyToken, bookingValidator.generateDocumentValidator, throwValidationResult, bookingController.generateDocument);

export default router;
