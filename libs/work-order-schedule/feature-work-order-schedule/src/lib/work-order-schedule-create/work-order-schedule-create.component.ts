import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WorkOrderStatus } from '@order-scheduler-tech-test/work-order-schedule-data-access';
import {
  NgLabelTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import {
  BadgeComponent,
  BadgeType,
} from '@order-scheduler-tech-test/ui-components';
import { NgbActiveOffcanvas, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ostt-work-order-schedule-create',
  templateUrl: './work-order-schedule-create.component.html',
  styleUrl: './work-order-schedule-create.component.scss',
  imports: [
    ReactiveFormsModule,
    NgSelectComponent,
    NgLabelTemplateDirective,
    BadgeComponent,
    NgbInputDatepicker,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderScheduleCreateComponent {
  public activeOffcanvas = inject(NgbActiveOffcanvas);

  statuses = signal<WorkOrderScheduleStatus[]>([
    { value: 'open', label: 'Open', badgeType: 'primary' },
    { value: 'in-progress', label: 'In progress', badgeType: 'info' },
    { value: 'complete', label: 'Complete', badgeType: 'success' },
    { value: 'blocked', label: 'Blocked', badgeType: 'warning' },
  ]);

  scheduleForm = new FormGroup({
    name: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    status: new FormControl(undefined, [Validators.required]),
    startDate: new FormControl(undefined, [Validators.required]),
    endDate: new FormControl(undefined, [Validators.required]),
  });

  saveForm(): void {
    if (this.scheduleForm.valid) {
      console.log(this.scheduleForm.value);
    } else {
      this.scheduleForm.markAllAsTouched();
      this.scheduleForm.markAsDirty();
    }
  }

  abort(): void {
    this.activeOffcanvas.close();
  }
}

export interface WorkOrderScheduleStatus {
  value: WorkOrderStatus;
  label: string;
  badgeType: BadgeType;
}
