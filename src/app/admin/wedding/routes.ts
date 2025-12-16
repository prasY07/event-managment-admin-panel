import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/list.component').then((m) => m.ListComponent),
    data: {
      title: 'Wedding List'
    }
  },
  {
    path: 'add-new-wedding',
    loadComponent: () =>
      import('./add/add.component').then((m) => m.AddComponent),
    data: {
      title: 'Add'
    }
  },
  {
    path: 'update-wedding/:id',
    loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent),
    data: {
      title: 'Update Event'
    }
  }
  
];
