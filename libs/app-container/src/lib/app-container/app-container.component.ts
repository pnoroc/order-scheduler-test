import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkOrderScheduleComponent } from '@order-scheduler-tech-test/work-order-schedule';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { ToastsContainerComponent } from '@order-scheduler-tech-test/ui-components';

@Component({
  selector: 'app-container',
  imports: [
    WorkOrderScheduleComponent,
    AppHeaderComponent,
    ToastsContainerComponent,
  ],
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppContainerComponent {}
