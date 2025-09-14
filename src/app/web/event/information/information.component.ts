import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebEventService } from '../../services/webevent.service';
import { UcfirstPipe } from 'src/app/common/pipe/ucfirst.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-information',
  standalone: true,  // 👈 required if you’re using "imports"
  imports: [UcfirstPipe, CommonModule],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']  // 👈 fixed: styleUrls instead of styleUrl
})
export class InformationComponent implements OnInit {
  event: any = {};
  eventId: string = '';

  constructor(
    private eventService: WebEventService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      this.eventId = params['id'];
      this.getEvent();
    });
  }

  getEvent() {
    this.eventService.getEventInformation(this.eventId).subscribe((data: any) => {
      this.event = data.data;
      console.log(this.event);
        if (this.event.startDate && this.event.startTime) {
      this.event.startDateTime = new Date(`${this.event.startDate}T${this.event.startTime}`);
    }

    if (this.event.endDate && this.event.endTime) {
      this.event.endDateTime = new Date(`${this.event.endDate}T${this.event.endTime}`);
    }
    });
  }
}
