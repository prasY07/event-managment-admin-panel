import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user.component').then(m => m.UserComponent),
    data: {
      title: 'Users'
    }
  },
  {
    path: 'add-new-user',
    loadComponent: () => import('./add-user.component').then(m => m.AddUserComponent),
    data: {
      title: 'Add New User'
    }
  }
];
