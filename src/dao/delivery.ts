import { Prisma, PrismaClient } from "@prisma/client";
import { debugLog } from "../services/helper";

const createDelivery = async (prisma: PrismaClient, data: Prisma.deliveryCreateInput) => {
  try {
    const result = await prisma.delivery.create({
      //orm object relation model
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const getDelivery = async (prisma: PrismaClient, id: number) => {
  try {
    const result = await prisma.delivery.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const updateDelivery = async (prisma: PrismaClient, id: number, data: Prisma.deliveryUpdateInput) => {
  try {
    const result = await prisma.delivery.update({
      where: { id },
      data,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const checkDeliveryExists = async (prisma: PrismaClient, id: number) => {
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id },
    });
    if (!delivery) {
      throw new Error("Delivery not found");
    }
    return true;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
export const deliveryDao = { createDelivery, getDelivery, updateDelivery, checkDeliveryExists };
