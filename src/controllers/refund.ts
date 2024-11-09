import { Request, Response } from "express";
import { refundDao } from "../dao/refund";
import prisma from "../prisma";

const createRefund = async (req: Request, res: Response) => {
    try {

    const data = req.body;
    const result = await refundDao.createRefund (prisma, data);
    res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
}

}

const getRefundDetails = async (req: Request, res: Response) => {
    try {
      const id = req.params.id ? +req.params?.id : null;
      if (!id) {
        throw Error("id is required");
      }
      const result = await refundDao.getRefund (prisma, id);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const updateRefund = async (req:Request, res: Response) => {
    try {
        const data = req.body
        const id = +req.params.id
        const result = await refundDao.updateRefund (prisma,id,data);
        res.status(200).send(result);


    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  }

  export const refundController = {createRefund,getRefundDetails,updateRefund }