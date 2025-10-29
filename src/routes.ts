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
import { expenseEntryController } from "./controllers/expenseEntry";
import { expenseEntryValidator } from "./middleware/validator/expenseEntryValidator";
import { locationController } from "./controllers/location";
import { analyticsController } from "./controllers/analytics";
import { analyticsValidator } from "./middleware/validator/analyticsValidator";

const router = express.Router();

router.post("/user/", verifyToken, userValidator.createUserValidator, throwValidationResult, userController.createUser);
router.get("/user/:id", verifyToken, userController.getUserDetails);
router.patch("/user/:id", verifyToken, userValidator.updateUserValidator, throwValidationResult, userController.updateUser);

router.post("/booking/", verifyToken, bookingValidator.createBookingValidator, throwValidationResult, bookingController.createBooking);
router.get("/booking/", verifyToken, bookingValidator.listBookingsValidator, throwValidationResult, bookingController.listBookings);
router.patch("/booking/:id", verifyToken, bookingValidator.updateBookingValidator, throwValidationResult, bookingController.updateBooking);
router.delete("/booking/:id", verifyToken, bookingValidator.removeBookingValidator, bookingController.removeBooking);
router.get("/dashboard/", verifyToken, bookingController.dashboard);
router.get("/booking/:id/document", verifyToken, bookingValidator.generateDocumentValidator, throwValidationResult, bookingController.generateDocument);
router.get("/booking/:id", verifyToken, bookingController.getBookingDetails);

// router.post("/auth/signup", authValidator.signUpValidator, throwValidationResult, authController.signUp);
router.post("/auth/login", authValidator.logInValidator, throwValidationResult, authController.logIn);
router.post("/auth/refresh", authController.refreshToken);
router.delete("/auth/logout", authController.logOut);
// router.post("/auth/sendverificationemail", authController.sendVerificationMail);
// router.post("/auth/verifyemail", authController.verifyEmail);
// router.post("/auth/forgotpassword", authController.forgotPassword);
// router.post("/auth/resetpassword", authValidator.resetPasswordValidator, throwValidationResult, authController.resetPassword);

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

router.post("/expense-entry/", verifyToken, expenseEntryValidator.createExpenseEntryValidator, throwValidationResult, expenseEntryController.createExpenseEntry);
router.get("/expense-entry/", verifyToken, expenseEntryValidator.listExpenseEntriesValidator, throwValidationResult, expenseEntryController.listExpenseEntries);
router.get("/expense-entry/report", verifyToken, expenseEntryValidator.generateReportValidator, throwValidationResult, expenseEntryController.generateReport);
router.get("/expense-entry/daily-summary", verifyToken, expenseEntryValidator.dailySummaryValidator, throwValidationResult, expenseEntryController.getDailySummary);
router.get("/expense-entry/monthly-summary", verifyToken, expenseEntryValidator.monthlySummaryValidator, throwValidationResult, expenseEntryController.getMonthlySummary);
router.get("/expense-entry/:id", verifyToken, expenseEntryController.getExpenseEntryDetails);
router.patch("/expense-entry/:id", verifyToken, expenseEntryValidator.updateExpenseEntryValidator, throwValidationResult, expenseEntryController.updateExpenseEntry);
router.delete("/expense-entry/:id", verifyToken, expenseEntryController.deleteExpenseEntry);


router.get("/locations", verifyToken, locationController.fetchActiveLocations);

router.get("/analytics/dashboard", verifyToken, analyticsValidator.dashboardValidator, throwValidationResult, analyticsController.getDashboard);
router.get("/analytics/revenue", verifyToken, analyticsValidator.revenueAnalyticsValidator, throwValidationResult, analyticsController.getRevenueAnalytics);
router.get("/analytics/customers", verifyToken, analyticsValidator.customerAnalyticsValidator, throwValidationResult, analyticsController.getCustomerAnalytics);
router.get("/analytics/repairs", verifyToken, analyticsValidator.repairAnalyticsValidator, throwValidationResult, analyticsController.getRepairAnalytics);
router.get("/analytics/warranties", verifyToken, analyticsValidator.warrantyAnalyticsValidator, throwValidationResult, analyticsController.getWarrantyAnalytics);
router.get("/analytics/financial-summary", verifyToken, analyticsValidator.financialSummaryValidator, throwValidationResult, analyticsController.getFinancialSummary);

export default router;
