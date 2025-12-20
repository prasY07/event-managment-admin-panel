import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { WeddingService } from '../../service/wedding.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../common/component/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RouterLink,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    IconModule,
    ConfirmationDialogComponent
  ],
  templateUrl: './notification-list.component.html'
})
export class NotificationListComponent implements OnInit {

  displayedColumns: string[] = ['position', 'title', 'message', 'notificationDate', 'notificationTime', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  totalItems = 0;
  pageSize = 10;
  page = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  weddingId = '';
  functionId = '';

  constructor(
    private weddingService: WeddingService,
    private aRoute: ActivatedRoute,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.aRoute.params.subscribe(params => {
      this.weddingId = params['weddingId'];
      this.functionId = params['functionId'];
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.weddingService.getWeddingFunctionNotifications(this.weddingId).subscribe(
      (res: any) => {
        // Filter notifications by functionId if available
        let items = (res?.data?.items || res?.data || []);
        if (!Array.isArray(items)) {
          items = [];
        }
        // Normalize id field
        items = items.map((it: any) => ({
          ...it,
          id: it.id ?? it._id ?? it.notificationId ?? null,
        }));
        this.dataSource.data = items;
        this.totalItems = items.length;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
        this.toastr.error('Failed to load notifications', 'Error');
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadNotifications();
  }

  deleteNotification(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
    });

    const dialogInstance = dialogRef.componentInstance as ConfirmationDialogComponent;
    dialogInstance.message = 'Are you sure you want to delete this notification?';
    dialogInstance.confirmButtonText = 'Delete';
    dialogInstance.cancelButtonText = 'Cancel';

    dialogInstance.confirmed.subscribe((result: boolean) => {
      if (result) {
        this.weddingService.deleteWeddingFunctionNotification(id).subscribe(
          () => {
            this.toastr.success('Notification deleted successfully', 'Success');
            this.loadNotifications();
          },
          (error) => {
            console.error('Error deleting notification:', error);
            this.toastr.error('Failed to delete notification', 'Error');
          }
        );
      }
    });
  }

  toggleStatus(id: string, currentStatus: string): void {
    const newStatus = currentStatus === 'PENDING' ? 'ACTIVE' : 'PENDING';
    this.weddingService.updateWeddingFunctionNotificationStatus(id, newStatus).subscribe(
      () => {
        this.toastr.success(`Notification status updated to ${newStatus}`, 'Success');
        this.loadNotifications();
      },
      (error) => {
        console.error('Error updating notification status:', error);
        this.toastr.error('Failed to update notification status', 'Error');
      }
    );
  }

}
