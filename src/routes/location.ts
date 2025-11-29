import express from "express";
import { locationController } from "../controllers/location";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, locationController.fetchActiveLocations);

export default router;
