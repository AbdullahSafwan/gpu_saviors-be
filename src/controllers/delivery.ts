import { Request, Response } from "express";
import { CreateDeliveryRequest, UpdateDeliveryRequest } from "../types/deliveryTypes";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { deliveryService } from "../services/delivery";
import { AuthenticatedRequest } from "../middleware/auth";

const createDelivery = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body as CreateDeliveryRequest;
    const userId = req.user.userId;

    const result = await deliveryService.createDelivery(data, userId);
    sendSuccessResponse(res, 200, "Successfully created delivery", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating delivery", error);
  }
};

const getDeliveryDetails = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await deliveryService.getDelivery(id);
    sendSuccessResponse(res, 200, "Successfully fetched delivery", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching delivery", error);
  }
};

const updateDelivery = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body as UpdateDeliveryRequest;
    const id = +req.params.id;
    const userId = req.user.userId;
    const result = await deliveryService.updateDelivery(id, data, userId);
    sendSuccessResponse(res, 200, "Successfully updated delivery", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating delivery", error);
  }
};

export const deliveryController = { createDelivery, getDeliveryDetails, updateDelivery };
