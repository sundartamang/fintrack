import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Spinner } from "./shared/components";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, Spinner],
  template: `
    <p-toast position="top-right" />
    <app-spinner />
    <router-outlet />`,
  standalone: true,
})
export class App {}
