import { Prisma, PrismaClient, expense_category } from "@prisma/client";
import { debugLog } from "../services/helper";

const createExpenseEntry = async (prisma: PrismaClient, data: Prisma.expense_entryCreateInput) => {
  try {
    const result = await prisma.expense_entry.create({
      data,
      include: {
        location: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getExpenseEntry = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.expense_entry.findUnique({
      where: { id },
      include: {
        location: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        modifiedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const listExpenseEntries = async (
  prisma: PrismaClient,
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
    const where: Prisma.expense_entryWhereInput = {
      isActive: true,
      ...(filters.locationId && { locationId: filters.locationId }),
      ...(filters.category && { category: filters.category }),
      ...(filters.startDate &&
        filters.endDate && {
          entryDate: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
      ...(filters.searchString && {
        OR: [
          { description: { contains: filters.searchString } },
          { vendorName: { contains: filters.searchString } },
          { receiptNumber: { contains: filters.searchString } },
        ],
      }),
    };

    const [entries, totalEntries, totalAmount] = await Promise.all([
      prisma.expense_entry.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: orderBy },
        include: {
          location: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.expense_entry.count({ where }),
      prisma.expense_entry.aggregate({
        where,
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalEntries / pageSize);

    return {
      entries,
      totalPages,
      totalEntries,
      totalAmount: totalAmount._sum.amount || 0,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateExpenseEntry = async (prisma: PrismaClient, id: number, data: Prisma.expense_entryUpdateInput) => {
  try {
    const result = await prisma.expense_entry.update({
      where: { id },
      data,
      include: {
        location: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const deleteExpenseEntry = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.expense_entry.update({
      where: { id },
      data: { isActive: false },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getDailySummary = async (prisma: PrismaClient, date: Date, locationId?: number) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const where: Prisma.expense_entryWhereInput = {
      entryDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      isActive: true,
      ...(locationId && { locationId }),
    };

    const [totalAmount, entriesCount, byLocation] = await Promise.all([
      prisma.expense_entry.aggregate({
        where,
        _sum: {
          amount: true,
        },
      }),
      prisma.expense_entry.count({ where }),
      prisma.expense_entry.groupBy({
        by: ["locationId"],
        where,
        _sum: {
          amount: true,
        },
        _count: true,
      }),
    ]);

    // Get location details
    const locationIds = byLocation.map((item) => item.locationId);
    const locations = await prisma.location.findMany({
      where: { id: { in: locationIds } },
      select: { id: true, name: true, code: true },
    });

    const byLocationWithNames = byLocation.map((item) => {
      const location = locations.find((loc) => loc.id === item.locationId);
      return {
        location: location?.name || "Unknown",
        locationCode: location?.code || "N/A",
        amount: item._sum.amount || 0,
        count: item._count,
      };
    });

    return {
      date: date.toISOString().split("T")[0],
      totalExpenditure: totalAmount._sum.amount || 0,
      entriesCount,
      byLocation: byLocationWithNames,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const generateReport = async (
  prisma: PrismaClient,
  startDate: Date,
  endDate: Date,
  filters: {
    locationId?: number;
    category?: expense_category;
    groupBy?: "location" | "category" | "date" | "paymentMethod";
  }
) => {
  try {
      const where: Prisma.expense_entryWhereInput = {
      entryDate: {
        gte: startDate,
        lte: endDate,
      },
      isActive: true,
      ...(filters.locationId && { locationId: filters.locationId }),
      ...(filters.category && { category: filters.category }),
    };

    const [totalAmount, totalEntries] = await Promise.all([
      prisma.expense_entry.aggregate({
        where,
        _sum: {
          amount: true,
        },
      }),
      prisma.expense_entry.count({ where }),
    ]);

    interface BreakdownItem {
      [key: string]: string | number;
      amount: number;
      count: number;
      percentage: number;
    }

    let breakdown: BreakdownItem[] = [];

    if (filters.groupBy === "category") {
      const categoryBreakdown = await prisma.expense_entry.groupBy({
        by: ["category"],
        where,
        _sum: {
          amount: true,
        },
        _count: true,
      });

      breakdown = categoryBreakdown.map((item) => ({
        category: item.category,
        amount: item._sum.amount || 0,
        count: item._count,
        percentage: totalAmount._sum.amount ? ((item._sum.amount || 0) / totalAmount._sum.amount) * 100 : 0,
      }));
    } else if (filters.groupBy === "location") {
      const locationBreakdown = await prisma.expense_entry.groupBy({
        by: ["locationId"],
        where,
        _sum: {
          amount: true,
        },
        _count: true,
      });

      const locationIds = locationBreakdown.map((item) => item.locationId);
      const locations = await prisma.location.findMany({
        where: { id: { in: locationIds } },
        select: { id: true, name: true, code: true },
      });

      breakdown = locationBreakdown.map((item) => {
        const location = locations.find((loc) => loc.id === item.locationId);
        return {
          location: location?.name || "Unknown",
          locationCode: location?.code || "N/A",
          amount: item._sum.amount || 0,
          count: item._count,
          percentage: totalAmount._sum.amount ? ((item._sum.amount || 0) / totalAmount._sum.amount) * 100 : 0,
        };
      });
    } else if (filters.groupBy === "paymentMethod") {
      const paymentMethodBreakdown = await prisma.expense_entry.groupBy({
        by: ["paymentMethod"],
        where,
        _sum: {
          amount: true,
        },
        _count: true,
      });

      breakdown = paymentMethodBreakdown.map((item) => ({
        paymentMethod: item.paymentMethod,
        amount: item._sum.amount || 0,
        count: item._count,
        percentage: totalAmount._sum.amount ? ((item._sum.amount || 0) / totalAmount._sum.amount) * 100 : 0,
      }));
    }

    return {
      period: {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      },
      filters: {
        ...(filters.locationId && {
          location: (
            await prisma.location.findUnique({
              where: { id: filters.locationId },
              select: { name: true },
            })
          )?.name,
        }),
        ...(filters.category && { category: filters.category }),
      },
      summary: {
        totalExpenditure: totalAmount._sum.amount || 0,
        totalEntries,
        avgExpenditure: totalEntries > 0 ? (totalAmount._sum.amount || 0) / totalEntries : 0,
      },
      breakdown,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const expenseEntryDao = {
  createExpenseEntry,
  getExpenseEntry,
  listExpenseEntries,
  updateExpenseEntry,
  deleteExpenseEntry,
  getDailySummary,
  generateReport,
};
