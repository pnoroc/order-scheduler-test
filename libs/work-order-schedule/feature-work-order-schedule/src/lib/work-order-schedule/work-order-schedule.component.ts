import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActionMenuComponent,
  ActionMenuItem,
  DropdownComponent,
  DropdownItem,
  TimelineBoardComponent,
  TimelineItem,
  TimelineRow,
  ZoomLevel,
} from '@order-scheduler-tech-test/ui-components';
import {
  WorkCenterSchedule,
  WorkOrderDocument,
  WorkOrderService,
} from '@order-scheduler-tech-test/work-order-schedule-data-access';
import { DateTime } from 'luxon';
import { centerSchedulesToTimelineRows } from '@order-scheduler-tech-test/work-order-schedule-utils';
import { FeatureWorkOrderScheduleService } from '../services/feature-work-order-schedule.service';

@Component({
  selector: 'ostt-work-order-schedule',
  templateUrl: './work-order-schedule.component.html',
  styleUrl: './work-order-schedule.component.scss',
  imports: [DropdownComponent, TimelineBoardComponent, ActionMenuComponent],
})
export class WorkOrderScheduleComponent implements OnInit {
  private readonly featureWorkOrderScheduleService = inject(
    FeatureWorkOrderScheduleService,
  );
  private readonly workOrderService = inject(WorkOrderService);

  startDate = signal<Date>(DateTime.now().minus({ weeks: 2 }).toJSDate());
  endDate = signal<Date>(DateTime.now().plus({ months: 4 }).toJSDate());
  zoomLevel = signal<ZoomLevel>('day');
  dataRows = signal<TimelineRow[]>([]);

  zoomLevels: DropdownItem[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  workOrderActions: ActionMenuItem[] = [
    {
      label: 'Edit',
      action: (data) =>
        this.openScheduleForm(
          (data as WorkOrderDocument).data.workCenterId,
          data as WorkOrderDocument,
        ),
    },
    {
      label: 'Delete',
      action: (data) => this.deleteSchedule(data as WorkOrderDocument),
    },
  ];

  ngOnInit() {
    this.setInitialOrders();
  }

  setInitialOrders() {
    this.setOrdersInPeriod(
      DateTime.fromJSDate(this.startDate()),
      DateTime.fromJSDate(this.endDate()),
    );
  }

  setOrdersInPeriod(start: DateTime, end: DateTime) {
    this.workOrderService.getAllSchedulesInPeriod(start, end).subscribe({
      next: (value: WorkCenterSchedule[]) => {
        const timelineRows = centerSchedulesToTimelineRows(value);
        this.dataRows.set(timelineRows);
      },
    });
  }

  handleZoomLevelChange(item: DropdownItem) {
    this.zoomLevel.set(item.value as ZoomLevel);
  }

  handleOrderActionSelected(action: ActionMenuItem, item: TimelineItem) {
    action.action(item.entity);
  }

  openScheduleForm(centerId: string, order?: WorkOrderDocument) {
    this.featureWorkOrderScheduleService
      .showOrderForm(centerId, order)
      .subscribe(() => {
        this.setInitialOrders();
      });
  }

  deleteSchedule(data: WorkOrderDocument) {
    if (!data) {
      return;
    }
    this.workOrderService
      .deleteOrder(data.data.workCenterId, data.docId)
      .subscribe();
  }
}
