import { Request, Response } from "express";
import { systemConfigurationDao } from "../dao/systemConfiguration";
import prisma from "../prisma";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";

const createSystemConfiguration = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await systemConfigurationDao.createSystemConfiguration(prisma, data);
    sendSuccessResponse(res, 200, "Successfully created system configuration", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating system configuration", error);
  }
};

const getSystemConfigurationDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw Error("id is required");
    }
    const result = await systemConfigurationDao.getSystemConfiguration(prisma, id);
    if (!result) {
      throw new Error(`system configuration not found against id: ${id}`);
    }
    sendSuccessResponse(res, 200, "Successfully fetched system configuration", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching system configuration", error);
  }
};

const updateSystemConfiguration = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await systemConfigurationDao.updateSystemConfiguration(prisma, id, data);
    sendSuccessResponse(res, 200, "Successfully updated system configuration", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating system configuration", error);
  }
};

export const systemConfigurationController = { createSystemConfiguration, getSystemConfigurationDetails, updateSystemConfiguration };
