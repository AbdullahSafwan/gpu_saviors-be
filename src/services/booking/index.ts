import { booking_status, Prisma, booking_item_status, booking_payment_status } from "@prisma/client";
import {
  CreateBookingItem,
  CreateBookingRequest,
  UpdateBookingItem,
  UpdateBookingRequest,
  CreateBookingPayment,
  UpdateBookingPayment,
} from "../../types/bookingTypes";
import { CreateContactLogRequest, UpdateContactLogRequest } from "../../types/contactLogTypes";
import { CreateDeliveryRequest, UpdateDeliveryRequest } from "../../types/deliveryTypes";
import { bookingDao } from "../../dao/booking";
import prisma from "../../prisma";
import { debugLog } from "../helper";
import { warrantyService } from "../warranty";
import { validateStatusTransition } from "./helper";
import { generateReceipt, generateInvoice } from "./pdfHelper";

const createBooking = async (data: CreateBookingRequest, createdBy: number) => {
  try {
    const { locationId, booking_items,delivery, ...rest } = data;
    rest.payableAmount = booking_items.reduce((total: number, item) => total + item.payableAmount, 0);

    const bookingData = {
      ...rest,
      code: new Date().getTime().toString(36).toUpperCase().slice(-6), // generate a unique code based on timestamp
      location: { connect: { id: data.locationId } },
      createdByUser: { connect: { id: createdBy } },
      modifiedByUser: { connect: { id: createdBy } },
      booking_items: {
        create: booking_items.map((item) => ({
          ...item,
          createdByUser: { connect: { id: createdBy } },
          modifiedByUser: { connect: { id: createdBy } },
        })),
      },
      delivery: delivery ? {
        create: delivery.map((item) => ({
          ...item,
          createdByUser: { connect: { id: createdBy } },
          modifiedByUser: { connect: { id: createdBy } },
        } )),
      } : undefined,
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
  searchString?: string,
  isActive?: boolean | undefined
) => {
  try {
    // Define searchable fields here in the service layer
    const searchFields = ["clientName", "code", "whatsappNumber", "phoneNumber", "booking_items.serialNumber", "booking_items.code"];

    const result = await bookingDao.listBookings(prisma, page, pageSize, sortBy, orderBy, status, searchString, searchFields, isActive);

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
    // Wrap everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const record = await bookingDao.getBooking(tx, id);
      if (!record) {
        throw new Error(`Booking not found against id: ${id}`);
      }
      // validating status transition, status can only be changed against allowed records
      if (data.status && !validateStatusTransition(record.status, data.status)) {
        throw new Error(
          "Invalid status transition. Allowed workflow: DRAFT -> CONFIRMED -> IN_PROGRESS -> RESOLVED -> COMPLETED / CANCELLED. You can move backward to any previous status or use CANCELLED/EXPIRED at any time."
        );
      }

      // if booking is being marked as COMPLETED, ensure all booking items are in terminal state
      if (data.status === booking_status.COMPLETED || data.status === booking_status.RESOLVED) {
        const bookingItemsStatus = record.booking_items.every((item: any) =>
          [booking_item_status.REPAIRED, booking_item_status.NOT_REPAIRED].includes(item.status)
        );
        if (!bookingItemsStatus) {
          throw new Error("Cannot mark booking as COMPLETED unless all booking items are in terminal state (repaired or not repaired)");
        }
      }
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

      // Recalculate payableAmount if booking items were added or updated
      let calculatedPayableAmount: number | undefined;
      if (booking_items && booking_items.length > 0) {
        // Calculate new total by combining existing items with updates and new items
        const existingItems = record.booking_items;

        // Create a map of updated amounts
        const updatedAmountsMap = new Map(
          itemsToUpdate.filter((item) => item.payableAmount !== undefined).map((item) => [item.id, item.payableAmount!])
        );

        // Calculate total from existing items (with updates applied)
        let totalPayableAmount = existingItems.reduce((total, item) => {
          const updatedAmount = updatedAmountsMap.get(item.id);
          return total + (updatedAmount !== undefined ? updatedAmount : item.payableAmount);
        }, 0);

        // Add amounts from newly created items
        totalPayableAmount += itemsToCreate.reduce((total, item) => total + item.payableAmount, 0);

        calculatedPayableAmount = totalPayableAmount;
      } else {
        // If no booking items changes, use existing payableAmount for payment status calculation
        calculatedPayableAmount = record.payableAmount ?? undefined;
      }

      // calculate paid amount if booking payments were marked as PAID
      let totalPaidAmount: number | undefined;
      if (booking_payments && booking_payments.length > 0) {
        const existingPayments = record.booking_payments;

        // Create a map of updated amounts for payments marked as PAID
        const updatedPaidAmountsMap = new Map(
          paymentsToUpdate.filter((item) => item.status === "PAID" && item.paidAmount !== undefined).map((item) => [item.id, item.paidAmount!])
        );
        // Calculate total paid amount from existing payments (with updates applied)
        let paidAmount = existingPayments.reduce((total, item) => {
          const updatedAmount = updatedPaidAmountsMap.get(item.id);
          return total + (updatedAmount !== undefined ? updatedAmount : item.status === "PAID" ? item.paidAmount ?? 0 : 0);
        }, 0);

        paidAmount += paymentsToCreate.reduce((total, item) => total + ((item.status === "PAID" ? item.paidAmount : 0) ?? 0), 0);
        totalPaidAmount = paidAmount;
      } else {
        // If no booking payment changes, use existing paidAmount for payment status calculation
        totalPaidAmount = record.paidAmount ?? undefined;
      }

      let bookingPaymentStatus: booking_payment_status | undefined;
      if (totalPaidAmount !== undefined && calculatedPayableAmount !== undefined) {
        if (totalPaidAmount === 0) {
          bookingPaymentStatus = booking_payment_status.PENDING;
        } else if (totalPaidAmount >= calculatedPayableAmount) {
          bookingPaymentStatus = booking_payment_status.PAID;
        } else if (totalPaidAmount > 0 && totalPaidAmount < calculatedPayableAmount) {
          bookingPaymentStatus = booking_payment_status.PARTIAL_PAID;
        }
      }

      const updateData: Prisma.bookingUpdateInput = {
        ...otherData,
        ...(data.locationId && { location: { connect: { id: data.locationId } } }),
        modifiedByUser: { connect: { id: modifiedBy } },
        ...(calculatedPayableAmount !== undefined && { payableAmount: calculatedPayableAmount }),
        ...(totalPaidAmount !== undefined && { paidAmount: totalPaidAmount }),
        ...(bookingPaymentStatus !== undefined && { paymentStatus: bookingPaymentStatus }),
        ...(booking_items && {
          booking_items: {
            updateMany: itemsToUpdate.map(({ id, ...data }) => ({
              where: { id },
              data: {
                ...data,
                modifiedBy,
              },
            })),
            ...(itemsToCreate.length > 0 && {
              createMany: {
                data: itemsToCreate.map((item) => ({
                  ...item,
                  createdBy: modifiedBy,
                  modifiedBy: modifiedBy,
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
                data: contactLogsToCreate.map((item) => ({ ...item, bookingId: id })),
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
                modifiedBy,
              },
            })),
            ...(deliveriesToCreate.length > 0 && {
              createMany: {
                data: deliveriesToCreate.map((item) => ({
                  ...item,
                  createdBy: modifiedBy,
                  modifiedBy: modifiedBy,
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
                modifiedBy,
              },
            })),
            ...(paymentsToCreate.length > 0 && {
              createMany: {
                data: paymentsToCreate.map((item) => ({
                  ...item,
                  createdBy: modifiedBy,
                  modifiedBy: modifiedBy,
                })),
              },
            }),
          },
        }),
      };

      await bookingDao.updateBooking(tx, id, updateData);

      // Auto-create warranties for booking items that are marked as COMPLETED
      if (itemsToUpdate.length > 0) {
        for (const item of itemsToUpdate) {
          if (item.status === booking_item_status.REPAIRED && item.id) {
            // Check if warranty already exists
            const existingWarranty = await warrantyService.getWarrantyByBookingItem(tx, item.id);

            if (!existingWarranty) {
              await warrantyService.createWarranty(
                tx,
                {
                  bookingItemId: item.id,
                  warrantyDays: 32,
                },
                modifiedBy
              );
            }
          }
        }
      }

      const finalBooking = await bookingDao.getBooking(tx, id);
      if (!finalBooking) {
        throw new Error(`Booking not found after update with id: ${id}`);
      }
      return finalBooking;
    });

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const dashboard = async (searchString?: string) => {
  try {
    const searchFields = ["clientName", "code", "whatsappNumber", "phoneNumber", "booking_items.serialNumber", "booking_items.code"];

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

const generateDocument = async (id: number, documentType: "receipt" | "invoice", format: "pdf" = "pdf"): Promise<Buffer> => {
  try {
    const booking = await bookingDao.getBooking(prisma, id);

    if (!booking) {
      throw new Error(`Booking not found with id: ${id}`);
    }

    if (format !== "pdf") {
      throw new Error(`Unsupported format: ${format}. Currently only 'pdf' is supported.`);
    }

    if (documentType === "receipt") {
      return await generateReceipt(booking);
    } else {
      return await generateInvoice(booking);
    }
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const bookingService = { updateBooking, createBooking, getBooking, listBookings, dashboard, generateDocument };
