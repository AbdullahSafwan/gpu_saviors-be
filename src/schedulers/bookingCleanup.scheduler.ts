import { booking_status } from "@prisma/client";
import { bookingDao } from "../dao/booking";
import { systemConfigurationDao } from "../dao/systemConfiguration";
import prisma from "../prisma";
import { debugLog } from "../services/helper";

/**
 * Marks draft bookings as EXPIRED if they haven't been confirmed within
 * the configured threshold (DRAFT_BOOKING_EXPIRE_THRESHOLD_MINUTES).
 *
 * The threshold is retrieved from system_configuration table.
 * Example: 15 days = 21600 minutes
 */
const markExpiredDraftBookings = async () => {
  try {
    const expiryConfig = await systemConfigurationDao.getSystemConfigurationByKey(prisma, "DRAFT_BOOKING_EXPIRE_THRESHOLD_MINUTES");

    const thresholdMinutes = parseInt(expiryConfig.value);

    // Validate threshold value
    if (isNaN(thresholdMinutes) || thresholdMinutes <= 0) {
      throw new Error(`Invalid DRAFT_BOOKING_EXPIRE_THRESHOLD_MINUTES value: ${expiryConfig.value}. Must be a positive number.`);
    }

    const thresholdDate = new Date(Date.now() - thresholdMinutes * 60000);

    const result = await bookingDao.updateManyBookings(
      prisma,
      {
        status: booking_status.DRAFT,
        createdAt: { lt: thresholdDate },
        isActive: true,
      },
      {
        status: booking_status.EXPIRED,
        isActive: false
      }
    );

    console.log(
      `[Booking Cleanup] Expired ${result.count} draft bookings older than ${thresholdMinutes} minutes (${Math.round(thresholdMinutes / 1440)} days). Triggered at ${new Date().toISOString()}`
    );
  } catch (error) {
    console.error("[Booking Cleanup] Error:", error);
    debugLog(error);
    throw error;
  }
};

export { markExpiredDraftBookings };
