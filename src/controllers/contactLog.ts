import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendErrorResponse, sendSuccessResponse } from "../services/responseHelper";
import { contactLogService } from "../services/contactLog";

const createContactLog = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await contactLogService.createContactLog(data)
    sendSuccessResponse(res, 200, "Successfully created contactLog", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating contact log", error);
  }
};

const getContactLogDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await contactLogService.getContactLog(id)
    sendSuccessResponse(res, 200, "Successfully fetched contactLog", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching contact log", error);
  }
};

const updateContactLog = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await contactLogService.updateContactLog(id, data)
    sendSuccessResponse(res, 200, "Successfully updated contactLog", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating contact log", error);
  }
};

export const contactLogController = { createContactLog, getContactLogDetails, updateContactLog };
