import { booking_status, Prisma, PrismaClient } from "@prisma/client";
import { debugLog, buildSearchCondition } from "../services/helper";

const createBooking = async (prisma: PrismaClient | Prisma.TransactionClient, data: Prisma.bookingCreateInput) => {
  try {
    const result = await prisma.booking.create({
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getBooking = async (prisma: PrismaClient | Prisma.TransactionClient, id: number) => {
  try {
    const result = await prisma.booking.findUnique({
      where: { id },
      include: {
        booking_items: true,
        booking_payments: true,
        contact_log: true,
        delivery: true,
        location: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
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

const listBookings = async (
  prisma: PrismaClient | Prisma.TransactionClient,
  page: number,
  pageSize: number,
  _sort: string | null,
  _orderBy: string | null,
  status: booking_status | undefined,
  searchString?: string,
  searchFields?: string[],
  isActive?: boolean | undefined,
  locationId?: number | null
) => {
  try {
    const sort = (_sort ?? "id").toString();
    const order = _orderBy;
    const orderBy = { [sort]: order };

    const where = {
      AND: [
        status ? { status } : {},
        searchString && searchFields ? buildSearchCondition(searchString, searchFields) : {},
        { isActive },
        locationId ? { locationId } : {},
      ],
    };

    const result = await prisma.booking.findMany({
      orderBy,
      where,

      // Offset pagination

      skip: (page - 1) * pageSize,
      take: pageSize,

      select: {
        clientName: true,
        code: true,
        createdAt: true,
        appointmentDate: true,
        whatsappNumber: true,
        id: true,
        status: true,
        isActive: true,
        clientType: true,
        referralSource: true,
        referralSourceNotes: true,
        location: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        booking_items: {
          select: {
            name: true,
          },
        },
      },
    });
    // Total bookings
    const totalBookings = await prisma.booking.count({ where });

    // Total number of booking pages
    const totalPages = Math.ceil(totalBookings / pageSize);

    return {
      bookings: result,
      totalPages,
      totalBookings,
      // orderBy,
    };
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateBooking = async (prisma: PrismaClient | Prisma.TransactionClient, id: number, data: Prisma.bookingUpdateInput) => {
  try {
    const result = await prisma.booking.update({
      where: { id },
      data,
      include: {
        booking_items: true,
        booking_payments: true,
        contact_log: true,
        delivery: true,
      },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const fetchingBookingsByFilter = async (
  prisma: PrismaClient | Prisma.TransactionClient,
  status: booking_status,
  searchString?: string,
  searchFields?: string[],
  isActive?: boolean | undefined
) => {
  try {
    const where = {
      AND: [{ status }, searchString && searchFields ? buildSearchCondition(searchString, searchFields) : {}, { isActive: isActive ?? true }],
    };

    const data = await prisma.booking.findMany({
      where,
      take: 3,
      select: {
        id: true,
        clientName: true,
        code: true,
        isActive: true,
        status: true,
        appointmentDate: true,
        booking_items: {
          select: {
            id: true,
            serialNumber: true,
            name: true,
            status: true,
          },
        },
      },
    });
    const count = await prisma.booking.count({ where });
    const result = { data, count };
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateManyBookings = async (
  prisma: PrismaClient | Prisma.TransactionClient,
  where: Prisma.bookingWhereInput,
  data: Prisma.bookingUpdateInput
) => {
  try {
    const result = await prisma.booking.updateMany({
      where,
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const validateBookingExists = async (prisma: PrismaClient | Prisma.TransactionClient, id: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });
  return !!booking;
};
export const bookingDao = {
  createBooking,
  getBooking,
  updateBooking,
  listBookings,
  fetchingBookingsByFilter,
  updateManyBookings,
  validateBookingExists,
};
