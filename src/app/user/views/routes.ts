import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'description',
        loadComponent: () =>
          import('./events/event-information/event-information.component').then(m => m.EventInformationComponent),
        data: { title: 'Event Information' }
      },
     
    ]
  }
];
