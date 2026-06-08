import { Component, inject, TemplateRef } from '@angular/core';
import { ToastService } from './toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ostt-toasts',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet],
  template: `
    @for (toast of toastService.toasts; track toast) {
      <ngb-toast
        [class]="toast.classname"
        [autohide]="toast.autohide ?? true"
        [delay]="toast.delay ?? 5000"
        (hidden)="toastService.remove(toast)"
      >
        @if (isTemplate(toast)) {
          <ng-container [ngTemplateOutlet]="toast.textOrTpl" />
        } @else {
          {{ toast.textOrTpl }}
        }
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

  isTemplate(toast: Toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}

export interface Toast {
  textOrTpl: string | TemplateRef<unknown>;
  classname?: string;
  autohide?: boolean;
  delay?: number;
}
