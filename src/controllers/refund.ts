import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { refundService } from "../services/refund";
import { CreateRefundRequest,UpdateRefundRequest } from "../types/refundTypes";
import { AuthenticatedRequest } from "../middleware/auth";

const createRefund = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body as CreateRefundRequest;
    const userId = req.user.userId;
    const result = await refundService.createRefund(data, userId);
    sendSuccessResponse(res, 200, "Successfully created refund", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating refund", error);
  }
};

const getRefundDetails = async (req: Request<{id: string},{},{}> , res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
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

const updateRefund = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body as UpdateRefundRequest;
    const id = +req.params.id;
    const userId = req.user.userId;
    const result = await refundService.updateRefund(id, data, userId);
    sendSuccessResponse(res, 200, "Successfully updated refund", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating refund", error);
  }
};

export const refundController = { createRefund, getRefundDetails, updateRefund };
