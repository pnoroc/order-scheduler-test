import { Component, ElementRef, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppendToBodyDirective } from '../directives/append-to-body.directive';

export interface ActionMenuItem {
  id: string | number;
  label: string;
}

@Component({
  selector: 'ostt-action-menu',
  imports: [CommonModule, AppendToBodyDirective, AppendToBodyDirective], // 👈 Register here
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.scss',
  host: {
    '(document:click)': 'clickOutside($event)',
  },
})
export class ActionMenuComponent {
  private readonly elementRef: ElementRef = inject(ElementRef);

  menuItems = input<ActionMenuItem[]>([]);
  actionSelected = output<ActionMenuItem>();

  isOpen = false;

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  onItemSelect(item: ActionMenuItem): void {
    this.actionSelected.emit(item);
    this.isOpen = false;
  }

  closeOnTab(): void {
    this.isOpen = false;
  }

  clickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
