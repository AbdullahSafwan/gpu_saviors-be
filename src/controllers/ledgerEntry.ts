import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { ledgerEntryService } from "../services/ledgerEntry";
import {
  CreateLedgerEntryRequest,
  UpdateLedgerEntryRequest,
  ListLedgerEntriesRequest,
  GenerateReportRequest,
  DailySummaryRequest,
  MonthlySummaryRequest,
} from "../types/ledgerEntryTypes";
import { expense_category } from "@prisma/client";

const createLedgerEntry = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateLedgerEntryRequest;
    const userId = req.user.userId;

    const result = await ledgerEntryService.createLedgerEntry(data, userId);
    sendSuccessResponse(res, 200, "Successfully created ledger entry", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating ledger entry", error);
  }
};

const getLedgerEntryDetails = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id ? +req.params.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await ledgerEntryService.getLedgerEntry(id);
    sendSuccessResponse(res, 200, "Successfully fetched ledger entry", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching ledger entry", error);
  }
};

const listLedgerEntries = async (req: Request<unknown, unknown, unknown, ListLedgerEntriesRequest>, res: Response) => {
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

    const result = await ledgerEntryService.listLedgerEntries(page, pageSize, filters, sortBy, orderBy);
    sendSuccessResponse(res, 200, "Successfully fetched ledger entries list", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching ledger entries list", error);
  }
};

const updateLedgerEntry = async (req: Request<{ id: string }, {}, UpdateLedgerEntryRequest>, res: Response) => {
  try {
    const id = req.params.id ? +req.params.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const data = req.body;
    const userId = req.user.userId;

    const result = await ledgerEntryService.updateLedgerEntry(id, data, userId);
    sendSuccessResponse(res, 200, "Successfully updated ledger entry", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating ledger entry", error);
  }
};

const deleteLedgerEntry = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id ? +req.params.id : null;
    if (!id) {
      throw new Error("id is required");
    }

    const result = await ledgerEntryService.deleteLedgerEntry(id);
    sendSuccessResponse(res, 200, "Successfully deleted ledger entry", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error deleting ledger entry", error);
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

    const result = await ledgerEntryService.getDailySummary(data);
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

    const result = await ledgerEntryService.getMonthlySummary(data);
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

    const result = await ledgerEntryService.generateReport(data);
    sendSuccessResponse(res, 200, "Successfully generated report", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error generating report", error);
  }
};

export const ledgerEntryController = {
  createLedgerEntry,
  getLedgerEntryDetails,
  listLedgerEntries,
  updateLedgerEntry,
  deleteLedgerEntry,
  getDailySummary,
  getMonthlySummary,
  generateReport,
};
