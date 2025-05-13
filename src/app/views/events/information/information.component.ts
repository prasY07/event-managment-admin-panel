import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective } from '@coreui/angular';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-information',
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})
export class InformationComponent implements OnInit {
  eventId: string = '';
  event: any = {};
  constructor(
    private eventService: EventService,
    private aRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      this.eventId = params['id'];
    });
    this.getEvent();
  }

  getEvent() {
    this.eventService.getSingleEvent(this.eventId).subscribe((data: any) => {
      this.event = data.data;
    });
  }


}
