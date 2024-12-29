import { booking_status } from "@prisma/client";

const allowedTransitions: Record<string, string[]> = {
  DRAFT: [booking_status.IN_REVIEW],
  IN_REVIEW: [booking_status.CONFIRMED],
  CONFIRMED: [booking_status.PENDING_DELIVERY],
  PENDING_DELIVERY: [booking_status.IN_QUEUE],
  IN_QUEUE: [booking_status.IN_PROGRESS],
  IN_PROGRESS: [booking_status.RESOLVED, booking_status.REJECTED],
  RESOLVED: [booking_status.PENDING_PAYMENT],
  PENDING_PAYMENT: [booking_status.PENDING_DELIVERY],
  REJECTED: [booking_status.PENDING_DELIVERY],
  OUTBOUND_DELIVERY: [booking_status.CONFIRMED],
  COMPLETED: [],
};

export const validateStatusTransition = (currentStatus: string, newStatus: string): boolean => {
  return allowedTransitions[currentStatus]?.includes(newStatus);
};
