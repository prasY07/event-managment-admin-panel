import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/list.component').then((m) => m.ListComponent),
    data: {
      title: 'Events List'
    }
  },
  {
    path: 'add-new-event',
    loadComponent: () =>
      import('./add/add.component').then((m) => m.AddComponent),
    data: {
      title: 'Add'
    }
  },
];
