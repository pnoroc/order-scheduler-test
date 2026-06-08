import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ostt-toasts',
  standalone: true,
  imports: [NgbToastModule],
  template: `
    @for (toast of toastService.toasts; track toast) {
      <ngb-toast
        [class]="toast.classname"
        [autohide]="toast.autohide ?? true"
        [delay]="toast.delay ?? 5000"
        (hidden)="toastService.remove(toast)"
      >
        {{ toast.textOrTpl }}
      </ngb-toast>
    }
  `,
  host: {
    class: 'toast-container position-fixed bottom-0 end-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastsContainerComponent {
  toastService = inject(ToastService);
}

export interface Toast {
  textOrTpl: string;
  classname?: string;
  autohide?: boolean;
  delay?: number;
}
