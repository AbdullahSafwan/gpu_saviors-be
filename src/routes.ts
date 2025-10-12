import express from "express";
import { userController } from "./controllers/user";
import { userValidator } from "./middleware/validator/userValidator";
import { throwValidationResult } from "./services/helper";
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
import { warrantyClaimController } from "./controllers/warrantyClaim";
import { warrantyClaimValidator } from "./middleware/validator/warrantyClaimValidator";
import { ledgerEntryController } from "./controllers/ledgerEntry";
import { ledgerEntryValidator } from "./middleware/validator/ledgerEntryValidator";

const router = express.Router();

router.post("/user/", verifyToken, userValidator.createUserValidator, throwValidationResult, userController.createUser);
router.get("/user/:id", verifyToken, userController.getUserDetails);
router.patch("/user/:id", verifyToken, userValidator.updateUserValidator, throwValidationResult, userController.updateUser);

router.post("/booking/", verifyToken, bookingValidator.createBookingValidator, throwValidationResult, bookingController.createBooking);
router.get("/booking/", verifyToken, bookingValidator.listBookingsValidator, throwValidationResult, bookingController.listBookings);
router.patch("/booking/:id", verifyToken, bookingValidator.updateBookingValidator, throwValidationResult, bookingController.updateBooking);
router.delete("/booking/:id", verifyToken, bookingValidator.removeBookingValidator, bookingController.removeBooking);
router.get("/dashboard/", verifyToken, bookingController.dashboard);
router.get("/booking/:id", verifyToken, bookingController.getBookingDetails);

router.post("/auth/signup", authValidator.signUpValidator, throwValidationResult, authController.signUp);
router.post("/auth/login", authValidator.logInValidator, throwValidationResult, authController.logIn);
router.post("/auth/refresh", authController.refreshToken);
router.delete("/auth/logout", authController.logOut);
router.post("/auth/sendverificationemail", authController.sendVerificationMail);
router.post("/auth/verifyemail", authController.verifyEmail);
router.post("/auth/forgotpassword", authController.forgotPassword);
router.post("/auth/resetpassword", authValidator.resetPasswordValidator, throwValidationResult, authController.resetPassword);

router.post("/service/", verifyToken, serviceValidator.createServiceValidator, throwValidationResult, serviceController.createService);
router.get("/service/:id", verifyToken, serviceController.getServiceDetails);
router.patch("/service/:id", verifyToken, serviceValidator.updateServiceValidator, throwValidationResult, serviceController.updateService);

router.post("/delivery/", verifyToken, deliveryValidator.createDeliveryValidator, throwValidationResult, deliveryController.createDelivery);
router.get("/delivery/:id", verifyToken, deliveryController.getDeliveryDetails);
router.patch("/delivery/:id", verifyToken, deliveryValidator.updateDeliveryValidator, throwValidationResult, deliveryController.updateDelivery);

router.post("/refund/", verifyToken, refundValidator.createRefundValidator, throwValidationResult, refundController.createRefund);
router.get("/refund/:id", verifyToken, refundController.getRefundDetails);
router.patch("/refund/:id", verifyToken, refundValidator.updateRefundValidator, throwValidationResult, refundController.updateRefund);


router.post("/contactLog", verifyToken, contactLogValidator.createContactLogValidator, throwValidationResult, contactLogController.createContactLog);
router.get("/contactLog/:id", verifyToken, contactLogController.getContactLogDetails);
router.patch("/contactLog/:id", verifyToken, contactLogValidator.updateContactLogValidator, throwValidationResult, contactLogController.updateContactLog);

router.post("/warrantyClaim", verifyToken, warrantyClaimValidator.createWarrantyClaimValidator, throwValidationResult, warrantyClaimController.createWarrantyClaim);
router.get("/warrantyClaim/", verifyToken, warrantyClaimValidator.listWarrantyClaimsValidator, throwValidationResult, warrantyClaimController.listWarrantyClaims);
router.get("/warrantyClaim/:id", verifyToken, warrantyClaimValidator.getWarrantyClaimByIdValidator, throwValidationResult, warrantyClaimController.getWarrantyClaimById);
router.get("/warrantyClaim/claim/:claimNumber", verifyToken, warrantyClaimValidator.getWarrantyClaimByClaimNumberValidator, throwValidationResult, warrantyClaimController.getWarrantyClaimByClaimNumber);

router.post("/ledger-entry/", verifyToken, ledgerEntryValidator.createLedgerEntryValidator, throwValidationResult, ledgerEntryController.createLedgerEntry);
router.get("/ledger-entry/", verifyToken, ledgerEntryValidator.listLedgerEntriesValidator, throwValidationResult, ledgerEntryController.listLedgerEntries);
router.get("/ledger-entry/report", verifyToken, ledgerEntryValidator.generateReportValidator, throwValidationResult, ledgerEntryController.generateReport);
router.get("/ledger-entry/daily-summary", verifyToken, ledgerEntryValidator.dailySummaryValidator, throwValidationResult, ledgerEntryController.getDailySummary);
router.get("/ledger-entry/monthly-summary", verifyToken, ledgerEntryValidator.monthlySummaryValidator, throwValidationResult, ledgerEntryController.getMonthlySummary);
router.get("/ledger-entry/:id", verifyToken, ledgerEntryController.getLedgerEntryDetails);
router.patch("/ledger-entry/:id", verifyToken, ledgerEntryValidator.updateLedgerEntryValidator, throwValidationResult, ledgerEntryController.updateLedgerEntry);
router.delete("/ledger-entry/:id", verifyToken, ledgerEntryController.deleteLedgerEntry);

export default router;
