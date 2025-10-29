import { expense_category, expense_payment_method } from "@prisma/client";

export interface CreateExpenseEntryRequest {
  entryDate: string;
  locationId: number;
  category: expense_category;
  amount: number;
  paymentMethod: expense_payment_method;
  description: string;
  remarks?: string;
  receiptNumber?: string;
  receiptAttachment?: string;
  vendorName?: string;
}

export interface UpdateExpenseEntryRequest {
  entryDate?: string;
  locationId?: number;
  category?: expense_category;
  amount?: number;
  paymentMethod?: expense_payment_method;
  description?: string;
  remarks?: string;
  receiptNumber?: string;
  vendorName?: string;
}

export interface ListExpenseEntriesRequest {
  page?: string;
  pageSize?: string;
  locationId?: string;
  category?: expense_category;
  startDate?: string;
  endDate?: string;
  searchString?: string;
  sortBy?: string;
  orderBy?: "asc" | "desc";
}

export interface GenerateReportRequest {
  startDate: string;
  endDate: string;
  locationId?: string;
  category?: expense_category;
  groupBy?: "location" | "category" | "date" | "paymentMethod";
}

export interface DailySummaryRequest {
  date: string;
  locationId?: string;
}

export interface MonthlySummaryRequest {
  year?: string;
  month?: string;
  locationId?: string;
}
