import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { CreateBookingRequest, ListBookingsRequest, UpdateBookingRequest } from "../types/bookingTypes";
import { bookingService } from "../services/booking";
import { booking_status } from "@prisma/client";

const createBooking = async (req: Request<{}, {}, CreateBookingRequest>, res: Response) => {
  try {
    const data = req.body;

    const result = await bookingService.createBooking(data);
    sendSuccessResponse(res, 200, "Successfully created booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating booking", error);
  }
};

const getBookingDetails = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await bookingService.getBooking(id);
    sendSuccessResponse(res, 200, "Successfully fetched booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching booking", error);
  }
};

const listBookings = async (req: Request<unknown, unknown, unknown, ListBookingsRequest>, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const sort = req.query.sortBy ? req.query.sortBy.toString() : null;
    const orderBy = req.query.orderBy ? req.query.orderBy.toString() : "desc";
    const status = req.query.status ? (req.query.status.toString() as booking_status) : undefined;
    const searchString = req.query.searchString;

    const result = await bookingService.listBookings(page, pageSize, sort, orderBy, status, searchString);
    sendSuccessResponse(res, 200, "Successfully fetched bookings list", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching bookings list", error);
  }
};

const updateBooking = async (req: Request<{ id: string }, {}, UpdateBookingRequest>, res: Response) => {
  try {
    const id = +req.params.id;
    const data = req.body;
    const result = await bookingService.updateBooking(id, data);
    sendSuccessResponse(res, 200, "Successfully updated booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating booking", error);
  }
};

const dashboard = async (req: Request, res: Response) => {
  try {
    console.log(req);
    const result = await bookingService.dashboard();
    sendSuccessResponse(res, 200, "Successfully updated booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching dashboard", error);
  }
};
export const bookingController = { createBooking, getBookingDetails, updateBooking, listBookings, dashboard };
