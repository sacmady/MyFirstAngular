import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login-page/login-page').then(m => m.LoginPage),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./welcome-page/welcome-page').then(m => m.WelcomePage),
    canActivate: [authGuard],
  },
];
