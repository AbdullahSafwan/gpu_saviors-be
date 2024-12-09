import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { CreateBookingRequest, UpdateBookingRequest } from "../types/bookingTypes";
import { bookingService } from "../services/booking";

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

const listBookings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 11;
    const sort = req.query.sortBy ? req.query.sortBy.toString() : null;
    const orderBy = req.query.orderBy ? req.query.orderBy.toString() : undefined;
    if (orderBy !== "asc" && orderBy !== "desc" && orderBy !== null) {
      throw Error("orderBy should be asc or desc");
    }
    const result = await bookingService.listBookings(page, pageSize, sort, orderBy);
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

export const bookingController = { createBooking, getBookingDetails, updateBooking, listBookings };
