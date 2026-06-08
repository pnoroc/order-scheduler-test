import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import {
  MockErpState,
  WorkOrderChanges,
} from '../models/mock-erp-state.model';
import {
  ScheduledWorkOrder,
  WorkCenterSchedule,
} from '../models/work-center-schedule.model';
import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';
import { createInitialMockErpState } from './mock-erp-seed';
import {
  addOrderToState,
  applyOrderChanges,
  groupSchedulesInPeriod,
  OrderNotFoundError,
  OrderOverlapError,
  orderToRange,
  ordersForCenter,
  rangeOverlapsAny,
  removeOrderFromState,
  replaceOrderInState,
} from './work-order.helpers';

/**
 * In-memory mock of the ERP backend.
 *
 * All data lives in a single {@link BehaviorSubject} (`state$`) which is the one
 * source of truth; every method derives from it (reads) or pushes a new
 * immutable snapshot to it (writes). Helpers in `work-order.helpers.ts` are pure
 * so the business rules (overlap, grouping) are testable in isolation and the
 * service stays a thin reactive shell — swap `state$` for HTTP calls later and
 * the public API is unchanged.
 *
 * Dates use Luxon `DateTime` to stay consistent with the rest of the codebase
 * and the existing callers (the timeline component passes `DateTime`).
 */
@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  private readonly state$ = new BehaviorSubject<MockErpState>(
    createInitialMockErpState(),
  );

  /** Live stream of all work centers. */
  getCenters(): Observable<WorkCenterDocument[]> {
    return this.state$.pipe(
      map((state) => state.centers),
      take(1),
    );
  }

  /** Live stream of all work orders. */
  getOrders(): Observable<WorkOrderDocument[]> {
    return this.state$.pipe(
      map((state) => state.orders),
      take(1),
    );
  }

  /**
   * Backwards-compatible alias for {@link getSchedulesInPeriod}.
   * Retained so existing callers keep working unchanged.
   */
  getAllSchedulesInPeriod(
    start: DateTime,
    end: DateTime,
  ): Observable<WorkCenterSchedule[]> {
    return this.getSchedulesInPeriod(start, end);
  }

  /**
   * Centers with their in-period orders, derived from `state$`.
   *
   * Reactive by design: re-emits whenever the state changes (e.g. after an
   * add/update/delete), so views that stay subscribed update automatically.
   */
  getSchedulesInPeriod(
    start: DateTime,
    end: DateTime,
  ): Observable<WorkCenterSchedule[]> {
    const rangeStart = start.startOf('day').toMillis();
    const rangeEnd = end.endOf('day').toMillis();

    return this.state$.pipe(
      map((state) =>
        groupSchedulesInPeriod(
          state.centers,
          state.orders,
          rangeStart,
          rangeEnd,
        ),
      ),
    );
  }

  /** Flat read model: each in-period order paired with its resolved center. */
  getOrdersInPeriod(
    start: DateTime,
    end: DateTime,
  ): Observable<ScheduledWorkOrder[]> {
    const rangeStart = start.startOf('day').toMillis();
    const rangeEnd = end.endOf('day').toMillis();

    return this.state$.pipe(
      map((state) => {
        const centerById = new Map(
          state.centers.map((center) => [center.docId, center]),
        );

        return state.orders
          .map<ScheduledWorkOrder | null>((order) => {
            const { start: s, end: e } = orderToRange(order);
            if (s > rangeEnd || e < rangeStart) {
              return null;
            }
            const center = centerById.get(order.data.workCenterId);
            return center ? { order, center } : null;
          })
          .filter((entry): entry is ScheduledWorkOrder => entry !== null);
      }),
    );
  }

  /**
   * Is `[start, end)` free of any existing order in the given center?
   *
   * `true` when the range overlaps nothing; touching boundaries are allowed.
   */
  canScheduleOrder(
    centerId: string,
    start: DateTime,
    end: DateTime,
  ): Observable<boolean> {
    const range = { start: start.toMillis(), end: end.toMillis() };

    return this.state$.pipe(
      take(1),
      map(
        (state) =>
          !rangeOverlapsAny(range, ordersForCenter(state.orders, centerId)),
      ),
    );
  }

  /**
   * Add `order` to `centerId`. Errors with {@link OrderOverlapError} when the
   * order conflicts with an existing one in the same center. The order's
   * `workCenterId` is pinned to `centerId`.
   */
  addOrder(centerId: string, order: WorkOrderDocument): Observable<void> {
    return this.state$.pipe(
      take(1),
      map((state) => {
        const candidate = applyOrderChanges(order, {}, centerId);

        if (
          rangeOverlapsAny(
            orderToRange(candidate),
            ordersForCenter(state.orders, centerId),
          )
        ) {
          throw new OrderOverlapError(centerId);
        }

        return addOrderToState(state, candidate);
      }),
      tap((next) => this.state$.next(next)),
      map(() => void 0),
    );
  }

  /**
   * Apply `changes` to an existing order, immutably. Errors with
   * {@link OrderNotFoundError} if absent, or {@link OrderOverlapError} if the
   * updated schedule conflicts with another order in the same center (the
   * edited order is excluded from its own check).
   */
  updateOrder(
    centerId: string,
    orderId: string,
    changes: WorkOrderChanges,
  ): Observable<void> {
    return this.state$.pipe(
      take(1),
      map((state) => {
        const target = state.orders.find(
          (order) =>
            order.docId === orderId && order.data.workCenterId === centerId,
        );

        if (!target) {
          throw new OrderNotFoundError(centerId, orderId);
        }

        const updated = applyOrderChanges(target, changes, centerId);

        if (
          rangeOverlapsAny(
            orderToRange(updated),
            ordersForCenter(state.orders, centerId),
            orderId,
          )
        ) {
          throw new OrderOverlapError(centerId);
        }

        return replaceOrderInState(state, updated);
      }),
      tap((next) => this.state$.next(next)),
      map(() => void 0),
    );
  }

  /** Remove the order matching both `centerId` and `orderId`. */
  deleteOrder(centerId: string, orderId: string): Observable<void> {
    return this.state$.pipe(
      take(1),
      map((state) => removeOrderFromState(state, centerId, orderId)),
      tap((next) => this.state$.next(next)),
      map(() => void 0),
    );
  }
}
