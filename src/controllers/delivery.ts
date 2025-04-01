import { Request, Response } from "express";
import { CreateDeliveryRequest, UpdateDeliveryRequest } from "../types/deliveryTypes";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { deliveryService } from "../services/delivery";

const createDelivery = async (req: Request<{}, {}, CreateDeliveryRequest>, res: Response) => {
  try {
    const data = req.body;

    const result = await deliveryService.createDelivery(data);
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

const updateDelivery = async (req: Request<{ id: string }, {}, UpdateDeliveryRequest>, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await deliveryService.updateDelivery(id, data);
    sendSuccessResponse(res, 200, "Successfully updated delivery", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating delivery", error);
  }
};

export const deliveryController = { createDelivery, getDeliveryDetails, updateDelivery };
