import { Request, Response } from "express";
import { bookingDao } from "../dao/booking";
import prisma from "../prisma";
// import { booking_item } from "@prisma/client";

const createBooking = async (req: Request, res: Response) => {
    try {

    const data = req.body;

    // let bookingItem: booking_item[] = []
    data.booking_item = {
      create: data.booking_item
    }
    const result = await bookingDao.createBooking (prisma, data);
    res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
}

}



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



  const updateBooking = async (req:Request, res: Response) => {
    try {
        const data = req.body
        const id =+req.params.id
        const result = await bookingDao.updateBooking(prisma,id,data);
        res.status(200).send(result);


    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  }

  export const bookingController = {createBooking,getBookingDetails,updateBooking}