import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 't/:symbol',
    loadComponent: () => import('./pages/ticker-detail/ticker-detail.component').then(m => m.TickerDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];