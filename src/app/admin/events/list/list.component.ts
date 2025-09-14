import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { IconComponent, IconDirective, IconSetService } from '@coreui/icons-angular';
import { EventService } from '../service/event.service';
import { EventStatusPipe } from '../../pipes/event-status.pipe';
import { freeSet } from '@coreui/icons';
import { BannerUploadComponent } from '../banner-upload/banner-upload.component';
import { MatTableDataSource, MatTableModule  } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogComponent } from '../../../common/component/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

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
    CommonModule,
    EventStatusPipe,
    BannerUploadComponent,
    MatTableModule,
    MatPaginatorModule,
    NgForOf,
    ConfirmationDialogComponent
    
    // DataSource
  ],
  
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  eventId : String = '';
 showConfirmation = false;
  newStatus = '';
  currentElement: any = null; // To store the current element for status update
  displayedColumns: string[] = ['position', 'title', 'startDate', 'eventStatus', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  currentDomain = window.location.origin; 
  totalItems = 0;
  pageSize = 1;
  page = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('bannerUpload') bannerUpload!: BannerUploadComponent;

  constructor(
    private eventService:EventService,
    private iconSet: IconSetService,
    private toastr: ToastrService,
  ) {
        this.iconSet.icons = { ...freeSet };
        // this.cilinfo = freeSet.cilInfo;
        // this.cilSetting = freeSet.cilSettings;

  }

  
  ngOnInit(): void {
    this.loadEvents(this.page, this.pageSize);
  }

  loadEvents(page: number, size: number): void {
    this.eventService.getEventsWithPagination(page).subscribe(
      (res: any) => {
        this.dataSource.data = res.data.items;
        this.totalItems = res.data.totalElements;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  

   openConfirmationDialog(element: any, status: string) {
    this.showConfirmation = true;
    this.currentElement = element; // Store the current element for status update
    this.eventId = element.id;
    status = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'; // Toggle status
    this.newStatus = status;
  }

  onDialogResult(confirmed: boolean) {
    this.showConfirmation = false;
    if (confirmed) {
      console.log(this.eventId)
       this.eventService.updateEventStatus(this.eventId).subscribe(
      (res: any) => {
        this.toastr.success('Status Updated successfully.', 'Success');
        this.currentElement.status = this.newStatus; // 👈 Updates UI directly

      },
      (error) => {
        this.toastr.success('OOPS! Something Went Wrong.', 'Error');

      }
    );
    } else {
      console.log('User cancelled.');
    }
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEvents(this.page, this.pageSize);
  }

  

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
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

copyUrl(eventId: string, eventName: string) {
  // encodeURIComponent prevents issues if eventName has spaces or special characters
  const url = `${window.location.origin}/event/information/${eventId}?event-name=${encodeURIComponent(eventName)}`;

  navigator.clipboard.writeText(url).then(() => {
    alert('URL copied to clipboard'); // ✅ or replace with toast/snackbar
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

}
