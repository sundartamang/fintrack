import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from "@angular/router";
import { MenubarModule } from 'primeng/menubar';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, RouterModule, MenubarModule, ToggleSwitchModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {

  items: MenuItem[] | undefined;
  isDarkMode: boolean = true;

  ngOnInit() {
    this.initializeMenuItems();
    this.applyDefaultTheme();
  }

  toggleTheme(): void {
    const html = document.querySelector('html');

    if (!html) return;

    html.classList.toggle('my-app-dark');
  }

  private initializeMenuItems(): void {
    this.items = [
      {
        label: 'Home',
        routerLink: '/',
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'Valutions',
        routerLink: '/valuation'
      },
      // {
      //   label: 'Company',
      //   routerLink: '/company'
      // }
    ]
  }

  private applyDefaultTheme(): void {
    const html = document.querySelector('html');
    html?.classList.add('my-app-dark');
  }
}
