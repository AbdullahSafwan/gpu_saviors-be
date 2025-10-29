import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { expenseEntryService } from "../services/expenseEntry";
import {
  CreateExpenseEntryRequest,
  UpdateExpenseEntryRequest,
  ListExpenseEntriesRequest,
  GenerateReportRequest,
  DailySummaryRequest,
  MonthlySummaryRequest,
} from "../types/expenseEntryTypes";
import { expense_category } from "@prisma/client";

const createExpenseEntry = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateExpenseEntryRequest;
    const userId = req.user.userId;

    const result = await expenseEntryService.createExpenseEntry(data, userId);
    sendSuccessResponse(res, 200, "Successfully created expense entry", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating expense entry", error);
  }
};

const getExpenseEntryDetails = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id ? +req.params.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await expenseEntryService.getExpenseEntry(id);
    sendSuccessResponse(res, 200, "Successfully fetched expense entry", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching expense entry", error);
  }
};

const listExpenseEntries = async (req: Request<unknown, unknown, unknown, ListExpenseEntriesRequest>, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const sortBy = req.query.sortBy || "entryDate";
    const orderBy = (req.query.orderBy as "asc" | "desc") || "desc";

    const filters: any = {};
    if (req.query.locationId) {
      filters.locationId = parseInt(req.query.locationId);
    }
    if (req.query.category) {
      filters.category = req.query.category as expense_category;
    }
    if (req.query.startDate) {
      filters.startDate = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filters.endDate = new Date(req.query.endDate);
    }
    if (req.query.searchString) {
      filters.searchString = req.query.searchString;
    }

    const result = await expenseEntryService.listExpenseEntries(page, pageSize, filters, sortBy, orderBy);
    sendSuccessResponse(res, 200, "Successfully fetched expense entries list", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching expense entries list", error);
  }
};

const updateExpenseEntry = async (req: Request<{ id: string }, {}, UpdateExpenseEntryRequest>, res: Response) => {
  try {
    const id = req.params.id ? +req.params.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const data = req.body;
    const userId = req.user.userId;

    const result = await expenseEntryService.updateExpenseEntry(id, data, userId);
    sendSuccessResponse(res, 200, "Successfully updated expense entry", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating expense entry", error);
  }
};

const deleteExpenseEntry = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id ? +req.params.id : null;
    if (!id) {
      throw new Error("id is required");
    }

    const result = await expenseEntryService.deleteExpenseEntry(id);
    sendSuccessResponse(res, 200, "Successfully deleted expense entry", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error deleting expense entry", error);
  }
};

const getDailySummary = async (req: Request, res: Response) => {
  try {
    const data: DailySummaryRequest = {
      date: req.query.date as string,
      locationId: req.query.locationId as string | undefined,
    };
    if (!data.date) {
      throw new Error("date is required");
    }

    const result = await expenseEntryService.getDailySummary(data);
    sendSuccessResponse(res, 200, "Successfully fetched daily summary", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching daily summary", error);
  }
};

const getMonthlySummary = async (req: Request, res: Response) => {
  try {
    const data: MonthlySummaryRequest = {
      year: req.query.year as string | undefined,
      month: req.query.month as string | undefined,
      locationId: req.query.locationId as string | undefined,
    };

    const result = await expenseEntryService.getMonthlySummary(data);
    sendSuccessResponse(res, 200, "Successfully fetched monthly summary", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching monthly summary", error);
  }
};

const generateReport = async (req: Request, res: Response) => {
  try {
    const data: GenerateReportRequest = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      locationId: req.query.locationId as string | undefined,
      category: req.query.category as expense_category | undefined,
      groupBy: req.query.groupBy as "location" | "category" | "date" | "paymentMethod" | undefined,
    };
    if (!data.startDate || !data.endDate) {
      throw new Error("startDate and endDate are required");
    }

    const result = await expenseEntryService.generateReport(data);
    sendSuccessResponse(res, 200, "Successfully generated report", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error generating report", error);
  }
};

export const expenseEntryController = {
  createExpenseEntry,
  getExpenseEntryDetails,
  listExpenseEntries,
  updateExpenseEntry,
  deleteExpenseEntry,
  getDailySummary,
  getMonthlySummary,
  generateReport,
};
