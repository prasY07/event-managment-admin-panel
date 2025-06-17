import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './admin/layout';
import {WebDefaultLayoutComponent} from './web/views/layout/web-default-layout/web-default-layout.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./admin/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./admin/theme/routes').then((m) => m.routes)
      },
      // {
      //   path: 'base',
      //   loadChildren: () => import('./admin/base/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'buttons',
      //   loadChildren: () => import('./admin/buttons/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'forms',
      //   loadChildren: () => import('./admin/forms/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'icons',
      //   loadChildren: () => import('./admin/icons/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: () => import('./admin/notifications/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: () => import('./admin/widgets/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => import('./admin/charts/routes').then((m) => m.routes)
      // },
      {
        path: 'pages',
        loadChildren: () => import('./admin/pages/routes').then((m) => m.routes)
      },

      {
        path: 'users',
        loadChildren: () => import('./admin/user/routes').then((m) => m.routes)
      },
      {
        path: 'events',
        loadChildren: () => import('./admin/events/routes').then((m) => m.routes)
      },
    ]
  },
  // {
  //   path: 'event/:id',
  //   component: WebDefaultLayoutComponent,  
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./web/admin/routes').then(m => m.routes),
  //       data: {
  //         title: 'Event Description'
  //       }
  //     }
  //   ]
  // },
  
  {
    path: '404',
    loadComponent: () => import('./admin/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  // {
  //   path: 'event-description-path',
  //   loadComponent: () => import('./user/admin/events/event-information/event-information.component').then(m => m.EventInformationComponent),
  //   data: {
  //     title: 'Page 404'
  //   }
  // },
  {
    path: '500',
    loadComponent: () => import('./admin/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./admin/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./admin/pages/register/register.component').then(m => m.RegisterComponent),
  //   data: {
  //     title: 'Register Page'
  //   }
  // },
  { path: '**', redirectTo: 'dashboard' }
];
