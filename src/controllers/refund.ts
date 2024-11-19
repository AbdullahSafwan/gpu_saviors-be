import { Request, Response } from "express";
import { refundDao } from "../dao/refund";
import prisma from "../prisma";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";

const createRefund = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await refundDao.createRefund(prisma, data);
    sendSuccessResponse(res, 200, "Successfully created refund", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating refund", error);
  }
};

const getRefundDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await refundDao.getRefund(prisma, id);
    if (!result) {
      throw new Error(`refund not found against id: ${id}`);
    }
    sendSuccessResponse(res, 200, "Successfully fetched refund", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching refund", error);
  }
};

const updateRefund = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await refundDao.updateRefund(prisma, id, data);
    sendSuccessResponse(res, 200, "Successfully updated refund", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating refund", error);
  }
};

export const refundController = { createRefund, getRefundDetails, updateRefund };
