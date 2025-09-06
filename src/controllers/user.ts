import { Request, Response } from "express";
import { CreateUserRequest, UpdateUserRequest } from "../types/userTypes";
import { debugLog } from "../services/helper";
import { sendErrorResponse, sendSuccessResponse } from "../services/responseHelper";
import { userService } from "../services/user";
const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateUserRequest;
    const userId = req.user.userId;
    const result = await userService.createUser(data, userId);
    sendSuccessResponse(res, 200, "Successfully created user", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating user", error);
  }
};

const getUserDetails = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw new Error("id is required");
    }
    const result = await userService.getUser(id);
    sendSuccessResponse(res, 200, "Successfully fetched user", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching user", error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const data = req.body as UpdateUserRequest;
    const id = +req.params.id;
    const userId = req.user.userId;
    const result = await userService.updateUser(id, data, userId);
    sendSuccessResponse(res, 200, "Successfully updated user", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error updating user", error);
  }
};

export const userController = { createUser, getUserDetails, updateUser };
