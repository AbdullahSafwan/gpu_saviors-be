import { Request, Response } from "express";
import { serviceDao } from "../dao/service";
import prisma from "../prisma";

const createService = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await serviceDao.createService(prisma, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getServiceDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw Error("id is required");
    }
    const result = await serviceDao.getService(prisma, id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const updateService = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await serviceDao.updateService(prisma, id, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const serviceController = { createService, getServiceDetails, updateService };
