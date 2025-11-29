import { booking_status, Prisma, booking_item_status, booking_payment_status, client_type, delivery_status, courier_type } from "@prisma/client";
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
import { clientDao } from "../../dao/client";
import prisma from "../../prisma";
import { debugLog } from "../helper";
import { warrantyService } from "../warranty";
import { validateTerminalStatus, validateStatusTransition } from "./helper";
import { generateReceipt, generateInvoice } from "./pdfHelper";

const createBooking = async (data: CreateBookingRequest, createdBy: number) => {
  try {
    // Extract and ignore discountAmount/finalAmount if somehow provided (they are calculated, not user input)
    const { locationId, booking_items, delivery, clientId, ...rest } = data;
    // Remove discountAmount and finalAmount from rest if present
    delete (rest as any).discountAmount;
    delete (rest as any).finalAmount;

    // Calculate payableAmount (sum of item payableAmounts WITHOUT discounts)
    rest.payableAmount = booking_items.reduce((total: number, item) => total + item.payableAmount, 0);

    // Calculate total discount (sum of item discounts)
    const totalDiscountAmount = booking_items.reduce((total: number, item) => total + (item.discountAmount ?? 0), 0);

    // Calculate finalAmount (payableAmount - discountAmount)
    const finalAmount = rest.payableAmount - totalDiscountAmount;

    // Validation: finalAmount cannot be negative
    if (finalAmount < 0) {
      throw new Error("Total discount cannot exceed total payable amount");
    }

    // If CORPORATE booking with clientId, auto-populate client fields
    let finalClientName = rest.clientName;
    let finalPhoneNumber = rest.phoneNumber;
    let finalWhatsappNumber = rest.whatsappNumber;

    if (clientId && data.clientType === client_type.CORPORATE) {
      const client = await clientDao.getClient(prisma, clientId);
      if (!client) {
        throw new Error(`Client with id ${clientId} does not exist`);
      }

      // Auto-populate from client
      finalClientName = client.businessName;
      finalPhoneNumber = client.phoneNumber;
      finalWhatsappNumber = client.whatsappNumber;
    }

    // Ensure required fields are present
    if (!finalClientName || !finalPhoneNumber || !finalWhatsappNumber) {
      throw new Error("Client name, phone number, and WhatsApp number are required");
    }

    const bookingStatus =
      data.delivery && data.delivery.length && data.delivery[0].type === courier_type.INBOUND && data.delivery[0].status === delivery_status.DELIVERED
        ? booking_status.CONFIRMED
        : booking_status.DRAFT;
    const bookingData = {
      ...rest,
      status: bookingStatus,
      clientName: finalClientName,
      phoneNumber: finalPhoneNumber,
      whatsappNumber: finalWhatsappNumber,
      code: new Date().getTime().toString(36).toUpperCase().slice(-6), // generate a unique code based on timestamp
      discountAmount: totalDiscountAmount,
      finalAmount: finalAmount,
      location: { connect: { id: data.locationId } },
      ...(clientId && { client: { connect: { id: clientId } } }),
      createdByUser: { connect: { id: createdBy } },
      modifiedByUser: { connect: { id: createdBy } },
      booking_items: {
        create: booking_items.map((item) => ({
          ...item,
          createdByUser: { connect: { id: createdBy } },
          modifiedByUser: { connect: { id: createdBy } },
        })),
      },
      delivery: delivery
        ? {
            create: delivery.map((item) => ({
              ...item,
              createdByUser: { connect: { id: createdBy } },
              modifiedByUser: { connect: { id: createdBy } },
            })),
          }
        : undefined,
    };

    const result = await bookingDao.createBooking(prisma, bookingData);

    // Update client financials if linked to client
    if (clientId) {
      await clientDao.updateClientFinancials(prisma, clientId);
    }

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
  isActive?: boolean | undefined,
  locationId?: number | null
) => {
  try {
    // Define searchable fields here in the service layer
    const searchFields = ["clientName", "code", "whatsappNumber", "phoneNumber", "booking_items.serialNumber", "booking_items.code"];

    const result = await bookingDao.listBookings(prisma, page, pageSize, sortBy, orderBy, status, searchString, searchFields, isActive, locationId);

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
    // Store old clientId for financial updates outside transaction
    let oldClientId: number | null = null;

    // Wrap everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const record = await bookingDao.getBooking(tx, id);
      if (!record) {
        throw new Error(`Booking not found against id: ${id}`);
      }

      // Store the old clientId before any updates
      oldClientId = record.clientId;

      // Handle conversion from INDIVIDUAL to CORPORATE
      if (data.clientType === client_type.CORPORATE && record.clientType === client_type.INDIVIDUAL) {
        // ClientId is REQUIRED when converting to CORPORATE
        if (!data.clientId) {
          throw new Error("Client ID is required when converting booking from INDIVIDUAL to CORPORATE");
        }

        // Fetch client data to auto-populate fields
        const client = await clientDao.getClient(prisma, data.clientId);
        if (!client) {
          throw new Error(`Client with id ${data.clientId} does not exist`);
        }
        if (!client.isActive) {
          throw new Error(`Client with id ${data.clientId} is not active`);
        }
        if (client.status !== "ACTIVE") {
          throw new Error(`Client with id ${data.clientId} is not in ACTIVE status (current: ${client.status})`);
        }

        // Auto-populate client fields (override any provided values)
        data.clientName = client.businessName;
        data.phoneNumber = client.phoneNumber;
        data.whatsappNumber = client.whatsappNumber;
      }

      // Handle clientId update for existing CORPORATE bookings (changing client without changing type)
      if (data.clientId && record.clientType === client_type.CORPORATE && record.clientId !== data.clientId && !data.clientType) {
        // ClientId is being updated for a CORPORATE booking
        const client = await clientDao.getClient(prisma, data.clientId);
        if (!client) {
          throw new Error(`Client with id ${data.clientId} does not exist`);
        }
        if (!client.isActive) {
          throw new Error(`Client with id ${data.clientId} is not active`);
        }
        if (client.status !== "ACTIVE") {
          throw new Error(`Client with id ${data.clientId} is not in ACTIVE status (current: ${client.status})`);
        }

        // Auto-populate client fields from new client (override any provided values)
        data.clientName = client.businessName;
        data.phoneNumber = client.phoneNumber;
        data.whatsappNumber = client.whatsappNumber;
      }

      // Handle conversion from CORPORATE to INDIVIDUAL
      if (data.clientType === client_type.INDIVIDUAL && record.clientType === client_type.CORPORATE) {
        // When converting to INDIVIDUAL, clientId must be removed/disconnected
        // This will be handled in updateData by not including clientId

        // clientName, phoneNumber, and whatsappNumber are required for INDIVIDUAL
        if (!data.clientName || !data.phoneNumber || !data.whatsappNumber) {
          throw new Error("Client name, phone number, and WhatsApp number are required when converting booking from CORPORATE to INDIVIDUAL");
        }
      }

      // validating status transition, status can only be changed against allowed records
      if (data.status && !validateStatusTransition(record.status, data.status)) {
        throw new Error(
          "Invalid status transition. Allowed workflow: DRAFT -> CONFIRMED -> IN_PROGRESS -> RESOLVED -> COMPLETED / CANCELLED. You can move backward to any previous status or use CANCELLED/EXPIRED at any time."
        );
      }

      // if booking is being marked as COMPLETED or RESOLVED, ensure all booking items are in terminal state
      if (data.status === booking_status.COMPLETED || data.status === booking_status.RESOLVED) {
        validateTerminalStatus(data, record);
      }
      // Extract nested objects and clientId from data
      // Also remove discountAmount/finalAmount if present (they are calculated, not user input)
      const { booking_items, contact_log, delivery, booking_payments, clientId, ...otherData } = data;
      delete (otherData as any).discountAmount;
      delete (otherData as any).finalAmount;

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

      // if item is marked NOT REPAIRED then its payable amount will not be charged
      itemsToUpdate.filter((item) => item.status === booking_item_status.NOT_REPAIRED).map((item) => (item.payableAmount = 0));

      // for future, if need be: keep record payable amount of item but total payable amount 0 if NOT_REPAIRED
      // if (booking_items && booking_items.length > 0) {
      //   // Calculate new total by combining existing items with updates and new items
      //   const existingItems = record.booking_items;
      //   const existingItemsMap = new Map(existingItems.map(item => [item.id, item]))
      //   // Create a map of updated amounts
      //   // const updatedAmountsMap = new Map(
      //   //   itemsToUpdate.filter((item) => item.payableAmount !== undefined).map((item) => [item.id, item.payableAmount!])
      //   // );
      //   const updatedAmountsMap = new Map(
      //     itemsToUpdate.map(item => [item.id, item.payableAmount= item.payableAmount !== undefined ? item.payableAmount : existingItemsMap.get(item.id)?.payableAmount])
      //   );
      //   const updatedStatusMap = new Map(
      //     itemsToUpdate.map(item => [item.id, item.status= item.status !== undefined ? item.status : existingItemsMap.get(item.id)?.status])
      //   );
      //   // Calculate total from existing items (with updates applied)
      //   let totalPayableAmount = existingItems.reduce((total, item) => {
      //     const updatedStatus = updatedStatusMap.get(item.id)
      //     const updatedAmount = updatedStatus === booking_item_status.NOT_REPAIRED ? 0 : updatedAmountsMap.get(item.id);
      //     // return total +
      //     return total + ((updatedAmount !== undefined )? updatedAmount : (item.status === booking_item_status.NOT_REPAIRED ? 0 :item.payableAmount));
      //   }, 0);

      //   // Add amounts from newly created items
      //   totalPayableAmount += itemsToCreate.filter(item=> item.status !== booking_item_status.NOT_REPAIRED).reduce((total, item) => total + item.payableAmount, 0);

      //   calculatedPayableAmount = totalPayableAmount;
      // } else {
      //   // If no booking items changes, use existing payableAmount for payment status calculation
      //   calculatedPayableAmount = record.payableAmount ?? undefined;
      // }
      // Recalculate payableAmount, discountAmount, and finalAmount if booking items were added or updated
      let calculatedPayableAmount: number | undefined;
      let calculatedDiscountAmount: number | undefined;
      let calculatedFinalAmount: number | undefined;

      if (booking_items && booking_items.length > 0) {
        // Calculate new total by combining existing items with updates and new items
        const existingItems = record.booking_items;

        // Create a map of updated amounts
        const updatedAmountsMap = new Map(
          itemsToUpdate
            .filter((item) => item.payableAmount !== undefined || item.discountAmount !== undefined)
            .map((item) => [
              item.id,
              {
                payableAmount: item.payableAmount,
                discountAmount: item.discountAmount,
              },
            ])
        );

        // Calculate total payableAmount from existing items (with updates applied)
        // payableAmount = sum of item.payableAmount WITHOUT discounts
        let totalPayableAmount = existingItems.reduce((total, item) => {
          const updatedAmount = updatedAmountsMap.get(item.id);
          const itemPayableAmount = updatedAmount?.payableAmount !== undefined ? updatedAmount.payableAmount : item.payableAmount;
          return total + itemPayableAmount;
        }, 0);

        // Calculate total discount from existing items (with updates applied)
        let totalDiscountAmount = existingItems.reduce((total, item) => {
          const updatedAmount = updatedAmountsMap.get(item.id);
          const itemDiscount = updatedAmount?.discountAmount !== undefined ? updatedAmount.discountAmount : item.discountAmount ?? 0;
          return total + itemDiscount;
        }, 0);

        // Add amounts from newly created items
        totalPayableAmount += itemsToCreate.reduce((total, item) => total + (item.payableAmount ?? 0), 0);
        totalDiscountAmount += itemsToCreate.reduce((total, item) => total + (item.discountAmount ?? 0), 0);

        // Set calculated values
        calculatedPayableAmount = totalPayableAmount;
        calculatedDiscountAmount = totalDiscountAmount;
        calculatedFinalAmount = totalPayableAmount - totalDiscountAmount;

        // Validation: finalAmount cannot be negative
        if (calculatedFinalAmount < 0) {
          throw new Error("Total discount cannot exceed total payable amount");
        }
      } else {
        // If no booking items changes, use existing amounts
        calculatedPayableAmount = record.payableAmount ?? undefined;
        calculatedDiscountAmount = record.discountAmount ?? undefined;
        // Calculate finalAmount from existing values if not present
        if (calculatedPayableAmount !== undefined && calculatedDiscountAmount !== undefined) {
          calculatedFinalAmount = calculatedPayableAmount - calculatedDiscountAmount;
        }
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

      // Calculate payment status based on finalAmount (after discounts) not payableAmount
      let bookingPaymentStatus: booking_payment_status | undefined;

      if (totalPaidAmount !== undefined && calculatedFinalAmount !== undefined) {
        if (calculatedFinalAmount === 0) {
          bookingPaymentStatus = booking_payment_status.NOT_APPLICABLE;
        } else if (totalPaidAmount === 0) {
          bookingPaymentStatus = booking_payment_status.PENDING;
        } else if (totalPaidAmount >= calculatedFinalAmount) {
          bookingPaymentStatus = booking_payment_status.PAID;
        } else if (totalPaidAmount > 0 && totalPaidAmount < calculatedFinalAmount) {
          bookingPaymentStatus = booking_payment_status.PARTIAL_PAID;
        }
      }

      const updateData: Prisma.bookingUpdateInput = {
        ...otherData,
        ...(data.locationId && { location: { connect: { id: data.locationId } } }),
        // Handle client connection based on clientType change or clientId update
        ...(data.clientType === client_type.CORPORATE && clientId && { client: { connect: { id: clientId } } }),
        ...(data.clientType === client_type.INDIVIDUAL && record.clientType === client_type.CORPORATE && { client: { disconnect: true } }),
        // Handle clientId update for existing CORPORATE bookings (changing client without changing type)
        ...(clientId &&
          record.clientType === client_type.CORPORATE &&
          record.clientId !== clientId &&
          !data.clientType && { client: { connect: { id: clientId } } }),
        modifiedByUser: { connect: { id: modifiedBy } },
        ...(calculatedPayableAmount !== undefined && { payableAmount: calculatedPayableAmount }),
        ...(calculatedDiscountAmount !== undefined && { discountAmount: calculatedDiscountAmount }),
        ...(calculatedFinalAmount !== undefined && { finalAmount: calculatedFinalAmount }),
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

    // Update client financials when clientId is involved
    const newClientId = result.clientId;

    // If clientId was changed (either by direct update or by type conversion)
    if (oldClientId !== newClientId) {
      // Update old client's financials if it existed
      if (oldClientId) {
        await clientDao.updateClientFinancials(prisma, oldClientId);
      }
      // Update new client's financials if it exists
      if (newClientId) {
        await clientDao.updateClientFinancials(prisma, newClientId);
      }
    } else if (newClientId) {
      // If clientId didn't change but booking is still linked to a client, update its financials
      // (in case payable/paid amounts changed)
      await clientDao.updateClientFinancials(prisma, newClientId);
    }

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

const reopenBooking = async (id: number, modifiedBy: number) => {
  try {
    const booking = await bookingDao.getBooking(prisma, id);

    if (!booking) {
      throw new Error(`Booking not found against id: ${id}`);
    }

    // Validate that the booking is in EXPIRED status
    if (booking.status !== booking_status.EXPIRED) {
      throw new Error(`Only EXPIRED bookings can be reopened. Current status: ${booking.status}`);
    }

    // Update the booking status to DRAFT
    const result = await bookingDao.updateBooking(prisma, id, {
      status: booking_status.DRAFT,
      isActive: true,
      modifiedByUser: { connect: { id: modifiedBy } },
    });

    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const bookingService = { updateBooking, createBooking, getBooking, listBookings, dashboard, generateDocument, reopenBooking };
