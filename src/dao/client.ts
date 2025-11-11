import { PrismaClient, client_status, Prisma } from "@prisma/client";
import { debugLog } from "../services/helper";

/**
 * Create a new client
 */
const createClient = async (
  prisma: PrismaClient,
  data: Prisma.clientCreateInput
) => {
  try {
    return await prisma.client.create({
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
  } catch (error) {
    debugLog("Error creating client:", error);
    throw error;
  }
};

/**
 * Get client by ID
 */
const getClient = async (prisma: PrismaClient, id: number) => {
  try {
    return await prisma.client.findUnique({
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
  } catch (error) {
    debugLog("Error getting client by ID:", error);
    throw error;
  }
};

/**
 * Get client by code
 */
const getClientByCode = async (prisma: PrismaClient, code: string) => {
  try {
    return await prisma.client.findUnique({
      where: { code },
    });
  } catch (error) {
    debugLog("Error getting client by code:", error);
    throw error;
  }
};

/**
 * List clients with pagination and filters
 */
const listClients = async (
  prisma: PrismaClient,
  filters: {
    page: number;
    pageSize: number;
    sortBy?: string;
    orderBy?: Prisma.SortOrder;
    status?: client_status;
    locationId?: number;
    searchString?: string;
    isActive?: boolean;
  }
) => {
  try {
    const { page, pageSize, sortBy = "id", orderBy = "desc", status, locationId, searchString, isActive } = filters;

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.clientWhereInput = {
      ...(status && { status }),
      ...(locationId && { locationId }),
      ...(isActive !== undefined && { isActive }),
      ...(searchString && {
        OR: [
          { businessName: { contains: searchString } },
          { code: { contains: searchString } },
          { contactPersonName: { contains: searchString } },
          { phoneNumber: { contains: searchString } },
        ],
      }),
    };

    // Fetch clients and total count
    const [clients, totalCount] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
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
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      clients,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    debugLog("Error in client DAO:", error);
    throw error;
  }
};

/**
 * Update client
 */
const updateClient = async (
  prisma: PrismaClient,
  id: number,
  data: Prisma.clientUpdateInput
) => {
  try {
    return await prisma.client.update({
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
  } catch (error) {
    debugLog("Error in client DAO:", error);
    throw error;
  }
};

/**
 * Soft delete client (set isActive = false)
 */
const deleteClient = async (prisma: PrismaClient, id: number) => {
  try {
    return await prisma.client.update({
      where: { id },
      data: { isActive: false },
    });
  } catch (error) {
    debugLog("Error in client DAO:", error);
    throw error;
  }
};

/**
 * Update client financial totals
 * Called after booking/payment changes
 */
const updateClientFinancials = async (prisma: PrismaClient, clientId: number) => {
  try {
    const totals = await prisma.booking.aggregate({
      where: {
        clientId,
        isActive: true,
      },
      _sum: {
        payableAmount: true,
        paidAmount: true,
      },
    });

    const totalPayable = totals._sum.payableAmount || 0;
    const totalPaid = totals._sum.paidAmount || 0;
    const outstandingBalance = totalPayable - totalPaid;

    return await prisma.client.update({
      where: { id: clientId },
      data: {
        totalPayable,
        totalPaid,
        outstandingBalance,
      },
    });
  } catch (error) {
    debugLog("Error in client DAO:", error);
    throw error;
  }
};

/**
 * Get client bookings with pagination
 */
const getClientBookings = async (
  prisma: PrismaClient,
  clientId: number,
  filters: {
    page: number;
    pageSize: number;
    status?: string;
  }
) => {
  try {
    const { page, pageSize, status } = filters;
    const skip = (page - 1) * pageSize;

    const where: Prisma.bookingWhereInput = {
      clientId,
      isActive: true,
      ...(status && { status: status as any }),
    };

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          booking_items: {
            where: { isActive: true },
            select: {
              id: true,
              code: true,
              name: true,
              type: true,
              status: true,
              payableAmount: true,
              paidAmount: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    debugLog("Error in client DAO:", error);
    throw error;
  }
};

/**
 * Check if client exists
 */
const checkClientExists = async (prisma: PrismaClient, id: number): Promise<boolean> => {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!client;
  } catch (error) {
    debugLog("Error in client DAO:", error);
    throw error;
  }
};

export const clientDao = {
  createClient,
  getClient,
  getClientByCode,
  listClients,
  updateClient,
  deleteClient,
  updateClientFinancials,
  getClientBookings,
  checkClientExists,
};
