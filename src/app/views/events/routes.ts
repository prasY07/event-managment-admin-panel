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
  {
    path: 'update-event/:id',
    loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent),
    data: {
      title: 'Update Event'
    }
  },
  {
    path: 'event-setting/:id',
    loadComponent: () => import('./setting/setting.component').then(m => m.SettingComponent),
    data: {
      title: 'Event Setting' 
    }
  },
  {
    path: 'event-information/:id',
    loadComponent: () => import('./information/information.component').then(m => m.InformationComponent),
    data: {
      title: 'Event Information' 
    }
  },
  {
    path: 'event-users/:id',
    loadComponent: () => import('./event-user-list/event-user-list.component').then(m => m.EventUserListComponent),
    data: {
      title: 'Event Information' 
    }
  },
  {
    path: 'add-user/:id',
    loadComponent: () => import('./add-event-user/add-event-user.component').then(m => m.AddEventUserComponent),
    data: {
      title: 'Event Information' 
    }
  }
];
