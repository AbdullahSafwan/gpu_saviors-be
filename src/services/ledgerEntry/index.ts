import { expense_category } from "@prisma/client";
import { ledgerEntryDao } from "../../dao/ledgerEntry";
import { locationDao } from "../../dao/location";
import prisma from "../../prisma";
import { debugLog } from "../helper";
import {
  CreateLedgerEntryRequest,
  UpdateLedgerEntryRequest,
  GenerateReportRequest,
  DailySummaryRequest,
  MonthlySummaryRequest,
} from "../../types/ledgerEntryTypes";

const createLedgerEntry = async (data: CreateLedgerEntryRequest, userId: number) => {
  try {
    // Validate location exists and is active
    const location = await locationDao.getLocation(prisma, data.locationId);
    if (!location) {
      throw new Error(`Location with id ${data.locationId} not found`);
    }
    if (!location.isActive) {
      throw new Error(`Location with id ${data.locationId} is not active`);
    }

    // Create ledger entry (direct entry without approval workflow)
    const entry = await ledgerEntryDao.createLedgerEntry(prisma, {
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

const getLedgerEntry = async (id: number) => {
  try {
    const entry = await ledgerEntryDao.getLedgerEntry(prisma, id);
    if (!entry) {
      throw new Error(`Ledger entry with id ${id} not found`);
    }
    return entry;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const listLedgerEntries = async (
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
    return await ledgerEntryDao.listLedgerEntries(prisma, page, pageSize, filters, sortBy, orderBy);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateLedgerEntry = async (id: number, data: UpdateLedgerEntryRequest, userId: number) => {
  try {
    // Get existing entry
    const existingEntry = await ledgerEntryDao.getLedgerEntry(prisma, id);
    if (!existingEntry) {
      throw new Error(`Ledger entry with id ${id} not found`);
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

    const entry = await ledgerEntryDao.updateLedgerEntry(prisma, id, updateData);
    return entry;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const deleteLedgerEntry = async (id: number) => {
  try {
    const existingEntry = await ledgerEntryDao.getLedgerEntry(prisma, id);
    if (!existingEntry) {
      throw new Error(`Ledger entry with id ${id} not found`);
    }

    // Soft delete
    return await ledgerEntryDao.deleteLedgerEntry(prisma, id);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getDailySummary = async (data: DailySummaryRequest) => {
  try {
    const date = new Date(data.date);
    const locationId = data.locationId ? parseInt(data.locationId) : undefined;
    return await ledgerEntryDao.getDailySummary(prisma, date, locationId);
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

    return await ledgerEntryDao.generateReport(prisma, startDate, endDate, {
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

    return await ledgerEntryDao.generateReport(prisma, startDate, endDate, filters);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const ledgerEntryService = {
  createLedgerEntry,
  getLedgerEntry,
  listLedgerEntries,
  updateLedgerEntry,
  deleteLedgerEntry,
  getDailySummary,
  getMonthlySummary,
  generateReport,
};
