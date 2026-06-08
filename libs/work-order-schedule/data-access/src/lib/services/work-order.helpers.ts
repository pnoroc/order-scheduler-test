import { DateTime } from 'luxon';
import { WorkCenterSchedule } from '../models/work-center-schedule.model';
import {
  MockErpState,
  WorkOrderChanges,
} from '../models/mock-erp-state.model';
import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';

/**
 * A half-open time interval `[start, end)` expressed in epoch milliseconds.
 *
 * Half-open is deliberate: it makes touching boundaries non-overlapping, e.g.
 * an order ending exactly when the next one starts is allowed.
 */
export interface MillisRange {
  start: number;
  end: number;
}

/** Thrown when a write would place two orders of the same center in conflict. */
export class OrderOverlapError extends Error {
  constructor(centerId: string) {
    super(`Order overlaps an existing order in center "${centerId}".`);
    this.name = 'OrderOverlapError';
  }
}

/** Thrown when an order cannot be located for the given center. */
export class OrderNotFoundError extends Error {
  constructor(centerId: string, orderId: string) {
    super(`Order "${orderId}" not found in center "${centerId}".`);
    this.name = 'OrderNotFoundError';
  }
}

/** Parse an ISO date/date-time string to epoch millis (date-only → start of day). */
export const toMillis = (iso: string): number => DateTime.fromISO(iso).toMillis();

/** Convert an order's ISO `data.startDate`/`data.endDate` into a {@link MillisRange}. */
export const orderToRange = (order: WorkOrderDocument): MillisRange => ({
  start: toMillis(order.data.startDate),
  end: toMillis(order.data.endDate),
});

/**
 * Half-open overlap test: `a.start < b.end && a.end > b.start`.
 * Returns `false` for touching boundaries (a ends exactly when b starts).
 */
export const rangesOverlap = (a: MillisRange, b: MillisRange): boolean =>
  a.start < b.end && a.end > b.start;

/** All orders assigned to a given center. */
export const ordersForCenter = (
  orders: WorkOrderDocument[],
  centerId: string,
): WorkOrderDocument[] =>
  orders.filter((order) => order.data.workCenterId === centerId);

/**
 * Does `range` collide with any order in `orders`?
 *
 * `ignoreOrderId` lets an *edit* exclude the order being changed from its own
 * conflict check.
 */
export const rangeOverlapsAny = (
  range: MillisRange,
  orders: WorkOrderDocument[],
  ignoreOrderId?: string,
): boolean =>
  orders.some(
    (order) =>
      order.docId !== ignoreOrderId && rangesOverlap(range, orderToRange(order)),
  );

/**
 * Does the order intersect the inclusive period `[rangeStart, rangeEnd]`?
 *
 * Inclusive endpoints mirror the original "any part visible in the window"
 * behaviour used to populate the timeline.
 */
export const orderIntersectsPeriod = (
  order: WorkOrderDocument,
  rangeStart: number,
  rangeEnd: number,
): boolean => {
  const { start, end } = orderToRange(order);
  return start <= rangeEnd && end >= rangeStart;
};

/**
 * Group in-period orders under their owning center.
 *
 * Centers with no in-period orders still appear with an empty list, so the
 * timeline keeps one lane per center.
 */
export const groupSchedulesInPeriod = (
  centers: WorkCenterDocument[],
  orders: WorkOrderDocument[],
  rangeStart: number,
  rangeEnd: number,
): WorkCenterSchedule[] => {
  const ordersByCenter = new Map<string, WorkOrderDocument[]>();

  for (const order of orders) {
    if (!orderIntersectsPeriod(order, rangeStart, rangeEnd)) {
      continue;
    }
    const existing = ordersByCenter.get(order.data.workCenterId) ?? [];
    ordersByCenter.set(order.data.workCenterId, [...existing, order]);
  }

  return centers.map((center) => ({
    center,
    orders: ordersByCenter.get(center.docId) ?? [],
  }));
};

/**
 * Merge a partial patch into an order, immutably, deep-merging `data`.
 * `workCenterId` is pinned to `centerId` so an edit can never silently
 * re-home an order.
 */
export const applyOrderChanges = (
  order: WorkOrderDocument,
  changes: WorkOrderChanges,
  centerId: string,
): WorkOrderDocument => ({
  ...order,
  ...changes,
  docId: order.docId,
  data: {
    ...order.data,
    ...changes.data,
    workCenterId: centerId,
  },
});

// ---------------------------------------------------------------------------
// Pure state reducers — each returns a brand-new MockErpState, never mutating.
// ---------------------------------------------------------------------------

/** Append an order to the state. */
export const addOrderToState = (
  state: MockErpState,
  order: WorkOrderDocument,
): MockErpState => ({
  ...state,
  orders: [...state.orders, order],
});

/** Replace the order sharing `docId` with `updated`. */
export const replaceOrderInState = (
  state: MockErpState,
  updated: WorkOrderDocument,
): MockErpState => ({
  ...state,
  orders: state.orders.map((order) =>
    order.docId === updated.docId ? updated : order,
  ),
});

/** Remove the order matching both `centerId` and `orderId`. */
export const removeOrderFromState = (
  state: MockErpState,
  centerId: string,
  orderId: string,
): MockErpState => ({
  ...state,
  orders: state.orders.filter(
    (order) =>
      !(order.docId === orderId && order.data.workCenterId === centerId),
  ),
});
