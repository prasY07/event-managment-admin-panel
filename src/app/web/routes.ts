import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { InformationComponent } from './event/information/information.component';
import { RegistrationComponent } from './event/registration/registration.component';
export const webRoutes: Routes = [
  {
    path: '',
    component:LayoutComponent ,
    children: [
      { path: '', component: HomeComponent, data: { title: 'Home' } },
    ]
  },
  {
    path:'event',
       children: [
      { path: 'information', component: InformationComponent, data: { title: 'Event-Information' } },
      { path: 'registration', component: RegistrationComponent, data: { title: 'Event Registration' } },
    ]

  }
];
