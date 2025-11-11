import prisma from "../../prisma";
import { clientDao } from "../../dao/client";
import { debugLog } from "../helper";
import { CreateClientRequest, UpdateClientRequest, ListClientsRequest, GetClientBookingsRequest } from "../../types/clientTypes";
import { booking_payment_status, booking_status, payment_status, Prisma } from "@prisma/client";

/**
 * Generate unique client code
 * Format: CLI-{sequence}
 */
const generateClientCode = async (): Promise<string> => {
  try {
    // Get the latest client code
    const latestClient = await prisma.client.findFirst({
      orderBy: { id: "desc" },
      select: { code: true },
    });

    let sequence = 1;
    if (latestClient && latestClient.code) {
      // Extract number from code (e.g., "CLI-005" -> 5)
      const match = latestClient.code.match(/CLI-(\d+)/);
      if (match) {
        sequence = parseInt(match[1]) + 1;
      }
    }

    // Format: CLI-001, CLI-002, etc.
    return `CLI-${sequence.toString().padStart(3, "0")}`;
  } catch (error) {
    debugLog("Error generating client code:", error);
    throw error;
  }
};

const createClient = async (data: CreateClientRequest, createdBy: number) => {
  try {
    // Generate unique client code (business logic)
    const code = await generateClientCode();

    const clientData: Prisma.clientCreateInput = {
      businessName: data.businessName,
      contactPersonName: data.contactPersonName,
      phoneNumber: data.phoneNumber,
      whatsappNumber: data.whatsappNumber,
      email: data.email,
      businessAddress: data.businessAddress,
      city: data.city,
      postalCode: data.postalCode,
      paymentTermsDays: data.paymentTermsDays || 30,
      creditLimit: data.creditLimit,
      notes: data.notes,
      code,
      location: {
        connect: { id: data.locationId }
      },
      createdByUser: {
        connect: { id: createdBy }
      },
      modifiedByUser: {
        connect: { id: createdBy }
      }
    };

    return await clientDao.createClient(prisma, clientData);
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

const getClientDetails = async (id: number) => {
  try {
    const client = await clientDao.getClient(prisma, id);

    if (!client) {
      throw new Error("Client not found");
    }

    return client;
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

const listClients = async (filters: ListClientsRequest) => {
  try {
    const page = parseInt(filters.page || "1");
    const pageSize = parseInt(filters.pageSize || "20");
    const sortBy = filters.sortBy || "id";
    const orderBy = (filters.orderBy as "asc" | "desc") || "desc";
    const status = filters.status;
    const locationId = filters.locationId ? parseInt(filters.locationId) : undefined;
    const searchString = filters.searchString;
    const isActive = filters.isActive;

    return await clientDao.listClients(prisma, {
      page,
      pageSize,
      sortBy,
      orderBy,
      status,
      locationId,
      searchString,
      isActive,
    });
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

const updateClient = async (id: number, data: UpdateClientRequest, modifiedBy: number) => {
  try {
    // Check if client exists
    const existingClient = await clientDao.getClient(prisma, id);
    if (!existingClient) {
      throw new Error("Client not found");
    }

    const updateData = {
      ...data,
      modifiedBy,
    };

    return await clientDao.updateClient(prisma, id, updateData);
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

const deleteClient = async (id: number) => {
  try {
    // Check if client exists
    const existingClient = await clientDao.getClient(prisma, id);
    if (!existingClient) {
      throw new Error("Client not found");
    }

    // Check if client has active bookings
    const activeBookingsCount = await prisma.booking.count({
      where: {
        clientId: id,
        isActive: true,
        status: {
          notIn: [booking_status.COMPLETED, booking_status.CANCELLED],
        },
      },
    });

    if (activeBookingsCount > 0) {
      throw new Error(`Cannot delete client. Client has ${activeBookingsCount} active booking(s)`);
    }

    return await clientDao.deleteClient(prisma, id);
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

/**
 * Get client bookings with pagination
 */
const getClientBookings = async (clientId: number, filters: GetClientBookingsRequest) => {
  try {
    // Check if client exists
    const client = await clientDao.getClient(prisma, clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    const page = parseInt(filters.page || "1");
    const pageSize = parseInt(filters.pageSize || "20");
    const status = filters.status;

    const result = await clientDao.getClientBookings(prisma, clientId, {
      page,
      pageSize,
      status,
    });

    // Calculate summary
    const summary = {
      totalBookings: result.pagination.totalCount,
      totalPayable: result.bookings.reduce((sum, b) => sum + (b.payableAmount || 0), 0),
      totalPaid: result.bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0),
      outstanding: 0,
    };
    summary.outstanding = summary.totalPayable - summary.totalPaid;

    return {
      bookings: result.bookings,
      pagination: result.pagination,
      summary,
    };
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

const getClientFinancialSummary = async (clientId: number) => {
  try {
    // Check if client exists
    const client = await clientDao.getClient(prisma, clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    // Get booking counts by payment status
    const bookingsByPaymentStatus = await prisma.booking.groupBy({
      by: ["paymentStatus"],
      where: {
        clientId,
        isActive: true,
      },
      _count: true,
    });

    const paymentStatusMap: Record<string, number> = {};
    bookingsByPaymentStatus.forEach((item) => {
      paymentStatusMap[item.paymentStatus.toLowerCase()] = item._count;
    });

    // Get total bookings count
    const totalBookings = await prisma.booking.count({
      where: { clientId, isActive: true },
    });

    // Get pending bookings (not completed/cancelled)
    const pendingBookings = await prisma.booking.count({
      where: {
        clientId,
        isActive: true,
        status: {
          notIn: [booking_status.COMPLETED, booking_status.CANCELLED],
        },
      },
    });

    // Get completed bookings
    const completedBookings = await prisma.booking.count({
      where: {
        clientId,
        isActive: true,
        status: booking_status.COMPLETED,
      },
    });

    // Get recent payments (last 5)
    const recentPayments = await prisma.booking_payment.findMany({
      where: {
        booking: {
          clientId,
          isActive: true,
        },
        status: payment_status.PAID,
        isActive: true,
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          select: {
            code: true,
          },
        },
      },
    });

    // Get overdue bookings (payment status PENDING/PARTIAL, created > paymentTermsDays ago)
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - client.paymentTermsDays);

    const overdueBookings = await prisma.booking.findMany({
      where: {
        clientId,
        isActive: true,
        paymentStatus: {
          in: [booking_payment_status.PENDING, booking_payment_status.PARTIAL_PAID],
        },
        createdAt: {
          lt: overdueDate,
        },
      },
      select: {
        code: true,
        payableAmount: true,
        paidAmount: true,
        createdAt: true,
      },
    });

    const overdueWithDays = overdueBookings.map((booking) => {
      const daysOverdue =
        Math.floor((new Date().getTime() - new Date(booking.createdAt).getTime()) / (1000 * 60 * 60 * 24)) - client.paymentTermsDays;

      return {
        bookingCode: booking.code,
        payableAmount: booking.payableAmount || 0,
        paidAmount: booking.paidAmount || 0,
        daysOverdue,
      };
    });

    const creditAvailable = client.creditLimit ? client.creditLimit - client.outstandingBalance : null;

    return {
      clientId: client.id,
      businessName: client.businessName,
      totalPayable: client.totalPayable,
      totalPaid: client.totalPaid,
      outstandingBalance: client.outstandingBalance,
      creditLimit: client.creditLimit,
      creditAvailable,
      paymentTermsDays: client.paymentTermsDays,
      bookingsSummary: {
        totalBookings,
        pendingBookings,
        completedBookings,
        byPaymentStatus: paymentStatusMap,
      },
      recentPayments: recentPayments.map((payment) => ({
        bookingCode: payment.booking.code,
        paidAmount: payment.paidAmount || 0,
        paymentMethod: payment.paymentMethod,
        paidAt: payment.createdAt,
      })),
      overdueBookings: overdueWithDays,
    };
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

// Get all clients with outstanding balance
const getClientsWithOutstandingBalance = async () => {
  try {
    return await prisma.client.findMany({
      where: {
        isActive: true,
        outstandingBalance: {
          gt: 0,
        },
      },
      orderBy: {
        outstandingBalance: "desc",
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

// Get clients with overdue payments

const getOverdueClients = async () => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        isActive: true,
        outstandingBalance: {
          gt: 0,
        },
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        bookings: {
          where: {
            isActive: true,
            paymentStatus: {
              in: [booking_payment_status.PENDING, booking_payment_status.PARTIAL_PAID],
            },
          },
          select: {
            id: true,
            code: true,
            payableAmount: true,
            paidAmount: true,
            createdAt: true,
            paymentStatus: true,
          },
        },
      },
    });

    // Filter and calculate overdue
    const overdueClients = clients
      .map((client) => {
        const overdueBookings = client.bookings.filter((booking) => {
          const bookingAge = Math.floor((new Date().getTime() - new Date(booking.createdAt).getTime()) / (1000 * 60 * 60 * 24));
          return bookingAge > client.paymentTermsDays;
        });

        if (overdueBookings.length === 0) return null;

        const totalOverdue = overdueBookings.reduce((sum, b) => sum + ((b.payableAmount || 0) - (b.paidAmount || 0)), 0);

        return {
          id: client.id,
          businessName: client.businessName,
          code: client.code,
          contactPersonName: client.contactPersonName,
          phoneNumber: client.phoneNumber,
          totalOverdue,
          overdueBookingsCount: overdueBookings.length,
          paymentTermsDays: client.paymentTermsDays,
          location: client.location,
          overdueBookings: overdueBookings.map((b) => {
            const daysOverdue =
              Math.floor((new Date().getTime() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24)) - client.paymentTermsDays;

            return {
              bookingCode: b.code,
              payableAmount: b.payableAmount || 0,
              paidAmount: b.paidAmount || 0,
              outstanding: (b.payableAmount || 0) - (b.paidAmount || 0),
              daysOverdue,
            };
          }),
        };
      })
      .filter((client) => client !== null);

    return overdueClients;
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

/**
 * Get top clients by revenue
 */
const getTopClientsByRevenue = async (limit: number = 20) => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        totalPaid: "desc",
      },
      take: limit,
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return clients.map((client) => ({
      id: client.id,
      businessName: client.businessName,
      code: client.code,
      totalRevenue: client.totalPaid,
      totalPayable: client.totalPayable,
      outstandingBalance: client.outstandingBalance,
      totalBookings: client._count.bookings,
      location: client.location,
    }));
  } catch (error) {
    debugLog("Error in client service:", error);
    throw error;
  }
};

export const clientService = {
  createClient,
  getClientDetails,
  listClients,
  updateClient,
  deleteClient,
  getClientBookings,
  getClientFinancialSummary,
  getClientsWithOutstandingBalance,
  getOverdueClients,
  getTopClientsByRevenue,
};
