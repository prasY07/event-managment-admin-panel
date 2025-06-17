import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
export const webRoutes: Routes = [
  {
    path: '',
    component:LayoutComponent ,
    children: [
      { path: '', component: HomeComponent, data: { title: 'Home' } },
    ]
  }
];
