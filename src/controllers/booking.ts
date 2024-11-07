import { Request, Response } from "express";
import { bookingDao } from "../dao/booking";
import prisma from "../prisma";
import { booking_item } from "@prisma/client";

const createBooking = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    //calculating booking payableAmount using sum of all bookingItem payableAmount
    data.payableAmount = data.booking_items.reduce(
      (total: number, item: booking_item) => total + item.payableAmount,
      0
    );

    data.booking_items = {
      create: data.booking_items,
    };

    const result = await bookingDao.createBooking(prisma, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getBookingDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      throw Error("id is required");
    }
    const result = await bookingDao.getBooking(prisma, id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await bookingDao.updateBooking(prisma, id, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const bookingController = { createBooking, getBookingDetails, updateBooking };
