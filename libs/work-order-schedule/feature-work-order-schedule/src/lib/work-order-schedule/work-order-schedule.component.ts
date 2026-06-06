import { Component } from '@angular/core';
import {
  DropdownComponent,
  DropdownItem,
  TimelineBoardComponent,
  TimelineRow,
  ZoomLevel,
} from '@order-scheduler-tech-test/ui-components';

@Component({
  selector: 'ostt-work-order-schedule',
  templateUrl: './work-order-schedule.component.html',
  styleUrl: './work-order-schedule.component.scss',
  imports: [DropdownComponent, TimelineBoardComponent],
})
export class WorkOrderScheduleComponent {
  startDate = new Date('2026-03-01');
  endDate = new Date('2027-03-01');
  zoomLevel: ZoomLevel = 'month';
  zoomLevels: DropdownItem[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  rows: TimelineRow[] = [
    {
      id: '1',
      title: 'Team A',
      items: [
        {
          id: '1',
          label: 'Work A',
          startDate: new Date('2026-04-01'),
          endDate: new Date('2026-07-02'),
        },
      ],
    },
    { id: '2', title: 'Team B', items: [] },
    { id: '3', title: 'Team C', items: [] },
  ];

  handleZoomLevelChange(item: DropdownItem) {
    console.log('Zoom level changed to:', item.value);
    this.zoomLevel = item.value as ZoomLevel;
  }
}
