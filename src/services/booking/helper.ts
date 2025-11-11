import { booking_item_status, booking_status, Prisma } from "@prisma/client";
import { debugLog } from "../helper";
import { UpdateBookingItem, UpdateBookingRequest } from "../../types/bookingTypes";

// Workflow order: DRAFT -> CONFIRMED -> PENDING -> IN_PROGRESS -> COMPLETED
const workflowOrder: string[] = [
  booking_status.DRAFT,
  booking_status.CONFIRMED,
  booking_status.PENDING,
  booking_status.IN_PROGRESS,
  booking_status.RESOLVED,
  booking_status.COMPLETED,
];

// Forward transitions allowed from each status
const forwardTransitions: Record<string, string[]> = {
  [booking_status.DRAFT]: [booking_status.CONFIRMED, booking_status.PENDING],
  [booking_status.CONFIRMED]: [booking_status.PENDING, booking_status.IN_PROGRESS],
  [booking_status.PENDING]: [booking_status.IN_PROGRESS],
  [booking_status.IN_PROGRESS]: [booking_status.PENDING, booking_status.RESOLVED, booking_status.CANCELLED],
  [booking_status.RESOLVED]: [booking_status.COMPLETED, booking_status.CANCELLED],
};

export const validateStatusTransition = (currentStatus: string, newStatus: string): boolean => {
  // 1 same status pass
  if (currentStatus === newStatus) return true;

  // 2 cant change from terminal state
  if (currentStatus === booking_status.COMPLETED || currentStatus === booking_status.CANCELLED || currentStatus === booking_status.EXPIRED) {
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

export const validateTerminalStatus = (data: UpdateBookingRequest, record: Prisma.bookingGetPayload<{ include: { booking_items: true } }>) => {
  try {
    const terminalStatuses: booking_item_status[] = [booking_item_status.REPAIRED, booking_item_status.NOT_REPAIRED];

    // create a map of incoming booking items for quick lookup
    const incomingUpdates = data.booking_items?.filter((item): item is UpdateBookingItem => "id" in item && !!item.id) || [];

    const incomingItemsMap = new Map(incomingUpdates.map((item) => [item.id, item]));

    // Check if all items will be in terminal state after applying updates
    const allItemsInTerminalState = record.booking_items.every((item: any) => {
      // If there's an update for this item with a new status, check the new status
      const incomingItem = incomingItemsMap.get(item.id);
      const finalStatus = incomingItem?.status ?? item.status;
      return terminalStatuses.includes(finalStatus);
    });
    return allItemsInTerminalState;
  } catch (error) {
    debugLog("Error checking terminal status:", error);
    throw error;
  }
};
