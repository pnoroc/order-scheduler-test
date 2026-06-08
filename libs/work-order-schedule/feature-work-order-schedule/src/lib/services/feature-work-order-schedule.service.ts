import { inject, Injectable } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { WorkOrderScheduleCreateComponent } from '../work-order-schedule-create/work-order-schedule-create.component';
import {
  WorkOrderDocument,
  WorkOrderService,
} from '@order-scheduler-tech-test/work-order-schedule-data-access';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeatureWorkOrderScheduleService {
  private readonly offcanvasService = inject(NgbOffcanvas);
  private readonly workOrderApiService = inject(WorkOrderService);

  showOrderForm(centerId:string, data?: WorkOrderDocument): Observable<unknown> {
    const offcanvasRef = this.offcanvasService.open(
      WorkOrderScheduleCreateComponent,
      {
        position: 'end',
        backdrop: 'static',
      },
    );

    offcanvasRef.componentInstance.centerId = centerId;

    if (data) {
      offcanvasRef.componentInstance.orderData.set(data);
    }

    return offcanvasRef.closed;
  }
}
