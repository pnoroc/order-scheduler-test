import {
  WorkCenterSchedule,
  WorkOrderStatus,
} from '@order-scheduler-tech-test/work-order-schedule-data-access';
import {
  BadgeConfig,
  TimelineRow,
} from '@order-scheduler-tech-test/ui-components';
import { DateTime } from 'luxon';

const STATUS_COLORS: Record<WorkOrderStatus, string> = {
  open: '#DBEAFE',
  'in-progress': '#DEE0FF',
  complete: '#D1FAB3',
  blocked: '#FFF5CF',
};

const WORK_ORDER_MAP: Record<WorkOrderStatus, BadgeConfig> = {
  open: { label: 'Open', type: 'primary' },
  'in-progress': { label: 'In Progress', type: 'info' },
  complete: { label: 'Complete', type: 'success' },
  blocked: { label: 'Blocked', type: 'warning' },
};

/**
 * Maps grouped work-center schedules to timeline rows: each center becomes a
 * lane (kept even when empty, so free capacity stays visible) and its orders
 * become the lane's items, coloured by status.
 */
export function centerSchedulesToTimelineRows(
  schedules: WorkCenterSchedule[],
): TimelineRow[] {
  return schedules.map(({ center, orders }) => ({
    id: center.docId,
    title: center.data.name,
    items: orders.map((order) => ({
      id: order.docId,
      label: order.data.name,
      startDate: DateTime.fromISO(order.data.startDate).toJSDate(),
      endDate: DateTime.fromISO(order.data.endDate).toJSDate(),
      color: STATUS_COLORS[order.data.status],
      badge: WORK_ORDER_MAP[order.data.status],
    })),
  }));
}
