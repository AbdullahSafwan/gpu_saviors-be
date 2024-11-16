import { Request, Response } from "express";
import { deliveryDao } from "../dao/delivery";
import prisma from "../prisma";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";

const createDelivery = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await deliveryDao.createDelivery(prisma, data);
    sendSuccessResponse(res, 200, "Successfully created delivery", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating delivery", error);
  }
};

const getDeliveryDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw Error("id is required");
    }
    const result = await deliveryDao.getDelivery(prisma, id);
    if (!result) {
      throw new Error(`delivery not found against id: ${id}`);
    }
    sendSuccessResponse(res, 200, "Successfully fetched delivery", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating delivery", error);
  }
  
};

const updateDelivery = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await deliveryDao.updateDelivery(prisma, id, data);
    sendSuccessResponse(res, 200, "Successfully updated delivery", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating delivery", error);
  }
};

export const deliveryController = { createDelivery, getDeliveryDetails, updateDelivery };
