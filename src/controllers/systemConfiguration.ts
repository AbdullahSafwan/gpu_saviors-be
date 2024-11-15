import { Request, Response } from "express";
import { systemConfigurationDao } from "../dao/systemConfiguration";
import prisma from "../prisma";

const createSystemConfiguration = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await systemConfigurationDao.createSystemConfiguration(prisma, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getSystemConfigurationDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id ? +req.params?.id : null;
    if (!id) {
      return res.status(400).send("id is required");
    }
    const result = await systemConfigurationDao.getSystemConfiguration(prisma, id);
    if (!result) {
      return res.status(400).send("System configuration not found");
    }
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const updateSystemConfiguration = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = +req.params.id;
    const result = await systemConfigurationDao.updateSystemConfiguration(prisma, id, data);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const systemConfigurationController = { createSystemConfiguration, getSystemConfigurationDetails, updateSystemConfiguration };
