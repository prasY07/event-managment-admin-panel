import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { IconComponent, IconDirective } from '@coreui/icons-angular';
@Component({
  selector: 'app-list',
  standalone: true, // 🔹 Required for loadComponent
  imports: [ RouterLink,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    IconDirective,
    IconComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

}
