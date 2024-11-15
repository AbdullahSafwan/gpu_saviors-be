import { Request, Response } from "express";
import { deliveryDao } from "../dao/delivery";
import prisma from "../prisma";

const createDelivery = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await deliveryDao.createDelivery(prisma, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getDeliveryDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw Error("id is required");
    }
    const result = await deliveryDao.getDelivery(prisma, id);

// If no delivery is found, return 400 with an appropriate error message
    if (!result) {
      throw new Error("Delivery not found");
    }
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
  
};

const updateDelivery = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await deliveryDao.updateDelivery(prisma, id, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const deliveryController = { createDelivery, getDeliveryDetails, updateDelivery };
