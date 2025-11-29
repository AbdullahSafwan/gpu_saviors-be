import express from "express";
import { analyticsController } from "../controllers/analytics";
import { analyticsValidator } from "../middleware/validator/analyticsValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/dashboard", verifyToken, analyticsValidator.dashboardValidator, throwValidationResult, analyticsController.getDashboard);
router.get("/revenue", verifyToken, analyticsValidator.revenueAnalyticsValidator, throwValidationResult, analyticsController.getRevenueAnalytics);
router.get("/customers", verifyToken, analyticsValidator.customerAnalyticsValidator, throwValidationResult, analyticsController.getCustomerAnalytics);
router.get("/repairs", verifyToken, analyticsValidator.repairAnalyticsValidator, throwValidationResult, analyticsController.getRepairAnalytics);
router.get("/warranties", verifyToken, analyticsValidator.warrantyAnalyticsValidator, throwValidationResult, analyticsController.getWarrantyAnalytics);
router.get("/financial-summary", verifyToken, analyticsValidator.financialSummaryValidator, throwValidationResult, analyticsController.getFinancialSummary);

export default router;
