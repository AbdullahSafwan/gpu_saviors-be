import { Request, Response } from "express";
import { userDao } from "../dao/user";
import { validationResult } from "express-validator";
import prisma from "../prisma";

const createUser = async (req: Request, res: Response) => {
  try {
    const valResult = validationResult(req);

    if (!valResult.isEmpty()) {
      return res.status(400).json({ errors: valResult.array() });
    }

    const data = req.body;
    const result = await userDao.createUser(prisma, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getUserDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw Error("id is required");
    }
    const result = await userDao.getUser(prisma, id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await userDao.updateUser(prisma, id, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const userController = { createUser, getUserDetails, updateUser };
