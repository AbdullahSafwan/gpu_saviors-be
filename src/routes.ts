import express from "express";
import userRoutes from "./routes/user";
import bookingRoutes from "./routes/booking";
import authRoutes from "./routes/auth";
import serviceRoutes from "./routes/service";
import deliveryRoutes from "./routes/delivery";
import refundRoutes from "./routes/refund";
import contactLogRoutes from "./routes/contactLog";
import warrantyClaimRoutes from "./routes/warrantyClaim";
import expenseEntryRoutes from "./routes/expenseEntry";
import locationRoutes from "./routes/location";
import analyticsRoutes from "./routes/analytics";
import dashboardRoutes from "./routes/dashboard";
import clientRoutes from "./routes/client";

const router = express.Router();

// Module routes
router.use("/user", userRoutes);
router.use("/booking", bookingRoutes);
router.use("/auth", authRoutes);
router.use("/service", serviceRoutes);
router.use("/delivery", deliveryRoutes);
router.use("/refund", refundRoutes);
router.use("/contactLog", contactLogRoutes);
router.use("/warrantyClaim", warrantyClaimRoutes);
router.use("/expense-entry", expenseEntryRoutes);
router.use("/locations", locationRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/clients", clientRoutes);

export default router;
