import { Request, Response } from "express";
import { contact_logDao } from "../dao/contactLog";
import prisma from "../prisma";

const createContactLog = async (req: Request, res: Response) => {
    try {

    const data = req.body;
    const result = await contact_logDao.createContactLog (prisma, data);
    res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
}

}

const getContactLogDetails = async (req: Request, res: Response) => {
    try {
      const id = req.params.id ? +req.params?.id : null;
      if (!id) {
        throw Error("id is required");
      }
      const result = await contact_logDao.getContactLog (prisma, id);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const updateContactLog = async (req:Request, res: Response) => {
    try {
        const data = req.body
        const id = +req.params.id
        const result = await contact_logDao.updateContactLog (prisma,id,data);
        res.status(200).send(result);


    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  }

  export const contact_logController = {createContactLog, getContactLogDetails, updateContactLog }