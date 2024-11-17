import { Request, Response } from "express";
import { serviceDao } from "../dao/service";
import prisma from "../prisma";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";

const createService = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await serviceDao.createService(prisma, data);
    sendSuccessResponse(res, 200, "Successfully created service", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating service", error);
  }
};

const getServiceDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      return res.status(400).send("id is required");
    }
    const result = await serviceDao.getService(prisma, id);
    if (!result) {
      throw new Error(`service not found against id: ${id}`);
    }
    sendSuccessResponse(res, 200, "Successfully fetched service", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching service", error);
  }
};

const updateService = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await serviceDao.updateService(prisma, id, data);
    sendSuccessResponse(res, 200, "Successfully updating service", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updated service", error);
  }
};

export const serviceController = { createService, getServiceDetails, updateService };
