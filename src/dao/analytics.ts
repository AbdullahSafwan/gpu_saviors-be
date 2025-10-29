import { PrismaClient, booking_status } from "@prisma/client";
import { debugLog } from "../services/helper";

/**
 * Query customer_first_booking view
 * Returns aggregated customer statistics
 */
const getCustomerStatistics = async (prisma: PrismaClient, limit?: number) => {
  try {
    return await prisma.customer_first_booking.findMany({
      orderBy: { totalRevenue: "desc" },
      take: limit,
    });
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Query revenue_by_payment_status view
 * Returns revenue breakdown by payment status
 */
const getRevenueByPaymentStatus = async (prisma: PrismaClient) => {
  try {
    return await prisma.revenue_by_payment_status.findMany();
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Query repair_stats_by_type view
 * Returns repair statistics by item type
 */
const getRepairStatsByType = async (prisma: PrismaClient) => {
  try {
    return await prisma.repair_stats_by_type.findMany();
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Query daily_revenue_summary view with date filtering
 * Returns daily revenue trends
 */
const getDailyRevenueSummary = async (prisma: PrismaClient, startDate: Date, endDate: Date) => {
  try {
    return await prisma.daily_revenue_summary.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

// ============================================
// SIMPLE PRISMA QUERIES
// ============================================

/**
 * Get total revenue for completed bookings in date range
 */
const getTotalRevenue = async (prisma: PrismaClient, startDate: Date, endDate: Date, locationId?: number) => {
  try {
    const result = await prisma.booking.aggregate({
      where: {
        status: booking_status.COMPLETED,
        isActive: true,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(locationId && { locationId }),
      },
      _sum: {
        payableAmount: true,
        paidAmount: true,
      },
      _count: true,
    });

    return {
      totalBookings: result._count,
      totalRevenue: result._sum.payableAmount || 0,
      totalCollected: result._sum.paidAmount || 0,
      totalOutstanding: (result._sum.payableAmount || 0) - (result._sum.paidAmount || 0),
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get unique customer count in date range
 */
const getUniqueCustomerCount = async (prisma: PrismaClient, startDate: Date, endDate: Date) => {
  try {
    const result = await prisma.booking.groupBy({
      by: ["phoneNumber"],
      where: {
        isActive: true,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return result.length;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get customer breakdown by client type
 */
const getCustomersByClientType = async (prisma: PrismaClient, startDate: Date, endDate: Date) => {
  try {
    const result = await prisma.booking.groupBy({
      by: ["clientType"],
      where: {
        isActive: true,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        phoneNumber: true,
      },
    });

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get repair item statistics
 */
const getRepairItemStats = async (prisma: PrismaClient, startDate: Date, endDate: Date) => {
  try {
    const result = await prisma.booking_item.groupBy({
      by: ["status"],
      where: {
        isActive: true,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    });

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get warranty statistics
 */
const getWarrantyStats = async (prisma: PrismaClient, startDate: Date, endDate: Date) => {
  try {
    const [activeWarranties, totalClaims] = await Promise.all([
      prisma.warranty.count({
        where: {
          isActive: true,
          warrantyEndDate: {
            gte: new Date(),
          },
        },
      }),
      prisma.warranty_claim.count({
        where: {
          isActive: true,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    return {
      activeWarranties,
      totalClaims,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get total expenses in date range
 */
const getTotalExpenses = async (prisma: PrismaClient, startDate: Date, endDate: Date, locationId?: number) => {
  try {
    const result = await prisma.expense_entry.aggregate({
      where: {
        isActive: true,
        entryDate: {
          gte: startDate,
          lte: endDate,
        },
        ...(locationId && { locationId }),
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get expenses breakdown by category
 */
const getExpensesByCategory = async (prisma: PrismaClient, startDate: Date, endDate: Date, locationId?: number) => {
  try {
    const result = await prisma.expense_entry.groupBy({
      by: ["category"],
      where: {
        isActive: true,
        entryDate: {
          gte: startDate,
          lte: endDate,
        },
        ...(locationId && { locationId }),
      },
      _sum: {
        amount: true,
      },
    });

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

// ============================================
// RAW SQL QUERIES (Complex, one-off)
// ============================================

/**
 * Get new vs returning customers
 * Uses CTE to determine if customer had bookings before date range
 */
const getNewVsReturningCustomers = async (prisma: PrismaClient, startDate: Date, endDate: Date) => {
  try {
    const result: Array<{ customerType: string; count: bigint }> = await prisma.$queryRaw`
      WITH customers_in_range AS (
        SELECT DISTINCT phoneNumber
        FROM booking
        WHERE createdAt >= ${startDate}
          AND createdAt <= ${endDate}
          AND isActive = 1
      ),
      customer_classification AS (
        SELECT
          cir.phoneNumber,
          CASE
            WHEN EXISTS (
              SELECT 1 FROM booking b2
              WHERE b2.phoneNumber = cir.phoneNumber
                AND b2.createdAt < ${startDate}
                AND b2.isActive = 1
            ) THEN 'returning'
            ELSE 'new'
          END as customerType
        FROM customers_in_range cir
      )
      SELECT
        customerType,
        COUNT(*) as count
      FROM customer_classification
      GROUP BY customerType
    `;

    return result.map((r) => ({
      customerType: r.customerType,
      count: Number(r.count),
    }));
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const analyticsDao = {
  getCustomerStatistics,
  getRevenueByPaymentStatus,
  getRepairStatsByType,
  getDailyRevenueSummary,
  getTotalRevenue,
  getUniqueCustomerCount,
  getCustomersByClientType,
  getRepairItemStats,
  getWarrantyStats,
  getTotalExpenses,
  getExpensesByCategory,

  // Raw SQL queries
  getNewVsReturningCustomers,
};
