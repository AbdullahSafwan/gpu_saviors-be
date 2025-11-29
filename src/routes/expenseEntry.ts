import express from "express";
import { expenseEntryController } from "../controllers/expenseEntry";
import { expenseEntryValidator } from "../middleware/validator/expenseEntryValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, expenseEntryValidator.createExpenseEntryValidator, throwValidationResult, expenseEntryController.createExpenseEntry);
router.get("/", verifyToken, expenseEntryValidator.listExpenseEntriesValidator, throwValidationResult, expenseEntryController.listExpenseEntries);
router.get("/report", verifyToken, expenseEntryValidator.generateReportValidator, throwValidationResult, expenseEntryController.generateReport);
router.get("/daily-summary", verifyToken, expenseEntryValidator.dailySummaryValidator, throwValidationResult, expenseEntryController.getDailySummary);
router.get("/monthly-summary", verifyToken, expenseEntryValidator.monthlySummaryValidator, throwValidationResult, expenseEntryController.getMonthlySummary);
router.get("/:id", verifyToken, expenseEntryController.getExpenseEntryDetails);
router.patch("/:id", verifyToken, expenseEntryValidator.updateExpenseEntryValidator, throwValidationResult, expenseEntryController.updateExpenseEntry);
router.delete("/:id", verifyToken, expenseEntryController.deleteExpenseEntry);

export default router;
