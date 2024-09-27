import { Request, Response } from "express";
// import prisma from "../prisma";
const getController = async (req: Request, res: Response) =>{
    
    res.status(200).send('test') 
}




export {getController}