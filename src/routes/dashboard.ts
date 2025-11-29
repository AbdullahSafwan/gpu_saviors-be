import express from "express";
import { bookingController } from "../controllers/booking";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, bookingController.dashboard);

export default router;
