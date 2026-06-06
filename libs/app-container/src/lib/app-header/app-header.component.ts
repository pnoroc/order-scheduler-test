import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
// @upgrade - this component can be generic, thus moved to a shared/ui library.
// For the tech test it's fine to keep it here.
export class AppHeaderComponent {
  logoPath = '/assets/images/logo.png'; // @note: this should be an input
}
