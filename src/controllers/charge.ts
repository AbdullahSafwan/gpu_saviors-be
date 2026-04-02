import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { chargeService } from "../services/charge";
import { CreateChargeRequest, ListChargesRequest, ListChargeHistoryRequest } from "../types/chargeTypes";
import { service_charge_type } from "@prisma/client";

const createCharge = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateChargeRequest;
    const userId = req.user.userId;

    const result = await chargeService.createCharge(data, userId);
    sendSuccessResponse(res, 200, "Successfully created service charge", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating service charge", error);
  }
};

const listCurrentCharges = async (req: Request<unknown, unknown, unknown, ListChargesRequest>, res: Response) => {
  try {
    const filters: { type?: service_charge_type; productName?: string } = {};
    if (req.query.type) filters.type = req.query.type as service_charge_type;
    if (req.query.productName) filters.productName = req.query.productName as string;

    const result = await chargeService.listCurrentCharges(filters);
    sendSuccessResponse(res, 200, "Successfully fetched current service charges", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching service charges", error);
  }
};

const listChargeHistory = async (req: Request<unknown, unknown, unknown, ListChargeHistoryRequest>, res: Response) => {
  try {
    const filters: { productName?: string; type?: service_charge_type } = {};
    if (req.query.productName) filters.productName = req.query.productName as string;
    if (req.query.type) filters.type = req.query.type as service_charge_type;

    const result = await chargeService.listChargeHistory(filters);
    sendSuccessResponse(res, 200, "Successfully fetched service charge history", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching service charge history", error);
  }
};

const deleteCharge = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id ? +req.params.id : null;
    if (!id) {
      throw new Error("id is required");
    }

    const result = await chargeService.deleteCharge(id);
    sendSuccessResponse(res, 200, "Successfully deleted service charge", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error deleting service charge", error);
  }
};

export const chargeController = {
  createCharge,
  listCurrentCharges,
  listChargeHistory,
  deleteCharge,
};
