import { Request, Response } from "express";
import { bookingDao } from "../dao/booking";
import prisma from "../prisma";
import { booking_item } from "@prisma/client";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";

const createBooking = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    //calculating booking payableAmount using sum of all bookingItem payableAmount
    data.payableAmount = data.booking_items.reduce((total: number, item: booking_item) => total + item.payableAmount, 0);

    // generate unique code using timestamp
    data.code = new Date().getTime().toString(36).toUpperCase();
    data.booking_items = {
      create: data.booking_items,
    };

    const result = await bookingDao.createBooking(prisma, data);
    sendSuccessResponse(res, 200, "Successfully created booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating booking", error);
  }
};

const getBookingDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await bookingDao.getBooking(prisma, id);
    if (!result) {
      throw new Error(`delivery not found against id: ${id}`);
    }
    sendSuccessResponse(res, 200, "Successfully fetched booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching booking", error);
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await bookingDao.updateBooking(prisma, id, data);
    sendSuccessResponse(res, 200, "Successfully updated booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating booking", error);
  }
};

export const bookingController = { createBooking, getBookingDetails, updateBooking };
