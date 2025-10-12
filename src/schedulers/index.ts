import cron from "node-cron";
import { markExpiredDraftBookings } from "./bookingCleanup.scheduler";
import { systemConfigurationDao } from "../dao/systemConfiguration";
import prisma from "../prisma";

const initializeSchedulers = async () => {
  try {
    const config = await systemConfigurationDao.getSystemConfigurationByKey(prisma, "DRAFT_EXPIRY_CRON");
    const draftExpiryCron = config.value;

    // Validate cron expression
    if (!cron.validate(draftExpiryCron)) {
      throw new Error(`Invalid cron expression: ${draftExpiryCron}`);
    }

    cron.schedule(draftExpiryCron, async () => {
      try {
        console.log("[Scheduler] Running draft booking cleanup...");
        await markExpiredDraftBookings();
      } catch (error) {
        console.error("[Scheduler] Draft booking cleanup failed:", error);
      }
    });

    console.log(`[Scheduler] Initialized successfully. Draft expiry cron: ${draftExpiryCron}`);
  } catch (error) {
    console.error("[Scheduler] Error initializing schedulers:", error);
    throw error;
  }
};

export { initializeSchedulers };
