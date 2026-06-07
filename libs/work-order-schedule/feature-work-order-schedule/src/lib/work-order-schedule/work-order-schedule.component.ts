import { Component, inject, OnInit, signal } from '@angular/core';
import {
  DropdownComponent,
  DropdownItem,
  TimelineBoardComponent,
  TimelineRow,
  ZoomLevel,
} from '@order-scheduler-tech-test/ui-components';
import {
  WorkCenterSchedule,
  WorkOrderService,
} from '@order-scheduler-tech-test/work-order-schedule-data-access';
import { DateTime } from 'luxon';
import { take } from 'rxjs';
import { centerSchedulesToTimelineRows } from '@order-scheduler-tech-test/work-order-schedule-utils';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { WorkOrderScheduleCreateComponent } from '../work-order-schedule-create/work-order-schedule-create.component';

@Component({
  selector: 'ostt-work-order-schedule',
  templateUrl: './work-order-schedule.component.html',
  styleUrl: './work-order-schedule.component.scss',
  imports: [DropdownComponent, TimelineBoardComponent],
})
export class WorkOrderScheduleComponent implements OnInit {
  private readonly workOrderService = inject(WorkOrderService);
  private offcanvasService = inject(NgbOffcanvas);

  startDate = signal<Date>(DateTime.now().minus({ months: 6 }).toJSDate());
  endDate = signal<Date>(DateTime.now().plus({ months: 6 }).toJSDate());
  zoomLevel = signal<ZoomLevel>('month');
  dataRows = signal<TimelineRow[]>([]);

  zoomLevels: DropdownItem[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  ngOnInit() {
    this.setInitialOrders();
    // todo - extract to a service along with the template for the drawer along with converting after close to observable
    this.offcanvasService.open(WorkOrderScheduleCreateComponent, {
      position: 'end',
      backdrop: 'static'
    });
  }

  setInitialOrders() {
    this.setOrdersInPeriod(
      DateTime.fromJSDate(this.startDate()),
      DateTime.fromJSDate(this.endDate()),
    );
  }

  setOrdersInPeriod(start: DateTime, end: DateTime) {
    this.workOrderService
      .getAllSchedulesInPeriod(start, end)
      .pipe(take(1))
      .subscribe({
        next: (value: WorkCenterSchedule[]) => {
          const timelineRows = centerSchedulesToTimelineRows(value);
          this.dataRows.set(timelineRows);
        },
      });
  }

  handleZoomLevelChange(item: DropdownItem) {
    this.zoomLevel.set(item.value as ZoomLevel);
  }
}
