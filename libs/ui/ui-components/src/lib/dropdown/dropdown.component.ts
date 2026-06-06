import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ostt-dropdown',
  standalone: true,
  imports: [NgSelectModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  label: InputSignal<string> = input.required<string>();
  items: InputSignal<DropdownItem[]> = input<DropdownItem[]>([
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]);

  bindLabel = 'label';
  bindValue = 'value';

  itemSelected: OutputEmitterRef<DropdownItem> = output();

  onItemChange(item: DropdownItem) {
    this.itemSelected.emit(item);
  }
}

export interface DropdownItem {
  value: string;
  label: string;
}
