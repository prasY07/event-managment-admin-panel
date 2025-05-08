import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { IconComponent, IconDirective } from '@coreui/icons-angular';
import { EventService } from '../service/event.service';
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
    IconComponent,
    CommonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  events: any[] = [];
  constructor(
    private eventService:EventService,
    
  ) {
  }
  ngOnInit(): void {
    this.loadusers();
  }

  loadusers() {
    this.eventService.getEvents()
      .subscribe(
        (data: any) => {
          this.events = data.data.items;
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );

  }
}
