import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'ostt-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class DropdownComponent {
  private readonly elementRef: ElementRef = inject(ElementRef);

  label: InputSignal<string> = input.required<string>();
  items: InputSignal<DropdownItem[]> = input<DropdownItem[]>([
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]);

  itemSelected: OutputEmitterRef<DropdownItem> = output();

  isOpen: WritableSignal<boolean> = signal(false);
  selected: WritableSignal<DropdownItem | null> = signal(null);

  get selectedItem(): DropdownItem | null {
    return this.selected() ?? this.items()[0] ?? null;
  }

  toggle(event: Event): void {
    event.stopPropagation();
    this.isOpen.update((open) => !open);
  }

  selectItem(item: DropdownItem): void {
    this.selected.set(item);
    this.isOpen.set(false);
    this.itemSelected.emit(item);
  }

  isSelected(item: DropdownItem): boolean {
    return this.selectedItem?.value === item.value;
  }

  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}

export interface DropdownItem {
  value: string;
  label: string;
}
