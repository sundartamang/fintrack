import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../shared/services';
import { ToastService } from '../../shared/services';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  standalone: true,
})
export class Landing {

  constructor(private spinnerService: SpinnerService, private toastService: ToastService) {}

  testSpinner(): void { 
    this.spinnerService.show();
  }

  testToast(): void{
    this.toastService.error('Saved', 'User added successfully');
  }

  toggleTheme(): void{
    const element = document.querySelector('html');
    if(element !== null){
      element.classList.toggle('my-app-dark');
    }
  }
}
