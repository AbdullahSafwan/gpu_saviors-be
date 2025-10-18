import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { CreateBookingRequest, DashboardRequest, ListBookingsRequest, UpdateBookingRequest } from "../types/bookingTypes";
import { bookingService } from "../services/booking";
import { booking_status } from "@prisma/client";
const createBooking = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateBookingRequest;
    const userId = req.user.userId;

    const result = await bookingService.createBooking(data, userId);
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
    const isActive = req.query.isActive === undefined ? undefined : req.query.isActive === true;

    const result = await bookingService.listBookings(page, pageSize, sort, orderBy, status, searchString, isActive);
    sendSuccessResponse(res, 200, "Successfully fetched bookings list", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching bookings list", error);
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const data = req.body as UpdateBookingRequest;
    const userId = req.user.userId;
    
    const result = await bookingService.updateBooking(id, data, userId);
    sendSuccessResponse(res, 200, "Successfully updated booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating booking", error);
  }
};

const dashboard = async (req: Request<unknown, unknown, unknown, DashboardRequest>, res: Response) => {
  try {
    const searchString = req.query.searchString;
    const result = await bookingService.dashboard(searchString);
    sendSuccessResponse(res, 200, "Successfully fetched dashboard data", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching dashboard", error);
  }
};

const removeBooking = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    if (typeof id !== "number" || isNaN(id) || id <= 0) {
      throw new Error("Invalid booking ID");
    }
    const data = {isActive: false} as UpdateBookingRequest;
    const userId = req.user.userId;
    
    const result = await bookingService.updateBooking(id, data, userId);
    sendSuccessResponse(res, 200, "Successfully removed booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error removing booking", error);
  }
};
export const bookingController = { createBooking, getBookingDetails, updateBooking, listBookings, dashboard, removeBooking };
