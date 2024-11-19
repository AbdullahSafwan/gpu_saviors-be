import { Request, Response } from "express";
import { userDao } from "../dao/user";
import prisma from "../prisma";
import { debugLog } from "../services/helper";
import { sendErrorResponse, sendSuccessResponse } from "../services/responseHelper";

const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await userDao.createUser(prisma, data);
    sendSuccessResponse(res, 200, "Successfully created user", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating user", error);
  }
};

const getUserDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await userDao.getUser(prisma, id);
    if (!result) {
      throw new Error(`user not found against id: ${id}`);
    }
    sendSuccessResponse(res, 200, "Successfully fetched user", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching user", error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await userDao.updateUser(prisma, id, data);
    sendSuccessResponse(res, 200, "Successfully updated user", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating user", error);
  }
};

export const userController = { createUser, getUserDetails, updateUser };
