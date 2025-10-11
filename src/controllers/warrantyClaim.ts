import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { warrantyClaimService } from "../services/warrantyClaim";
import { CreateWarrantyClaimRequest, ListWarrantyClaimsRequest } from "../types/warrantyClaimTypes";

const createWarrantyClaim = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateWarrantyClaimRequest;
    const userId = req.user.userId;

    const result = await warrantyClaimService.createWarrantyClaim(data, userId);
    sendSuccessResponse(res, 201, "Successfully created warranty claim", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error creating warranty claim", error);
  }
};

const getWarrantyClaimById = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      throw new Error("Valid warranty claim ID is required");
    }

    const result = await warrantyClaimService.getWarrantyClaim(id);
    sendSuccessResponse(res, 200, "Successfully fetched warranty claim", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching warranty claim", error);
  }
};

const getWarrantyClaimByClaimNumber = async (
  req: Request<{ claimNumber: string }, {}, {}>,
  res: Response
) => {
  try {
    const claimNumber = req.params.claimNumber;
    if (!claimNumber) {
      throw new Error("Claim number is required");
    }

    const result = await warrantyClaimService.getWarrantyClaimByClaimNumber(claimNumber);
    sendSuccessResponse(res, 200, "Successfully fetched warranty claim", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching warranty claim", error);
  }
};

const listWarrantyClaims = async (
  req: Request<unknown, unknown, unknown, ListWarrantyClaimsRequest>,
  res: Response
) => {
  try {
    const params: ListWarrantyClaimsRequest = {
      page: req.query.page,
      pageSize: req.query.pageSize,
      searchString: req.query.searchString,
      sortBy: req.query.sortBy,
      orderBy: req.query.orderBy,
    };

    const result = await warrantyClaimService.listWarrantyClaims(params);
    sendSuccessResponse(res, 200, "Successfully fetched warranty claims list", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error fetching warranty claims list", error);
  }
};

export const warrantyClaimController = {
  createWarrantyClaim,
  getWarrantyClaimById,
  getWarrantyClaimByClaimNumber,
  listWarrantyClaims,
};
