import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { IconComponent, IconDirective, IconSetService } from '@coreui/icons-angular';
import { WeddingService } from '../service/wedding.service';
import { EventStatusPipe } from '../../pipes/event-status.pipe';
import { freeSet } from '@coreui/icons';
import { BannerUploadComponent } from '../banner-upload/banner-upload.component';
import { CardUploadComponent } from '../card-upload/card-upload.component';
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
    CardUploadComponent,
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
  weddingId : String = '';
 showConfirmation = false;
  newStatus = '';
  currentElement: any = null; // To store the current element for status update
  displayedColumns: string[] = ['position', 'coupleName', 'weddingDate', 'eventStatus', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  currentDomain = window.location.origin; 
  totalItems = 0;
  pageSize = 1;
  page = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('bannerUpload') bannerUpload!: BannerUploadComponent;
  @ViewChild('cardUpload') cardUpload!: CardUploadComponent;

  constructor(
    private weddingService:WeddingService,
    private iconSet: IconSetService,
    private toastr: ToastrService,
  ) {
        this.iconSet.icons = { ...freeSet };
        // this.cilinfo = freeSet.cilInfo;
        // this.cilSetting = freeSet.cilSettings;

  }

  
  ngOnInit(): void {
    this.loadWeddings(this.page, this.pageSize);
  }

  loadWeddings(page: number, size: number): void {
    this.weddingService.getWeddingsWithPagination(page).subscribe(
      (res: any) => {
        this.dataSource.data = res.data.items;
        this.totalItems = res.data.totalElements;
      },
      (error) => {
        console.error('Error fetching weddings:', error);
      }
    );
  }

  

   openConfirmationDialog(element: any, status: string) {
    this.showConfirmation = true;
    this.currentElement = element; // Store the current element for status update
    this.weddingId = element.id;
    status = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'; // Toggle status
    this.newStatus = status;
  }

  onDialogResult(confirmed: boolean) {
    this.showConfirmation = false;
    if (confirmed) {
      console.log(this.weddingId)
       this.weddingService.updateWeddingStatus(this.weddingId).subscribe(
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
    this.loadWeddings(this.page, this.pageSize);
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
      this.bannerUpload.weddingId = id;  // Pass weddingId to the BannerUploadComponent

    }
  }

  openCardUploadModal(id: string) {
    const modalElement = document.getElementById('cardUploadModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
      const modalBackdrop = document.createElement('div');
      modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(modalBackdrop);
      this.cardUpload.weddingId = id;  // Pass weddingId to the CardUploadComponent
    }
  }

copyUrl(weddingId: string, coupleName: string) {
  // encodeURIComponent prevents issues if coupleName has spaces or special characters
  const url = `${window.location.origin}/wedding/information/${weddingId}?wedding-name=${encodeURIComponent(coupleName || '')}`;

  navigator.clipboard.writeText(url).then(() => {
    this.toastr.success('URL copied to clipboard', 'Success');
  }).catch(err => {
    console.error('Failed to copy: ', err);
    this.toastr.error('Failed to copy URL', 'Error');
  });
}

}
