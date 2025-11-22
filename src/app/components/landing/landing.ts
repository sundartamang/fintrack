import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../shared/components';

@Component({
  selector: 'app-landing',
  imports: [CommonModule,Notification],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  standalone: true,
})
export class Landing {
  message: string = 'Welcome to fintrack by sundar!';
  showNotification: boolean = true;
  type: 'success' | 'error' | 'info' = 'info';
  
  closeNotification(): void {
    this.showNotification = false;
  }
  
}
