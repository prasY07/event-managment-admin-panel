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
    path: 'wedding-setting/:id',
    loadComponent: () => import('./setting/setting.component').then(m => m.SettingComponent),
    data: {
      title: 'Wedding Setting' 
    }
  },
  {
    path: 'wedding-information/:id',
    loadComponent: () => import('./information/information.component').then(m => m.InformationComponent),
    data: {
      title: 'Wedding Information' 
    }
  },
  {
    path: 'wedding-functions/:id',
    loadComponent: () => import('./wedding-user-list/wedding-user-list.component').then(m => m.WeddingUserListComponent),
    data: {
      title: 'Wedding Functions' 
    }
  },
  {
    path: 'add-function/:id',
    loadComponent: () => import('./function/add-function/add-function.component').then(m => m.AddFunctionComponent),
    data: {
      title: 'Add Wedding Function' 
    }
  },
  {
    path: 'function/:id/update',
    loadComponent: () => import('./function/update-function/update-function.component').then(m => m.UpdateFunctionComponent),
    data: {
      title: 'Update Wedding Function'
    }
  },
  {
    path: 'function/:id',
    loadComponent: () => import('./function/view-function/view-function.component').then(m => m.ViewFunctionComponent),
    data: {
      title: 'View Wedding Function'
    }
  },
  {
    path: 'notification-list/:weddingId/:functionId',
    loadComponent: () => import('./function/notification-list/notification-list.component').then(m => m.NotificationListComponent),
    data: {
      title: 'Wedding Function Notifications'
    }
  },
  {
    path: 'notification-add/:weddingId/:functionId',
    loadComponent: () => import('./function/notification-add/notification-add.component').then(m => m.NotificationAddComponent),
    data: {
      title: 'Add Notification'
    }
  },
  {
    path: 'notification-edit/:id/:weddingId/:functionId',
    loadComponent: () => import('./function/notification-edit/notification-edit.component').then(m => m.NotificationEditComponent),
    data: {
      title: 'Edit Notification'
    }
  }
];
