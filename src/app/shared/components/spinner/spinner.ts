import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerService } from '../../services';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    @if (spinnerService.loading$ | async) {
      <div class="flex align-center justify-center fixed top-0 left-0 w-full h-full spinner-overlay">
        <p-progress-spinner strokeWidth="7" fill="transparent" animationDuration=".5s" [style]="{ width: spinnerSize, height: spinnerSize }" />
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 1050;
    }
  `],
  standalone: true,
})
export class Spinner {

  @Input()
  spinnerSize: string = '50px';

  constructor(public spinnerService: SpinnerService) {}
}
