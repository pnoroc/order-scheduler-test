import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppContainerComponent } from '@order-scheduler-tech-test/app-container';

@Component({
  imports: [RouterModule, AppContainerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
