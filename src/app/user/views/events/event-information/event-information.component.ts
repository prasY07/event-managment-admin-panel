import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-information',
  imports: [CommonModule],
  templateUrl: './event-information.component.html',
  styleUrl: './event-information.component.scss'
})
export class EventInformationComponent implements OnInit {

   eventUUId: string = '';
    event: any = {};
    constructor(
      private eventService: EventService,
      private aRoute: ActivatedRoute,
  
    ) { }
  
    ngOnInit(): void {
      this.aRoute.params.subscribe(params => {
        this.eventUUId = params['id'];
      });
      this.getEvent();
    }
    
    getEvent() {
      this.eventService.getEventDataWithUUId(this.eventUUId).subscribe((data: any) => {
        this.event = data.data;
        console.log("this.event",this.event);
      });
    }

}
