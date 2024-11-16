import { Request, Response } from "express";
import { contactLogDao } from "../dao/contactLog";
import prisma from "../prisma";
import { debugLog } from "../services/helper";
import { sendErrorResponse, sendSuccessResponse } from "../services/responseHelper";

const createContactLog = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await contactLogDao.createContactLog(prisma, data);
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
      throw Error("id is required");
    }
    const result = await contactLogDao.getContactLog(prisma, id);
    if (!result) {
      throw new Error(`contact log not found against id: ${id}`);
    }
    sendSuccessResponse(res, 200, "Successfully created contactLog", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching contact log", error);
  }
};

const updateContactLog = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await contactLogDao.updateContactLog(prisma, id, data);
    sendSuccessResponse(res, 200, "Successfully updated contactLog", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating contact log", error);
  }
};

export const contactLogController = { createContactLog, getContactLogDetails, updateContactLog };
