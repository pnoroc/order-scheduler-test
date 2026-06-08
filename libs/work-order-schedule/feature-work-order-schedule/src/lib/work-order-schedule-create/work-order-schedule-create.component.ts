import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  WorkOrderDocument,
  WorkOrderService,
  WorkOrderStatus,
} from '@order-scheduler-tech-test/work-order-schedule-data-access';
import {
  NgLabelTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import {
  BadgeComponent,
  BadgeType,
} from '@order-scheduler-tech-test/ui-components';
import {
  NgbActiveOffcanvas,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';

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
  private readonly activeOffcanvas = inject(NgbActiveOffcanvas);
  private readonly workOrdersApiService = inject(WorkOrderService);

  orderData = signal<WorkOrderDocument | undefined>(undefined);
  isEdit = computed(() => !!this.orderData()?.docId);

  statuses = signal<WorkOrderScheduleStatus[]>([
    { value: 'open', label: 'Open', badgeType: 'primary' },
    { value: 'in-progress', label: 'In progress', badgeType: 'info' },
    { value: 'complete', label: 'Complete', badgeType: 'success' },
    { value: 'blocked', label: 'Blocked', badgeType: 'warning' },
  ]);

  centerId!: string;

  scheduleForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    status: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
    startDate: new FormControl<NgbDate | undefined>(undefined, [
      Validators.required,
    ]),
    endDate: new FormControl<NgbDate | undefined>(undefined, [
      Validators.required,
    ]),
  });

  constructor() {
    effect(() => {
      if (this.orderData()) {
        this.patchFormValue();
      }
    });
  }

  patchFormValue(): void {
    if (this.isEdit()) {
      const data = this.orderData()?.data;

      this.scheduleForm.patchValue({
        name: data?.name,
        status: data?.status,
        startDate: this.patchDate(DateTime.fromISO(data?.startDate as string)),
        endDate: this.patchDate(DateTime.fromISO(data?.endDate as string)),
      });
    }
  }

  saveForm(): void {
    if (this.scheduleForm.valid) {
      const request = this.isEdit()
        ? this.workOrdersApiService.updateOrder(
            this.centerId,
            this.orderData()?.docId as string,
            this.toScheduleRequest(),
          )
        : this.workOrdersApiService.addOrder(
            this.centerId,
            this.toScheduleRequest(),
          );

      request.subscribe({
        next: () => this.activeOffcanvas.close(),
        error: () => alert('Order overlaps existing schedule'),
      });
    } else {
      this.scheduleForm.markAllAsTouched();
      this.scheduleForm.markAsDirty();
    }
  }

  abort(): void {
    this.activeOffcanvas.close();
  }

  private patchDate(date: DateTime) {
    return { day: date.day, month: date.month, year: date.year };
  }

  private toScheduleRequest(): WorkOrderDocument {
    const { name, status, startDate, endDate } = this.scheduleForm.value;

    const docId = this.orderData()?.docId as string ?? DateTime.now().toMillis().toString();

    return {
      docId,
      docType: 'WorkOrder',
      data: {
        name: name as string,
        workCenterId: '5',
        status: status as WorkOrderStatus,
        startDate: this.formatNgbDate(startDate),
        endDate: this.formatNgbDate(endDate),
      },
    };
  }

  // todo - extract to utils
  formatNgbDate(date: NgbDate | null | undefined): string {
    if (!date) return '';
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
  }
}

export interface WorkOrderScheduleStatus {
  value: WorkOrderStatus;
  label: string;
  badgeType: BadgeType;
}

export interface NgbDate {
  year: number;
  month: number;
  day: number;
}
