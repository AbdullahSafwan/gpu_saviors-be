import express from "express";
import {
  createClient,
  listClients,
  getClientDetails,
  updateClient,
  deleteClient,
  getClientBookings,
  getClientFinancialSummary,
  getClientsWithOutstandingBalance,
  getOverdueClients,
  getTopClientsByRevenue,
} from "../controllers/client";
import { clientValidator } from "../middleware/validator/clientValidator";
import { throwValidationResult } from "../services/helper";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, clientValidator.createClientValidator, throwValidationResult, createClient);

router.get("/", verifyToken, clientValidator.listClientsValidator, throwValidationResult, listClients);


router.get("/:id", verifyToken, clientValidator.getClientDetailsValidator, throwValidationResult, getClientDetails);


router.put("/:id", verifyToken, clientValidator.updateClientValidator, throwValidationResult, updateClient);


router.delete("/:id", verifyToken, clientValidator.deleteClientValidator, throwValidationResult, deleteClient);


router.get("/:id/bookings", verifyToken, clientValidator.getClientBookingsValidator, throwValidationResult, getClientBookings);


router.get("/:id/financial-summary", verifyToken, getClientFinancialSummary);


router.get("/reports/outstanding", verifyToken, getClientsWithOutstandingBalance);


router.get("/reports/overdue", verifyToken, getOverdueClients);


router.get("/reports/top-clients", verifyToken, getTopClientsByRevenue);

export default router;
