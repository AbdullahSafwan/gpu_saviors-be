import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { analyticsService } from "../services/analytics";
import {
  DashboardRequest,
  RevenueAnalyticsRequest,
  CustomerAnalyticsRequest,
  RepairAnalyticsRequest,
  FinancialSummaryRequest,
} from "../types/analyticsTypes";

/**
 * Get comprehensive dashboard with all metrics
 * GET /analytics/dashboard
 */
const getDashboard = async (req: Request<unknown, unknown, unknown, DashboardRequest>, res: Response) => {
  try {
    const data: DashboardRequest = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      locationId: req.query.locationId,
    };

    const result = await analyticsService.getDashboard(data);
    sendSuccessResponse(res, 200, "Successfully fetched dashboard analytics", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching dashboard analytics", error);
  }
};

/**
 * Get revenue analytics with optional grouping
 * GET /analytics/revenue
 */
const getRevenueAnalytics = async (req: Request<unknown, unknown, unknown, RevenueAnalyticsRequest>, res: Response) => {
  try {
    const data: RevenueAnalyticsRequest = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      locationId: req.query.locationId,
      groupBy: req.query.groupBy,
    };

    const result = await analyticsService.getRevenueAnalytics(data);
    sendSuccessResponse(res, 200, "Successfully fetched revenue analytics", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching revenue analytics", error);
  }
};

/**
 * Get customer analytics
 * GET /analytics/customers
 */
const getCustomerAnalytics = async (req: Request<unknown, unknown, unknown, CustomerAnalyticsRequest>, res: Response) => {
  try {
    const data: CustomerAnalyticsRequest = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      locationId: req.query.locationId,
      groupBy: req.query.groupBy,
    };

    const result = await analyticsService.getCustomerAnalytics(data);
    sendSuccessResponse(res, 200, "Successfully fetched customer analytics", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching customer analytics", error);
  }
};

/**
 * Get repair analytics
 * GET /analytics/repairs
 */
const getRepairAnalytics = async (req: Request<unknown, unknown, unknown, RepairAnalyticsRequest>, res: Response) => {
  try {
    const data: RepairAnalyticsRequest = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      locationId: req.query.locationId,
      groupBy: req.query.groupBy,
    };

    const result = await analyticsService.getRepairAnalytics(data);
    sendSuccessResponse(res, 200, "Successfully fetched repair analytics", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching repair analytics", error);
  }
};

/**
 * Get warranty analytics
 * GET /analytics/warranties
 */
const getWarrantyAnalytics = async (req: Request, res: Response) => {
  try {
    const data: any = {
      dateRange: {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      },
    };

    const result = await analyticsService.getWarrantyAnalytics(data);
    sendSuccessResponse(res, 200, "Successfully fetched warranty analytics", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching warranty analytics", error);
  }
};

/**
 * Get financial summary
 * GET /analytics/financial-summary
 */
const getFinancialSummary = async (req: Request<unknown, unknown, unknown, FinancialSummaryRequest>, res: Response) => {
  try {
    const data: FinancialSummaryRequest = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      locationId: req.query.locationId,
    };

    const result = await analyticsService.getFinancialSummary(data);
    sendSuccessResponse(res, 200, "Successfully fetched financial summary", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching financial summary", error);
  }
};

export const analyticsController = {
  getDashboard,
  getRevenueAnalytics,
  getCustomerAnalytics,
  getRepairAnalytics,
  getWarrantyAnalytics,
  getFinancialSummary,
};
