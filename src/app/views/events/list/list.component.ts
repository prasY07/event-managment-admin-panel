import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { IconComponent, IconDirective, IconSetService } from '@coreui/icons-angular';
import { EventService } from '../service/event.service';
import { EventStatusPipe } from '../../pipes/event-status.pipe';
import { freeSet } from '@coreui/icons';
import { BannerUploadComponent } from '../banner-upload/banner-upload.component';
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
    CommonModule,
    EventStatusPipe,
    BannerUploadComponent
  ],
  
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  events: any[] = [];
  eventId : String = '';
  // public cilinfo: any;
  // public cilSetting: any;
  @ViewChild('bannerUpload') bannerUpload!: BannerUploadComponent;

  constructor(
    private eventService:EventService,
    private iconSet: IconSetService,
    
  ) {
        this.iconSet.icons = { ...freeSet };
        // this.cilinfo = freeSet.cilInfo;
        // this.cilSetting = freeSet.cilSettings;

  }

  
  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
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


  openImageUploadModal(id: string) {
    const modalElement = document.getElementById('imageUploadModal');
    if (modalElement) {
      modalElement.classList.add('show'); // Shows the modal
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
      const modalBackdrop = document.createElement('div');
      modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(modalBackdrop);
      this.bannerUpload.eventId = id;  // Pass eventId to the BannerUploadComponent

     
    }
  }
}
