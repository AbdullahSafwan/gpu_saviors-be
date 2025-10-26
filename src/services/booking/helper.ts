import { booking_status } from "@prisma/client";

// Workflow order: DRAFT -> CONFIRMED -> PENDING -> IN_PROGRESS -> COMPLETED
const workflowOrder: string[] = [
  booking_status.DRAFT,
  booking_status.CONFIRMED,
  booking_status.PENDING,
  booking_status.IN_PROGRESS,
  booking_status.COMPLETED,
];

// Forward transitions allowed from each status
const forwardTransitions: Record<string, string[]> = {
  [booking_status.DRAFT]: [booking_status.CONFIRMED, booking_status.PENDING],
  [booking_status.CONFIRMED]: [booking_status.PENDING, booking_status.IN_PROGRESS],
  [booking_status.PENDING]: [booking_status.IN_PROGRESS],
  [booking_status.IN_PROGRESS]: [booking_status.PENDING, booking_status.COMPLETED, booking_status.CANCELLED],
};

export const validateStatusTransition = (currentStatus: string, newStatus: string): boolean => {
  // 1 same status pass
  if (currentStatus === newStatus) return true;

  // 2 cant change from terminal state
  if (
    currentStatus === booking_status.COMPLETED ||
    currentStatus === booking_status.CANCELLED ||
    currentStatus === booking_status.EXPIRED
  ) {
    return false;
  }

  // 3 can always cancel or expire (unless already in terminal state)
  if (newStatus === booking_status.CANCELLED || newStatus === booking_status.EXPIRED) {
    return true;
  }

  // 4.if forward transition then check if valid
  if (forwardTransitions[currentStatus]?.includes(newStatus)) {
    return true;
  }

  // 5. for backward transition check if valid
  const currentIndex = workflowOrder.indexOf(currentStatus);
  const newIndex = workflowOrder.indexOf(newStatus);

  return currentIndex !== -1 && newIndex !== -1 && newIndex < currentIndex;
};
