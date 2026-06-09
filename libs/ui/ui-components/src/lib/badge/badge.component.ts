import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ostt-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': `type()`,
  },
})
export class BadgeComponent {
  label = input<string>();
  type = input<BadgeType>();
}
// todo - convert to enum
export type BadgeType = 'primary' | 'info' | 'success' | 'warning' | 'error';
export interface BadgeConfig {
  label: string;
  type: BadgeType;
}
