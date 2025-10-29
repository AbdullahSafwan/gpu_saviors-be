import { query } from "express-validator";

/**
 * Validator for analytics date range requests
 */
const dateRangeValidator = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date")
    .custom((value, { req }) => {
      if (value && req?.query?.endDate) {
        const startDate = new Date(value);
        const endDate = new Date(req.query.endDate as string);
        if (startDate > endDate) {
          throw new Error("Start date must be before end date");
        }
      }
      return true;
    }),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .custom((value) => {
      if (value) {
        const endDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (endDate > today) {
          throw new Error("End date cannot be in the future");
        }
      }
      return true;
    }),

  query("locationId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Location ID must be a positive integer"),
];

const dashboardValidator = [...dateRangeValidator];

const revenueAnalyticsValidator = [
  ...dateRangeValidator,
  query("groupBy")
    .optional()
    .isIn(["date", "paymentStatus", "clientType"])
    .withMessage("groupBy must be one of: date, paymentStatus, clientType"),
];

const customerAnalyticsValidator = [
  ...dateRangeValidator,
  query("groupBy")
    .optional()
    .isIn(["clientType", "referralSource", "new_vs_returning"])
    .withMessage("groupBy must be one of: clientType, referralSource, new_vs_returning"),
];

const repairAnalyticsValidator = [
  ...dateRangeValidator,
  query("groupBy")
    .optional()
    .isIn(["type", "status"])
    .withMessage("groupBy must be one of: type, status"),
];

const warrantyAnalyticsValidator = [...dateRangeValidator];

const financialSummaryValidator = [...dateRangeValidator];

export const analyticsValidator = {
  dashboardValidator,
  revenueAnalyticsValidator,
  customerAnalyticsValidator,
  repairAnalyticsValidator,
  warrantyAnalyticsValidator,
  financialSummaryValidator,
};
