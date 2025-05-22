import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-event-user-list',
  imports: [ RowComponent,
    ColComponent,
    // TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RouterLink
    // IconDirective,
    // IconComponent,
    // CommonModule,
  ],
  templateUrl: './event-user-list.component.html',
  styleUrl: './event-user-list.component.scss'
})
export class EventUserListComponent {

}
