import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { refundService } from "../services/refund";
import {
  CreateRefundRequest,
  UpdateRefundRequest,
} from "../types/refundTypes";

const createRefund = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateRefundRequest;
    const userId = req.user.userId;
    const result = await refundService.createRefund(data, userId);
    if (!result) {
      throw new Error("Failed to create refund");
    }
    sendSuccessResponse(res, 200, "Successfully created refund", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating refund", error);
  }
};

const getRefund = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id ? +req.params.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await refundService.getRefund(id);
    sendSuccessResponse(res, 200, "Successfully fetched refund", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching refund", error);
  }
};

const updateRefund = async (req: Request, res: Response) => {
  try {
    const data = req.body as UpdateRefundRequest;
    const id = +req.params.id;
    const userId = req.user.userId;
    const result = await refundService.updateRefund(id, data, userId);
    if (!result) {
      throw new Error("Failed to update refund");
    }
    sendSuccessResponse(res, 200, "Successfully updated refund", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating refund", error);
  }
};

const getRefundableItems = async (req: Request<{ bookingId: string }, {}, {}>, res: Response) => {
  try {
    const bookingId = req.params.bookingId ? +req.params.bookingId : null;
    if (!bookingId) {
      throw new Error("bookingId is required");
    }
    const result = await refundService.calculateMaxRefundablePerItem(bookingId);
    sendSuccessResponse(res, 200, "Successfully fetched refundable items", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching refundable items", error);
  }
};

const getBookingRefunds = async (req: Request<{ bookingId: string }, {}, {}>, res: Response) => {
  try {
    const bookingId = req.params.bookingId ? +req.params.bookingId : null;
    if (!bookingId) {
      throw new Error("bookingId is required");
    }
    const result = await refundService.getBookingRefunds(bookingId);
    sendSuccessResponse(res, 200, "Successfully fetched booking refunds", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching booking refunds", error);
  }
};

export const refundController = {
  createRefund,
  getRefund,
  updateRefund,
  getRefundableItems,
  getBookingRefunds,
};
