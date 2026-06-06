import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkOrderScheduleComponent } from '@order-scheduler-tech-test/work-order-schedule';
import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
  selector: 'app-container',
  imports: [WorkOrderScheduleComponent, AppHeaderComponent],
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppContainerComponent {}
