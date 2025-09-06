import { userDao } from "../../dao/user";
import prisma from "../../prisma";
import { CreateUserRequest, UpdateUserRequest } from "../../types/userTypes";
import { debugLog } from "../helper";

const createUser = async (data: CreateUserRequest, createdBy?: number) => {
  try {
    const userData = {
      ...data,
      ...(createdBy && { createdBy }),
    };
    const result = await userDao.createUser(prisma, userData);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getUser = async (id: number) => {
  try {
    const result = await userDao.getUser(prisma, id);
    if (!result) {
      throw new Error(`user not found against id: ${id}`);
    }
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateUser = async (id: number, data: UpdateUserRequest, modifiedBy?: number) => {
  try {
    const record = await userDao.getUser(prisma, id);
    if (!record) {
      throw new Error(`user not found against id: ${id}`);
    }
    const userData = {
      ...data,
      ...(modifiedBy && { modifiedBy }),
    };
    const result = await userDao.updateUser(prisma, id, userData);
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const userService = { createUser, getUser, updateUser };
