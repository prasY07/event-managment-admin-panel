import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { WeddingService } from '../service/wedding.service';
import { MatTableDataSource, MatTableModule  } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IconModule } from '@coreui/icons-angular';
import { ViewGuestDialogComponent } from './view-guest-dialog/view-guest-dialog.component';

@Component({
  selector: 'app-guest',
  standalone: true,
  imports: [RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RouterLink,
    CommonModule,
     MatTableModule,
    MatPaginatorModule,
    IconModule
  ],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.scss'
})
export class GuestComponent implements OnInit {

  displayedColumns: string[] = ['position', 'fullName', 'mobileNumber', 'email', 'gender', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  totalItems = 0;
  pageSize = 10;
  page = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  weddingId = '';

  constructor(
    private weddingService: WeddingService,
    private aRoute: ActivatedRoute,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.aRoute.params.subscribe(params => {
      this.weddingId = params['id'];
    });
  }

  ngOnInit(): void {
    console.log('Loading guests for wedding ID:', this.weddingId);
    this.getWeddingGuests(this.page, this.pageSize);
  }

  getWeddingGuests(page: number, size: number): void {
    this.weddingService.getWeddingGuests(page, this.weddingId).subscribe(
      (res: any) => {
        console.log('Guest API Response:', res);
        // Defensive mapping: ensure each item exposes an `id` property
        const items = (res?.data?.items || res?.data || []).map((it: any) => ({
          ...it,
          id:
            it.id ??
            it._id ??
            it.guestId ??
            it.guest_id ??
            it.ID ??
            it.uuid ??
            null,
        }));

        this.dataSource.data = items;
        this.totalItems = res?.data?.totalElements ?? res?.data?.total ?? items.length;
        
        console.log('Loaded guests:', items.length, 'Total:', this.totalItems);
      },
      (error) => {
        console.error('Error fetching wedding guests:', error);
        this.toastr.error('Failed to load wedding guests', 'Error');
      }
    );
  }

   onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getWeddingGuests(this.page, this.pageSize);
  }

  viewGuest(guest: any): void {
    // Use the guest data from current page (no need for separate API call)
    const dialogRef = this.dialog.open(ViewGuestDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: guest
    });
  }
}
