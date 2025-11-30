import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components').then((c) => c.Landing),
  },
  {
    path: 'valuation',
    loadComponent: () => import('./components').then((c) => c.Valuation)
  },
  {
    path: 'company',
    loadComponent: () => import('./components').then((c) => c.CompanyList)
  }
];
