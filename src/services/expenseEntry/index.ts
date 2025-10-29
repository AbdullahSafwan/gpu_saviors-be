import { expense_category } from "@prisma/client";
import { expenseEntryDao } from "../../dao/expenseEntry";
import { locationDao } from "../../dao/location";
import prisma from "../../prisma";
import { debugLog } from "../helper";
import {
  CreateExpenseEntryRequest,
  UpdateExpenseEntryRequest,
  GenerateReportRequest,
  DailySummaryRequest,
  MonthlySummaryRequest,
} from "../../types/expenseEntryTypes";

const createExpenseEntry = async (data: CreateExpenseEntryRequest, userId: number) => {
  try {
    // Validate location exists and is active
    const location = await locationDao.getLocation(prisma, data.locationId);
    if (!location) {
      throw new Error(`Location with id ${data.locationId} not found`);
    }
    if (!location.isActive) {
      throw new Error(`Location with id ${data.locationId} is not active`);
    }

    // Create expense entry (direct entry without approval workflow)
    const entry = await expenseEntryDao.createExpenseEntry(prisma, {
      entryDate: new Date(data.entryDate),
      location: {
        connect: { id: data.locationId },
      },
      category: data.category,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      description: data.description,
      remarks: data.remarks,
      receiptNumber: data.receiptNumber,
      receiptAttachment: data.receiptAttachment,
      vendorName: data.vendorName,
      createdByUser: {
        connect: { id: userId },
      },
      modifiedByUser: {
        connect: { id: userId },
      },
    });

    return entry;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getExpenseEntry = async (id: number) => {
  try {
    const entry = await expenseEntryDao.getExpenseEntry(prisma, id);
    if (!entry) {
      throw new Error(`Expense entry with id ${id} not found`);
    }
    return entry;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const listExpenseEntries = async (
  page: number,
  pageSize: number,
  filters: {
    locationId?: number;
    category?: expense_category;
    startDate?: Date;
    endDate?: Date;
    searchString?: string;
  },
  sortBy: string = "entryDate",
  orderBy: "asc" | "desc" = "desc"
) => {
  try {
    return await expenseEntryDao.listExpenseEntries(prisma, page, pageSize, filters, sortBy, orderBy);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateExpenseEntry = async (id: number, data: UpdateExpenseEntryRequest, userId: number) => {
  try {
    // Get existing entry
    const existingEntry = await expenseEntryDao.getExpenseEntry(prisma, id);
    if (!existingEntry) {
      throw new Error(`Expense entry with id ${id} not found`);
    }

    // Validate location if provided
    if (data.locationId) {
      const location = await locationDao.getLocation(prisma, data.locationId);
      if (!location) {
        throw new Error(`Location with id ${data.locationId} not found`);
      }
      if (!location.isActive) {
        throw new Error(`Location with id ${data.locationId} is not active`);
      }
    }

    const updateData: any = {
      ...(data.entryDate && { entryDate: new Date(data.entryDate) }),
      ...(data.locationId && {
        location: {
          connect: { id: data.locationId },
        },
      }),
      ...(data.category && { category: data.category }),
      ...(data.amount && { amount: data.amount }),
      ...(data.paymentMethod && { paymentMethod: data.paymentMethod }),
      ...(data.description && { description: data.description }),
      ...(data.remarks !== undefined && { remarks: data.remarks }),
      ...(data.receiptNumber !== undefined && { receiptNumber: data.receiptNumber }),
      ...(data.vendorName !== undefined && { vendorName: data.vendorName }),
      modifiedByUser: {
        connect: { id: userId },
      },
    };

    const entry = await expenseEntryDao.updateExpenseEntry(prisma, id, updateData);
    return entry;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const deleteExpenseEntry = async (id: number) => {
  try {
    const existingEntry = await expenseEntryDao.getExpenseEntry(prisma, id);
    if (!existingEntry) {
      throw new Error(`Expense entry with id ${id} not found`);
    }

    // Soft delete
    return await expenseEntryDao.deleteExpenseEntry(prisma, id);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getDailySummary = async (data: DailySummaryRequest) => {
  try {
    const date = new Date(data.date);
    const locationId = data.locationId ? parseInt(data.locationId) : undefined;
    return await expenseEntryDao.getDailySummary(prisma, date, locationId);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getMonthlySummary = async (data: MonthlySummaryRequest) => {
  try {
    const year = data.year ? parseInt(data.year) : new Date().getFullYear();
    const month = data.month ? parseInt(data.month) : new Date().getMonth() + 1;

    // Get start and end of month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const locationId = data.locationId ? parseInt(data.locationId) : undefined;

    return await expenseEntryDao.generateReport(prisma, startDate, endDate, {
      locationId,
      groupBy: "category",
    });
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const generateReport = async (data: GenerateReportRequest) => {
  try {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const filters: any = {
      groupBy: data.groupBy || "category",
    };

    if (data.locationId) {
      filters.locationId = parseInt(data.locationId);
    }

    if (data.category) {
      filters.category = data.category;
    }

    return await expenseEntryDao.generateReport(prisma, startDate, endDate, filters);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const expenseEntryService = {
  createExpenseEntry,
  getExpenseEntry,
  listExpenseEntries,
  updateExpenseEntry,
  deleteExpenseEntry,
  getDailySummary,
  getMonthlySummary,
  generateReport,
};
