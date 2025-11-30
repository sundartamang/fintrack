import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from "@angular/router";
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, MenubarModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {

  items: MenuItem[] | undefined;

  isDarkMode = true;
  icon = 'pi pi-moon';

  ngOnInit() {
    this.initializeMenuItems();
    this.applyDefaultTheme();
  }


  toggleTheme(): void {
    const html = document.querySelector('html');

    if (!html) return;

    html.classList.toggle('my-app-dark');
    this.isDarkMode = html.classList.contains('my-app-dark');

    this.icon = this.isDarkMode ? 'pi pi-moon' : 'pi pi-sun';
  }

  private initializeMenuItems(): void {
    this.items = [
      {
        label: 'Home',
        routerLink: '/'
      },
      {
        label: 'Valutions',
        routerLink: '/valuation'
      },
      {
        label: 'Company',
        routerLink: '/company'
      }
    ]
  }

  private applyDefaultTheme(): void {
    const html = document.querySelector('html');
    html?.classList.add('my-app-dark');
  }
}
