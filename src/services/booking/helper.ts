import { booking_status } from "@prisma/client";

const forwardTransitions: Record<string, string[]> = {
  [booking_status.DRAFT]: [booking_status.IN_REVIEW, booking_status.CONFIRMED],
  [booking_status.IN_REVIEW]: [booking_status.CONFIRMED],
  [booking_status.CONFIRMED]: [booking_status.PENDING_DELIVERY, booking_status.IN_PROGRESS],
  [booking_status.PENDING_DELIVERY]: [booking_status.IN_QUEUE],
  [booking_status.IN_QUEUE]: [booking_status.IN_PROGRESS],
  [booking_status.IN_PROGRESS]: [booking_status.RESOLVED, booking_status.REJECTED,booking_status.COMPLETED, booking_status.CANCELLED, booking_status.EXPIRED],
  [booking_status.RESOLVED]: [booking_status.PENDING_PAYMENT],
  [booking_status.PENDING_PAYMENT]: [booking_status.COMPLETED],
  [booking_status.REJECTED]: [booking_status.PENDING_DELIVERY],
};

const allStatuses = Object.values(booking_status);

// booking status transition validator, allows forward movement only as per defined transitions
// but allows backward movement to any status
export const validateStatusTransition = (currentStatus: string, newStatus: string): boolean => {
  if (currentStatus === newStatus) {
    return true;
  }

  if (forwardTransitions[currentStatus]?.includes(newStatus)) {
    return true;
  }

  return allStatuses.includes(newStatus as booking_status);
};
