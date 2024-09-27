import { Request, Response } from "express";
import { userDao } from "../dao/user";
import { validationResult } from "express-validator";

const createUser = async (req: Request, res: Response) => {
  try {
    const valResult = validationResult(req);
    console.log(valResult);
    if (!valResult.isEmpty()){
        res.send({errors : valResult.array()});
    }
    const data = req.body;
    const result = await userDao.createUser(data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const userController = { createUser };
