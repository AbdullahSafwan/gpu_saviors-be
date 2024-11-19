import { Request, Response } from "express";
import { bookingDao } from "../dao/booking";
import prisma from "../prisma";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { CreateBookingRequest, UpdateBookingRequest } from "../types/bookingTypes";
import { Prisma } from "@prisma/client";

const createBooking = async (req: Request<{},{},CreateBookingRequest>, res: Response) => {
  try {
    const data = req.body;
    //calculating booking payableAmount using sum of all bookingItem payableAmount
    data.payableAmount = data.booking_items.reduce((total: number, item) => total + item.payableAmount, 0);

    // generate unique code using timestamp
    data.code = new Date().getTime().toString(36).toUpperCase();
    const bookingData = {
      ...data,
      booking_items: {
        create: data.booking_items
      }
    }

    const result = await bookingDao.createBooking(prisma, bookingData);
    res.status(200).send(result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating booking", error);
  }
};

const getBookingDetails = async (req: Request<{id: number},{}, {}>, res: Response) => {
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

const updateBooking = async (req: Request<{id: number},{}, UpdateBookingRequest>, res: Response) => {
  try {
    // const data = req.body;
    const { booking_items, ...otherData } = req.body;

    const id = +req.params.id;
    const updateData: Prisma.bookingUpdateInput = {
      ...otherData,
      ...(booking_items && {
        booking_items: {
          updateMany: booking_items.map(item => ({
            where: { id: item.id },
            data: { ...item }
          }))
        }
      })
    };
    const result = await bookingDao.updateBooking(prisma, id, updateData);
    sendSuccessResponse(res, 200, "Successfully updated booking", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating booking", error);
  }
};

export const bookingController = { createBooking, getBookingDetails, updateBooking };
