import { service_charge_type } from "@prisma/client";
import { chargeDao } from "../../dao/charge";
import prisma from "../../prisma";
import { debugLog } from "../helper";
import { CreateChargeRequest } from "../../types/chargeTypes";

const createCharge = async (data: CreateChargeRequest, userId: number) => {
  try {
    const charge = await chargeDao.createCharge(prisma, {
      productName: data.productName,
      type: data.type,
      amount: data.amount,
      description: data.description,
      ...(data.effectiveFrom && { effectiveFrom: new Date(data.effectiveFrom) }),
      createdByUser: { connect: { id: userId } },
      modifiedByUser: { connect: { id: userId } },
    });
    return charge;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const listCurrentCharges = async (filters: { type?: service_charge_type; productName?: string }) => {
  try {
    return await chargeDao.listCurrentCharges(prisma, filters);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const listChargeHistory = async (filters: { productName?: string; type?: service_charge_type }) => {
  try {
    return await chargeDao.listChargeHistory(prisma, filters);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

const deleteCharge = async (id: number) => {
  try {
    const existing = await chargeDao.getChargeById(prisma, id);
    if (!existing) {
      throw new Error(`Service charge with id ${id} not found`);
    }

    return await chargeDao.softDeleteCharge(prisma, id);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export const chargeService = {
  createCharge,
  listCurrentCharges,
  listChargeHistory,
  deleteCharge,
};
