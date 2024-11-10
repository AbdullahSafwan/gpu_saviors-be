import { Request, Response } from "express";

const getController = async (req: Request, res: Response) => {
  res.status(200).send("test");
};

export { getController };
