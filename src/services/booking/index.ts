import { booking_status, payment_method, payment_status, Prisma } from "@prisma/client";
import { CreateBookingItem, CreateBookingRequest, UpdateBookingItem, UpdateBookingRequest, CreateBookingPayment, UpdateBookingPayment } from "../../types/bookingTypes";
import { CreateContactLogRequest, UpdateContactLogRequest } from "../../types/contactLogTypes";
import { CreateDeliveryRequest, UpdateDeliveryRequest } from "../../types/deliveryTypes";
import { bookingDao } from "../../dao/booking";
import prisma from "../../prisma";
import { debugLog } from "../helper";
// import { validateStatusTransition } from "./helper";

const createBooking = async (data: CreateBookingRequest, createdBy: number) => {
  try {
    data.payableAmount = data.booking_items.reduce((total: number, item) => total + item.payableAmount, 0);

    // generate unique code using timestamp
    data.code = new Date().getTime().toString(36).toUpperCase();
    const bookingData = {
      ...data,
      createdByUser: { connect: { id: createdBy } },
      modifiedByUser: { connect: { id: createdBy } },
      booking_items: {
        create: data.booking_items.map(item => ({
          ...item,
          createdByUser: { connect: { id: createdBy } },
          modifiedByUser: { connect: { id: createdBy } }
        })),
      },
      booking_payments:{
        create: {
          payableAmount: data.payableAmount,
          status: payment_status.PENDING,
          paymentMethod: payment_method.CASH,
          createdByUser: { connect: { id: createdBy } },
          modifiedByUser: { connect: { id: createdBy } }
        }
      }
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
 * the `sortBy` and `orderBy` parameters. It also supports searching across multiple fields using searchString.
 *
 * @param page - The current page number for pagination.
 * @param pageSize - The number of records per page.
 * @param sort - The field to sort by.
 * @param orderBy - The order direction (asc/desc).
 * @param status - Optional booking status filter.
 * @param searchString - Optional search string to search across multiple fields.
 * @param sortBy - The field to sort the bookings by (e.g., 'date', 'status').
 * @param orderBy - The direction of sorting: can be 'asc' for ascending or 'desc' for descending.
 * @param status - Filter by status field
 *
 * @returns The list of bookings for the requested page, or throws an error if no bookings are found.
 *
 * @throws Will throw an error if no bookings are found or if the DAO call fails.
 */

const listBookings = async (
  page: number,
  pageSize: number,
  sortBy: string | null,
  orderBy: string | null,
  status: booking_status | undefined,
  searchString?: string
) => {
  try {
    // Define searchable fields here in the service layer
    const searchFields = [
      'clientName',
      'code',
      'whatsappNumber',
      'phoneNumber',
      'booking_items.serialNumber',
      'booking_items.code'
    ];

    const result = await bookingDao.listBookings(
      prisma,
      page,
      pageSize,
      sortBy,
      orderBy,
      status,
      searchString,
      searchFields
    );
    
    if (!result) {
      throw new Error(`Booking list not found`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateBooking = async (id: number, data: UpdateBookingRequest, modifiedBy: number) => {
  try {
    const record = await bookingDao.getBooking(prisma, id);
    if (!record) {
      throw new Error(`Booking not found against id: ${id}`);
    }
    //validating status transition, status can only be changed against allowed records
    // if (data.status && !validateStatusTransition(record.status, data.status)) {
    //   throw new Error("Invalid status transition, allowed transitions are: DRAFT -> IN_REVIEW -> CONFIRMED -> PENDING_DELIVERY -> IN_QUEUE -> IN_PROGRESS -> RESOLVED -> PENDING_PAYMENT -> PENDING_DELIVERY -> OUTBOUND_DELIVERY -> CONFIRMED -> COMPLETED");
    // }
    const { booking_items, contact_log, delivery, booking_payments, ...otherData } = data;
    
    // Separate booking items based on the presence of `id`
    const itemsToUpdate = booking_items?.filter((item): item is UpdateBookingItem => "id" in item && !!item.id) || [];
    const itemsToCreate = booking_items?.filter((item): item is CreateBookingItem => !("id" in item)) || [];

    // Separate contact logs based on the presence of `id`
    const contactLogsToUpdate = contact_log?.filter((item): item is UpdateContactLogRequest & { id: number } => "id" in item && !!item.id) || [];
    const contactLogsToCreate = contact_log?.filter((item): item is CreateContactLogRequest => !("id" in item)) || [];

    // Separate deliveries based on the presence of `id`
    const deliveriesToUpdate = delivery?.filter((item): item is UpdateDeliveryRequest & { id: number } => "id" in item && !!item.id) || [];
    const deliveriesToCreate = delivery?.filter((item): item is CreateDeliveryRequest => !("id" in item)) || [];

    // Separate booking payments based on the presence of `id`
    const paymentsToUpdate = booking_payments?.filter((item): item is UpdateBookingPayment => "id" in item && !!item.id) || [];
    const paymentsToCreate = booking_payments?.filter((item): item is CreateBookingPayment => !("id" in item)) || [];

    const updateData: Prisma.bookingUpdateInput = {
      ...otherData,
      modifiedByUser: { connect: { id: modifiedBy } },
      ...(booking_items && {
        booking_items: {
          updateMany: itemsToUpdate.map(({ id, ...data }) => ({
            where: { id },
            data: {
              ...data,
              modifiedBy
            },
          })),
          ...(itemsToCreate.length > 0 && {
            createMany: {
              data: itemsToCreate.map(item => ({
                ...item,
                createdBy: modifiedBy,
                modifiedBy: modifiedBy
              })),
            },
          }),
        },
      }),
      ...(contact_log && {
        contact_log: {
          updateMany: contactLogsToUpdate.map(({ id, ...data }) => ({
            where: { id },
            data,
          })),
          ...(contactLogsToCreate.length > 0 && {
            createMany: {
              data: contactLogsToCreate.map(item => ({ ...item, bookingId: id })),
            },
          }),
        },
      }),
      ...(delivery && {
        delivery: {
          updateMany: deliveriesToUpdate.map(({ id, ...data }) => ({
            where: { id },
            data: {
              ...data,
              modifiedBy
            },
          })),
          ...(deliveriesToCreate.length > 0 && {
            createMany: {
              data: deliveriesToCreate.map(item => ({
                ...item,
                createdBy: modifiedBy,
                modifiedBy: modifiedBy
              })),
            },
          }),
        },
      }),
      ...(booking_payments && {
        booking_payments: {
          updateMany: paymentsToUpdate.map(({ id, ...data }) => ({
            where: { id },
            data: {
              ...data,
              modifiedBy
            },
          })),
          ...(paymentsToCreate.length > 0 && {
            createMany: {
              data: paymentsToCreate.map(item => ({
                ...item,
                createdBy: modifiedBy,
                modifiedBy: modifiedBy
              })),
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

const dashboard = async (searchString?: string) => {
  try {
    const searchFields = [
      'clientName',
      'code',
      'whatsappNumber',
      'phoneNumber',
      'booking_items.serialNumber',
      'booking_items.code'
    ];
    
    const draft = await bookingDao.fetchingBookingsByFilter(prisma, booking_status.DRAFT, searchString, searchFields);
    const confirmed = await bookingDao.fetchingBookingsByFilter(prisma, booking_status.CONFIRMED, searchString, searchFields);
    const inProgress = await bookingDao.fetchingBookingsByFilter(prisma, booking_status.IN_PROGRESS, searchString, searchFields);

    const result = { draft, confirmed, inProgress };
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const bookingService = { updateBooking, createBooking, getBooking, listBookings, dashboard };
