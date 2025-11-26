import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { ToastType } from '../../models';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, MessageModule],
  template: `
  @if(message && type) {
    <div class="flex justify-center align-center absolute notification">
        <p-message [severity]="type" [text]="message" [closable]="true" />
    </div>
  }`,
  styles: [`
    .notification {
      bottom: 3%;
      left: 50%;
      transform: translate(-50%, -3%);
    }
  `],
})
export class Notification {

  @Input()
  message: string = '';

  @Input()
  type: ToastType = 'info';
}
