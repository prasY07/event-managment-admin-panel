// src/app/routes.ts
import { Routes } from '@angular/router';
import { adminRoutes } from './admin/routes';
import { webRoutes  } from './web/routes';
export const routes: Routes = [
  
  {
    path: '',
    children: webRoutes
  },

   {
    path: 'admin',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    children: adminRoutes
  },
  {
    path: '404',
    loadComponent: () => import('./admin/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./admin/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/auth/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },

];
