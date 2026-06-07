import { WorkCenterDocument } from './work-center.model';
import { WorkOrderDocument } from './work-order.model';

/**
 * A work center together with its in-period work orders.
 *
 * Maps 1:1 to a timeline lane: the center becomes the row, its `orders` the
 * row's items. Centers with no orders in range still appear (empty lane).
 */
export interface WorkCenterSchedule {
  center: WorkCenterDocument;
  orders: WorkOrderDocument[]; // in-period orders for THIS center
}

/**
 * A single work order paired with the work center it is assigned to.
 *
 * A flat read model for non-grouped views (e.g. an orders list with an
 * "assigned center" column), where each row already carries its center.
 */
export interface ScheduledWorkOrder {
  order: WorkOrderDocument;
  center: WorkCenterDocument;
}
