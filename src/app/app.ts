import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Navbar, Spinner } from "./shared/components";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, Spinner, Navbar],
  template: `
    <app-navbar />
    <div class="p-15">
      <p-toast position="top-right" />
      <app-spinner />
      <router-outlet />
    </div>`,
  standalone: true,
})
export class App {}
