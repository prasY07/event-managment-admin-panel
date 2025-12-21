import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { InformationComponent } from './event/information/information.component';
import { RegistrationComponent } from './event/registration/registration.component';
import { CompanyDetailsComponent } from './event/company-details/company-details.component';
import { InformationComponent as WeddingInformationComponent } from './wedding/information/information.component';
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
      { path: 'information/:id', component: InformationComponent, data: { title: 'Event-Information' } },
      { path: ':id/registration', component: RegistrationComponent, data: { title: 'Event Registration' } },
      { path: 'company-details', component: CompanyDetailsComponent, data: { title: 'Company Details' } },
    ]

  },
  {
    path:'wedding',
       children: [
      { path: 'information/:id', component: WeddingInformationComponent, data: { title: 'Wedding-Information' } },
      { path: ':id/registration', component: RegistrationComponent, data: { title: 'Wedding Registration' } },
    ]

  }
];
