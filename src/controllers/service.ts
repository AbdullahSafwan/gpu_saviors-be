import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { serviceService } from "../services/service";
import { CreateServiceRequest, UpdateServiceRequest } from "../types/serviceTypes";
const createService = async (req: Request<{},{}, CreateServiceRequest>, res: Response) => {
  try {
    const data = req.body;
    const result = await serviceService.createService(data);
    sendSuccessResponse(res, 200, "Successfully created service", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating service", error);
  }
};

const getServiceDetails = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await serviceService.getService(id);
    if (!result) {
      throw new Error(`service not found against id: ${id}`);
    }
    sendSuccessResponse(res, 200, "Successfully fetched service", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching service", error);
  }
};

const updateService = async (req: Request<{id: string},{}, UpdateServiceRequest>, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await serviceService.updateService(id, data);
    sendSuccessResponse(res, 200, "Successfully updating service", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updated service", error);
  }
};

export const serviceController = { createService, getServiceDetails, updateService };
