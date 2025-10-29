import { booking_item_type, booking_payment_status, client_type } from "@prisma/client";

export interface AnalyticsDateRangeRequest {
  startDate?: string;
  endDate?: string;
  locationId?: string;
}

export interface DashboardRequest extends AnalyticsDateRangeRequest {}

export interface RevenueAnalyticsRequest extends AnalyticsDateRangeRequest {
  groupBy?: "date" | "paymentStatus" | "clientType";
}

export interface CustomerAnalyticsRequest extends AnalyticsDateRangeRequest {
  groupBy?: "clientType" | "referralSource" | "new_vs_returning";
}

export interface RepairAnalyticsRequest extends AnalyticsDateRangeRequest {
  groupBy?: "type" | "status";
}

export interface WarrantyAnalyticsRequest extends AnalyticsDateRangeRequest {}

export interface FinancialSummaryRequest extends AnalyticsDateRangeRequest {}

export interface DashboardResponse {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  revenue: RevenueMetrics;
  customers: CustomerMetrics;
  repairs: RepairMetrics;
  warranties: WarrantyMetrics;
  financial: FinancialMetrics;
}

export interface RevenueMetrics {
  totalBookings: number;
  totalRevenue: number;
  totalCollected: number;
  totalOutstanding: number;
  averageBookingValue: number;
  collectionRate: number; // percentage
  byPaymentStatus: {
    paid: BookingStatusBreakdown;
    partialPaid: BookingStatusBreakdown;
    pending: BookingStatusBreakdown;
  };
}

export interface BookingStatusBreakdown {
  count: number;
  revenue: number;
  collected: number;
  outstanding: number;
}

export interface CustomerMetrics {
  totalUniqueCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  retentionRate: number; // percentage
  byClientType: {
    individual: number;
    business: number;
    dealer: number;
  };
  topCustomers: TopCustomer[];
}

export interface TopCustomer {
  phoneNumber: string;
  totalBookings: number;
  totalRevenue: number;
  totalPaid: number;
  firstBookingDate: Date;
}

export interface RepairMetrics {
  totalItems: number;
  repaired: number;
  notRepaired: number;
  inProgress: number;
  successRate: number; // percentage
  averageRepairDays: number;
  byType: RepairTypeBreakdown[];
}

export interface RepairTypeBreakdown {
  type: booking_item_type;
  totalItems: number;
  repaired: number;
  notRepaired: number;
  successRate: number;
  avgRepairDays: number;
}

export interface WarrantyMetrics {
  activeWarranties: number;
  totalClaims: number;
  claimRate: number; // percentage
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number; // percentage
  roi: number; // percentage
}

export interface RevenueAnalyticsResponse {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: RevenueMetrics;
  breakdown?: DailyRevenueBreakdown[] | PaymentStatusBreakdown[] | ClientTypeBreakdown[];
}

export interface DailyRevenueBreakdown {
  date: string;
  bookings: number;
  revenue: number;
  collected: number;
  outstanding: number;
}

export interface PaymentStatusBreakdown {
  paymentStatus: booking_payment_status;
  bookingCount: number;
  totalRevenue: number;
  totalCollected: number;
  outstanding: number;
}

export interface ClientTypeBreakdown {
  clientType: client_type;
  bookingCount: number;
  totalRevenue: number;
  totalCollected: number;
}

export interface CustomerAnalyticsResponse {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: CustomerMetrics;
  breakdown?: ClientTypeCustomerBreakdown[] | ReferralSourceBreakdown[];
}

export interface ClientTypeCustomerBreakdown {
  clientType: client_type;
  customerCount: number;
  bookingCount: number;
  totalRevenue: number;
}

export interface ReferralSourceBreakdown {
  referralSource: string;
  customerCount: number;
  bookingCount: number;
  totalRevenue: number;
}

export interface RepairAnalyticsResponse {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: RepairMetrics;
  byType?: RepairTypeBreakdown[];
}

export interface WarrantyAnalyticsResponse {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  metrics: WarrantyMetrics;
}

export interface FinancialSummaryResponse {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: FinancialMetrics;
  revenueBreakdown: {
    totalBookings: number;
    totalRevenue: number;
    totalCollected: number;
    outstanding: number;
  };
  expenseBreakdown: {
    totalExpenses: number;
    byCategory: ExpenseCategoryBreakdown[];
  };
}

export interface ExpenseCategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}
