import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@order-scheduler-tech-test/work-order-schedule').then((m) => m.WorkOrderScheduleComponent)
  }
];
