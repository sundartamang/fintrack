import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification {

  @Input()
  showNotification: boolean = false;

  @Input()
  message: string = '';

  @Input()
  type: 'success' | 'error' | 'info' = 'info';

  @Output()
  close = new EventEmitter<void>();

  closeNotification(): void {
    this.close.emit();
  }

}
