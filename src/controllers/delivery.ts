import { Request, Response } from "express";
import { deliveryDao } from "../dao/delivery";
import prisma from "../prisma";
import { CreateDeliveryRequest, UpdateDeliveryRequest } from "../types/deliveryTypes";

const createDelivery = async (req: Request<{}, {}, CreateDeliveryRequest>, res: Response) => {
  try {
    const { bookingId, ...rest } = req.body; // Destructure to exclude `bookingId`

    // Construct deliveryData, converting `bookingId` to a nested connect object
    const deliveryData = {
      ...rest,
      booking: { connect: { id: bookingId } },
    };

    const result = await deliveryDao.createDelivery(prisma, deliveryData);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}; 

const getDeliveryDetails = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw Error("id is required");
    }
    const result = await deliveryDao.getDelivery(prisma, id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const updateDelivery = async (req: Request<{ id: string }, {}, UpdateDeliveryRequest>, res: Response) => {
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
