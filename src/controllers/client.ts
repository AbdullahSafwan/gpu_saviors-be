import { Request, Response } from "express";
import { clientService } from "../services/client";
import { sendErrorResponse, sendSuccessResponse } from "../services/responseHelper";
import { CreateClientRequest, UpdateClientRequest, ListClientsRequest } from "../types/clientTypes";

export const createClient = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateClientRequest;
    const userId = (req as any).user?.userId || 1;

    const client = await clientService.createClient(data, userId);

    return sendSuccessResponse(res, 201, "Client created successfully", client);
  } catch (error: any) {
    return sendErrorResponse(res, 500, error.message || "Failed to create client");
  }
};

export const listClients = async (req: Request, res: Response) => {
  try {
    const filters = req.query as unknown as ListClientsRequest;

    const result = await clientService.listClients(filters);

    return sendSuccessResponse(res, 200, "Clients fetched successfully", { clients: result.clients, pagination: result.pagination });
  } catch (error: any) {
    return sendErrorResponse(res, 500, error.message || "Failed to fetch clients");
  }
};

export const getClientDetails = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);

    const client = await clientService.getClientDetails(id);

    return sendSuccessResponse(res, 200, "Client details fetched successfully", client);
  } catch (error: any) {
    const statusCode = error.message === "Client not found" ? 404 : 500;
    return sendErrorResponse(res, statusCode, error.message || "Failed to fetch client details");
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body as UpdateClientRequest;
    const userId = (req as any).user?.userId || 1;

    const client = await clientService.updateClient(id, data, userId);

    return sendSuccessResponse(res, 200, "Client updated successfully", client);
  } catch (error: any) {
    const statusCode = error.message === "Client not found" ? 404 : 500;
    return sendErrorResponse(res, statusCode, error.message || "Failed to update client");
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);

    await clientService.deleteClient(id);

    return sendSuccessResponse(res, 200, "Client deleted successfully", {});
  } catch (error: any) {
    const statusCode = error.message === "Client not found" ? 404 : error.message.includes("Cannot delete client") ? 400 : 500;
    return sendErrorResponse(res, statusCode, error.message || "Failed to delete client");
  }
};

export const getClientBookings = async (req: Request, res: Response) => {
  try {
    const clientId = parseInt(req.params.id);
    const filters = {
      clientId,
      page: req.query.page as string,
      pageSize: req.query.pageSize as string,
      status: req.query.status as string,
    };

    const data = await clientService.getClientBookings(clientId, filters);

    return sendSuccessResponse(res, 200, "Client bookings fetched successfully", data);
  } catch (error: any) {
    const statusCode = error.message === "Client not found" ? 404 : 500;
    return sendErrorResponse(res, statusCode, error.message || "Failed to fetch client bookings");
  }
};

export const getClientFinancialSummary = async (req: Request, res: Response) => {
  try {
    const clientId = parseInt(req.params.id);

    const data = await clientService.getClientFinancialSummary(clientId);

    return sendSuccessResponse(res, 200, "Client financial summary fetched successfully", data);
  } catch (error: any) {
    const statusCode = error.message === "Client not found" ? 404 : 500;
    return sendErrorResponse(res, statusCode, error.message || "Failed to fetch client financial summary");
  }
};

export const getClientsWithOutstandingBalance = async (_req: Request, res: Response) => {
  try {
    const clients = await clientService.getClientsWithOutstandingBalance();

    return sendSuccessResponse(res, 200, "Clients with outstanding balance fetched successfully", clients);
  } catch (error: any) {
    return sendErrorResponse(res, 500, error.message || "Failed to fetch clients with outstanding balance");
  }
};

export const getOverdueClients = async (_req: Request, res: Response) => {
  try {
    const clients = await clientService.getOverdueClients();

    return sendSuccessResponse(res, 200, "Overdue clients fetched successfully", clients);
  } catch (error: any) {
    return sendErrorResponse(res, 500, error.message || "Failed to fetch overdue clients");
  }
};

export const getTopClientsByRevenue = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const clients = await clientService.getTopClientsByRevenue(limit);

    return sendSuccessResponse(res, 200, "Top clients by revenue fetched successfully", clients);
  } catch (error: any) {
    return sendErrorResponse(res, 500, error.message || "Failed to fetch top clients by revenue");
  }
};
