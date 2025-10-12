import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { locationService } from "../services/location";
import prisma from "../prisma";

const fetchActiveLocations = async (_req: Request, res: Response) => {
  try {
    const result = await locationService.getActiveLocations(prisma);
    sendSuccessResponse(res, 200, "Successfully created system configuration", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating system configuration", error);
  }
};

export const locationController = { fetchActiveLocations };
