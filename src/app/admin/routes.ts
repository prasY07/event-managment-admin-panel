// src/app/admin/routes.ts
import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const adminRoutes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./theme/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./pages/routes').then((m) => m.routes)
      },
      {
        path: 'users',
        loadChildren: () => import('./user/routes').then((m) => m.routes)
      },
      {
        path: 'events',
        loadChildren: () => import('./events/routes').then((m) => m.routes)
      },
      {
        path: 'wedding',
        loadChildren: () => import('./wedding/routes').then((m) => m.routes)
      },
    
    ],
    
  }
];
