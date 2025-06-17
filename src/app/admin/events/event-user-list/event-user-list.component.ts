import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { EventService } from '../service/event.service';

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
export class EventUserListComponent implements OnInit {

  users:any[] = [];
  
  eventId = '';

  constructor(
    private eventService: EventService,
    private aRoute: ActivatedRoute,
  ) {
    this.aRoute.params.subscribe(params => {
      this.eventId = params['id'];
    });
  }

  ngOnInit(): void {
      
  }

  getAllEventUsers()
  {
    
  }

}
