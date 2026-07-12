import { booking_item_status, booking_item_type, booking_payment_status, booking_status, client_type } from "@prisma/client";
import { analyticsDao } from "../../dao/analytics";
import prisma from "../../prisma";
import { debugLog } from "../helper";
import {
  DashboardRequest,
  DashboardResponse,
  RevenueAnalyticsRequest,
  RevenueAnalyticsResponse,
  CustomerAnalyticsRequest,
  CustomerAnalyticsResponse,
  RepairAnalyticsRequest,
  RepairAnalyticsResponse,
  WarrantyAnalyticsResponse,
  FinancialSummaryResponse,
  RevenueMetrics,
  CustomerMetrics,
  RepairMetrics,
  RepairTypeBreakdown,
  ItemStatusBreakdown,
  BookingMetrics,
  WarrantyMetrics,
  FinancialMetrics,
} from "../../types/analyticsTypes";

/**
 * Get default date range (last 30 days)
 */
const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  return { startDate, endDate };
};

/**
 * Parse date range from request
 */
const parseDateRange = (startDateStr?: string, endDateStr?: string) => {
  if (startDateStr && endDateStr) {
    return {
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
    };
  }
  return getDefaultDateRange();
};

/**
 * Get comprehensive dashboard with all metrics
 */
const getDashboard = async (request: DashboardRequest): Promise<DashboardResponse> => {
  try {
    const { startDate, endDate } = parseDateRange(request.startDate, request.endDate);
    const locationId = request.locationId ? parseInt(request.locationId) : undefined;

    const itemType = request.itemType as booking_item_type | undefined;

    const [revenueData, customerData, repairData, warrantyData, expensesData, bookingData] = await Promise.all([
      getRevenueMetrics(startDate, endDate, locationId),
      getCustomerMetrics(startDate, endDate),
      getRepairMetrics(startDate, endDate, itemType),
      analyticsDao.getWarrantyStats(prisma, startDate, endDate),
      analyticsDao.getTotalExpenses(prisma, startDate, endDate, locationId),
      getBookingMetrics(startDate, endDate, locationId),
    ]);

    const financial = calculateFinancialMetrics(revenueData.totalRevenue, expensesData);

    return {
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      bookings: bookingData,
      revenue: revenueData,
      customers: customerData,
      repairs: repairData,
      warranties: calculateWarrantyMetrics(warrantyData, repairData.totalItems),
      financial,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get revenue analytics with optional grouping
 */
const getRevenueAnalytics = async (request: RevenueAnalyticsRequest): Promise<RevenueAnalyticsResponse> => {
  try {
    const { startDate, endDate } = parseDateRange(request.startDate, request.endDate);
    const locationId = request.locationId ? parseInt(request.locationId) : undefined;

    const summary = await getRevenueMetrics(startDate, endDate, locationId);

    let breakdown: any;
    if (request.groupBy === "date") {
      const dailyData = await analyticsDao.getDailyRevenueSummary(prisma, startDate, endDate);
      breakdown = dailyData.map((d) => ({
        date: d.date.toISOString(),
        bookings: d.bookings,
        revenue: d.revenue,
        collected: d.collected,
        outstanding: d.outstanding,
      }));
    } else if (request.groupBy === "paymentStatus") {
      breakdown = await analyticsDao.getRevenueByPaymentStatus(prisma);
    }

    return {
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary,
      breakdown,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get customer analytics
 */
const getCustomerAnalytics = async (request: CustomerAnalyticsRequest): Promise<CustomerAnalyticsResponse> => {
  try {
    const { startDate, endDate } = parseDateRange(request.startDate, request.endDate);

    const summary = await getCustomerMetrics(startDate, endDate);

    return {
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get repair analytics with optional itemType filter
 */
const getRepairAnalytics = async (request: RepairAnalyticsRequest): Promise<RepairAnalyticsResponse> => {
  try {
    const { startDate, endDate } = parseDateRange(request.startDate, request.endDate);
    const itemType = request.itemType as booking_item_type | undefined;

    const summary = await getRepairMetrics(startDate, endDate, itemType);

    return {
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary,
      byType: summary.byType,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get warranty analytics
 */
const getWarrantyAnalytics = async (request: WarrantyAnalyticsResponse): Promise<WarrantyAnalyticsResponse> => {
  try {
    const { startDate, endDate } = parseDateRange(request.dateRange?.startDate, request.dateRange?.endDate);

    const [warrantyStats, repairStats] = await Promise.all([
      analyticsDao.getWarrantyStats(prisma, startDate, endDate),
      analyticsDao.getRepairItemStats(prisma, startDate, endDate),
    ]);

    const totalItems = repairStats.reduce((sum, stat) => sum + stat._count, 0);

    return {
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      metrics: calculateWarrantyMetrics(warrantyStats, totalItems),
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get financial summary
 */
const getFinancialSummary = async (request: DashboardRequest): Promise<FinancialSummaryResponse> => {
  try {
    const { startDate, endDate } = parseDateRange(request.startDate, request.endDate);
    const locationId = request.locationId ? parseInt(request.locationId) : undefined;

    const [revenueData, expensesTotal, expensesByCategory] = await Promise.all([
      analyticsDao.getTotalRevenue(prisma, startDate, endDate, locationId),
      analyticsDao.getTotalExpenses(prisma, startDate, endDate, locationId),
      analyticsDao.getExpensesByCategory(prisma, startDate, endDate, locationId),
    ]);

    const summary = calculateFinancialMetrics(revenueData.totalRevenue, expensesTotal);

    const expenseBreakdown = expensesByCategory.map((cat) => ({
      category: cat.category,
      amount: cat._sum.amount || 0,
      percentage: expensesTotal > 0 ? ((cat._sum.amount || 0) / expensesTotal) * 100 : 0,
    }));

    return {
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary,
      revenueBreakdown: {
        totalBookings: revenueData.totalBookings,
        totalRevenue: revenueData.totalRevenue,
        totalCollected: revenueData.totalCollected,
        outstanding: revenueData.totalOutstanding,
      },
      expenseBreakdown: {
        totalExpenses: expensesTotal,
        byCategory: expenseBreakdown,
      },
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

// helper functions

/**
 * Calculate revenue metrics
 */
const getRevenueMetrics = async (startDate: Date, endDate: Date, locationId?: number): Promise<RevenueMetrics> => {
  const [totalData, paymentStatusBreakdown] = await Promise.all([
    analyticsDao.getTotalRevenue(prisma, startDate, endDate, locationId),
    analyticsDao.getRevenueByPaymentStatus(prisma),
  ]);

  const averageBookingValue = totalData.totalBookings > 0 ? totalData.totalRevenue / totalData.totalBookings : 0;

  const collectionRate = totalData.totalRevenue > 0 ? (totalData.totalCollected / totalData.totalRevenue) * 100 : 0;

  // Map payment status breakdown
  const statusMap = paymentStatusBreakdown.reduce((acc, item) => {
    acc[item.paymentStatus.toLowerCase()] = {
      count: item.bookingCount,
      revenue: item.totalRevenue,
      collected: item.totalCollected,
      outstanding: item.outstanding,
    };
    return acc;
  }, {} as any);

  return {
    totalBookings: totalData.totalBookings,
    totalRevenue: totalData.totalRevenue,
    totalCollected: totalData.totalCollected,
    totalOutstanding: totalData.totalOutstanding,
    averageBookingValue,
    collectionRate,
    byPaymentStatus: {
      paid: statusMap[booking_payment_status.PAID.toLowerCase()] || { count: 0, revenue: 0, collected: 0, outstanding: 0 },
      partialPaid: statusMap[booking_payment_status.PARTIAL_PAID.toLowerCase()] || { count: 0, revenue: 0, collected: 0, outstanding: 0 },
      pending: statusMap[booking_payment_status.PENDING.toLowerCase()] || { count: 0, revenue: 0, collected: 0, outstanding: 0 },
    },
  };
};

/**
 * Calculate customer metrics
 */
const getCustomerMetrics = async (startDate: Date, endDate: Date): Promise<CustomerMetrics> => {
  const [uniqueCount, byClientType, newVsReturning, topCustomers] = await Promise.all([
    analyticsDao.getUniqueCustomerCount(prisma, startDate, endDate),
    analyticsDao.getCustomersByClientType(prisma, startDate, endDate),
    analyticsDao.getNewVsReturningCustomers(prisma, startDate, endDate),
    analyticsDao.getCustomerStatistics(prisma, 10),
  ]);

  const newCustomers = newVsReturning.find((item) => item.customerType === "new")?.count || 0;
  const returningCustomers = newVsReturning.find((item) => item.customerType === "returning")?.count || 0;
  const retentionRate = uniqueCount > 0 ? (returningCustomers / uniqueCount) * 100 : 0;

  // Map client types
  const clientTypeMap = byClientType.reduce((acc, item) => {
    acc[item.clientType.toLowerCase()] = item._count.phoneNumber;
    return acc;
  }, {} as any);

  return {
    totalUniqueCustomers: uniqueCount,
    newCustomers,
    returningCustomers,
    retentionRate,
    byClientType: {
      individual: clientTypeMap[client_type.INDIVIDUAL.toLowerCase()] || 0,
      business: 0, // Not in schema
      dealer: clientTypeMap[client_type.CORPORATE.toLowerCase()] || 0,
    },
    topCustomers: topCustomers.map((customer) => ({
      phoneNumber: customer.phoneNumber,
      totalBookings: customer.totalBookings,
      totalRevenue: customer.totalRevenue,
      totalPaid: customer.totalPaid,
      firstBookingDate: customer.firstBookingDate,
    })),
  };
};

const buildItemStatusBreakdown = (statusMap: Record<string, number>): ItemStatusBreakdown => ({
  draft: statusMap[booking_item_status.DRAFT] || 0,
  pending: statusMap[booking_item_status.PENDING] || 0,
  inProgress: statusMap[booking_item_status.IN_PROGRESS] || 0,
  repaired: statusMap[booking_item_status.REPAIRED] || 0,
  notRepaired: statusMap[booking_item_status.NOT_REPAIRED] || 0,
  noIssue: statusMap[booking_item_status.NO_ISSUE] || 0,
});

/**
 * Calculate repair metrics with optional itemType filter
 */
const getRepairMetrics = async (startDate: Date, endDate: Date, itemType?: booking_item_type): Promise<RepairMetrics> => {
  const [itemStats, typeAndStatusStats, typeStats] = await Promise.all([
    analyticsDao.getRepairItemStats(prisma, startDate, endDate, itemType),
    analyticsDao.getRepairItemStatsByTypeAndStatus(prisma, startDate, endDate, itemType),
    analyticsDao.getRepairStatsByType(prisma),
  ]);

  const statusMap = itemStats.reduce((acc, item) => {
    acc[item.status] = item._count;
    return acc;
  }, {} as Record<string, number>);

  const repaired = statusMap[booking_item_status.REPAIRED] || 0;
  const notRepaired = statusMap[booking_item_status.NOT_REPAIRED] || 0;
  const inProgress = statusMap[booking_item_status.IN_PROGRESS] || 0;
  const totalItems = itemStats.reduce((sum, stat) => sum + stat._count, 0);
  const successRate = repaired + notRepaired > 0 ? (repaired / (repaired + notRepaired)) * 100 : 0;

  const avgRepairDaysMap = typeStats.reduce((acc, stat) => {
    acc[stat.type] = stat.avgRepairDays ? parseFloat(stat.avgRepairDays.toString()) : 0;
    return acc;
  }, {} as Record<string, number>);

  // Group typeAndStatusStats by type
  const typeMap: Record<string, Record<string, number>> = {};
  for (const stat of typeAndStatusStats) {
    if (!typeMap[stat.type]) typeMap[stat.type] = {};
    typeMap[stat.type][stat.status] = stat._count;
  }

  const byType: RepairTypeBreakdown[] = Object.entries(typeMap).map(([type, statuses]) => {
    const typeRepaired = statuses[booking_item_status.REPAIRED] || 0;
    const typeNotRepaired = statuses[booking_item_status.NOT_REPAIRED] || 0;
    const typeTotal = Object.values(statuses).reduce((sum, c) => sum + c, 0);
    const typeSuccessRate = typeRepaired + typeNotRepaired > 0
      ? (typeRepaired / (typeRepaired + typeNotRepaired)) * 100
      : 0;

    return {
      type: type as booking_item_type,
      totalItems: typeTotal,
      byStatus: buildItemStatusBreakdown(statuses),
      repaired: typeRepaired,
      notRepaired: typeNotRepaired,
      successRate: typeSuccessRate,
      avgRepairDays: avgRepairDaysMap[type] || 0,
    };
  });

  const avgRepairDays =
    typeStats.length > 0
      ? typeStats.reduce((sum, stat) => sum + (stat.avgRepairDays ? parseFloat(stat.avgRepairDays.toString()) : 0), 0) / typeStats.length
      : 0;

  return {
    totalItems,
    byStatus: buildItemStatusBreakdown(statusMap),
    repaired,
    notRepaired,
    inProgress,
    successRate,
    averageRepairDays: avgRepairDays,
    byType,
  };
};

/**
 * Get booking count metrics grouped by status
 */
const getBookingMetrics = async (startDate: Date, endDate: Date, locationId?: number): Promise<BookingMetrics> => {
  const breakdown = await analyticsDao.getBookingStatusBreakdown(prisma, startDate, endDate, locationId);

  const statusMap = breakdown.reduce((acc, item) => {
    acc[item.status] = item._count;
    return acc;
  }, {} as Record<string, number>);

  const total = breakdown.reduce((sum, item) => sum + item._count, 0);

  return {
    total,
    byStatus: {
      draft: statusMap[booking_status.DRAFT] || 0,
      pending: statusMap[booking_status.PENDING] || 0,
      inReview: statusMap[booking_status.IN_REVIEW] || 0,
      confirmed: statusMap[booking_status.CONFIRMED] || 0,
      pendingDelivery: statusMap[booking_status.PENDING_DELIVERY] || 0,
      inQueue: statusMap[booking_status.IN_QUEUE] || 0,
      inProgress: statusMap[booking_status.IN_PROGRESS] || 0,
      resolved: statusMap[booking_status.RESOLVED] || 0,
      pendingPayment: statusMap[booking_status.PENDING_PAYMENT] || 0,
      completed: statusMap[booking_status.COMPLETED] || 0,
      cancelled: statusMap[booking_status.CANCELLED] || 0,
      rejected: statusMap[booking_status.REJECTED] || 0,
      expired: statusMap[booking_status.EXPIRED] || 0,
    },
  };
};

/**
 * Calculate warranty metrics
 */
const calculateWarrantyMetrics = (warrantyStats: { activeWarranties: number; totalClaims: number }, totalItems: number): WarrantyMetrics => {
  const claimRate = totalItems > 0 ? (warrantyStats.totalClaims / totalItems) * 100 : 0;

  return {
    activeWarranties: warrantyStats.activeWarranties,
    totalClaims: warrantyStats.totalClaims,
    claimRate,
  };
};

/**
 * Calculate financial metrics
 */
const calculateFinancialMetrics = (totalRevenue: number, totalExpenses: number): FinancialMetrics => {
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
    roi,
  };
};

export const analyticsService = {
  getDashboard,
  getRevenueAnalytics,
  getCustomerAnalytics,
  getRepairAnalytics,
  getWarrantyAnalytics,
  getFinancialSummary,
};
