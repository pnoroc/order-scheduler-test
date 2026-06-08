import { Injectable, TemplateRef } from '@angular/core';
import { Toast } from './toast-container.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(textOrTpl: string | TemplateRef<unknown>, options: Record<string, unknown> = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts = [];
  }
}
