import { booking_status, Prisma } from "@prisma/client";
import { CreateBookingItem, CreateBookingRequest, UpdateBookingItem, UpdateBookingRequest } from "../../types/bookingTypes";
import { bookingDao } from "../../dao/booking";
import prisma from "../../prisma";
import { debugLog } from "../helper";

const createBooking = async (data: CreateBookingRequest) => {
  try {
    data.payableAmount = data.booking_items.reduce((total: number, item) => total + item.payableAmount, 0);

    // generate unique code using timestamp
    data.code = new Date().getTime().toString(36).toUpperCase();
    const bookingData = {
      ...data,
      booking_items: {
        create: data.booking_items,
      },
    };

    const result = await bookingDao.createBooking(prisma, bookingData);

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getBooking = async (id: number) => {
  try {
    const result = await bookingDao.getBooking(prisma, id);
    if (!result) {
      throw new Error(`Booking not found against id: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
/**
 * Fetches a list of bookings with pagination, sorting, and ordering.
 *
 * This function interacts with the booking data access object (DAO) to retrieve the list of bookings.
 * It supports pagination via `page` and `pageSize` parameters, and allows sorting and ordering based on
 * the `sortBy` and `orderBy` parameters.
 *
 * @param page - The current page number for pagination.
 * @param pageSize - The number of records per page.
 * @param sortBy - The field to sort the bookings by (e.g., 'date', 'status').
 * @param orderBy - The direction of sorting: can be 'asc' for ascending or 'desc' for descending.
 * @param status - Filter by status field
 *
 * @returns The list of bookings for the requested page, or throws an error if no bookings are found.
 *
 * @throws Will throw an error if no bookings are found or if the DAO call fails.
 */

const listBookings = async (page: number, pageSize: number, sortBy: string | null, orderBy: string | null, status: booking_status | undefined) => {
  try {
    const result = await bookingDao.listBookings(prisma, page, pageSize, sortBy, orderBy, status);
    if (!result) {
      throw new Error(`Booking list not found`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateBooking = async (id: number, data: UpdateBookingRequest) => {
  try {
    const record = await bookingDao.getBooking(prisma, id);
    if (!record) {
      throw new Error(`Booking not found against id: ${id}`);
    }
    const { booking_items, ...otherData } = data;
    // Separate items based on the presence of `id`
    // if id is present, then the item is to be updated, if not then it is to be created
    const itemsToUpdate = booking_items?.filter((item): item is UpdateBookingItem => "id" in item && !!item.id) || [];

    const itemsToCreate = booking_items?.filter((item): item is CreateBookingItem => !("id" in item)) || [];

    const updateData: Prisma.bookingUpdateInput = {
      ...otherData,
      ...(booking_items && {
        booking_items: {
          updateMany: itemsToUpdate.map(({ id, ...data }) => ({
            where: { id },
            data,
          })),
          ...(itemsToCreate.length > 0 && {
            createMany: {
              data: itemsToCreate,
            },
          }),
        },
      }),
    };

    const result = await bookingDao.updateBooking(prisma, id, updateData);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const bookingService = { updateBooking, createBooking, getBooking, listBookings };
