import { Request, Response } from "express";
import { system_configurationDao } from "../dao/systemConfiguration";
import prisma from "../prisma";

const createSystemConfiguration = async (req: Request, res: Response) => {
    try {

    const data = req.body;
    const result = await system_configurationDao.createSystemConfiguration (prisma, data);
    res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
}

}

const getSystemConfigurationDetails = async (req: Request, res: Response) => {
    try {
      const id = req.params.id ? +req.params?.id : null;
      if (!id) {
        throw Error("id is required");
      }
      const result = await system_configurationDao.getSystemConfiguration(prisma, id);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const updateSystemConfiguration = async (req:Request, res: Response) => {
    try {
        const data = req.body
        const id = +req.params.id
        const result = await system_configurationDao.updateSystemConfiguration (prisma,id,data);
        res.status(200).send(result);


    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  }

  export const system_configurationController = {createSystemConfiguration,getSystemConfigurationDetails ,updateSystemConfiguration }