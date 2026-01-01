import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { WeddingService } from '../service/wedding.service';
import { MatTableDataSource, MatTableModule  } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../common/component/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-wedding-user-list',
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
    IconModule,
    ConfirmationDialogComponent
  ],
  templateUrl: './wedding-user-list.component.html',
  styleUrl: './wedding-user-list.component.scss'
})
export class WeddingUserListComponent implements OnInit {

  displayedColumns: string[] = ['position','functionName','functionDate','functionStartTime','functionEndTime','venueName', 'action'];
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
    this.getAllFunctions(this.page, this.pageSize);
  }



  getAllFunctions(page: number, size: number): void {
    this.weddingService.getWeddingFunctions(page, this.weddingId).subscribe(
      (res: any) => {
        // Defensive mapping: ensure each item exposes an `id` property
        const items = (res?.data?.items || []).map((it: any) => ({
          ...it,
          id:
            it.id ??
            it._id ??
            it.functionId ??
            it.function_id ??
            it.ID ??
            it.uuid ??
            null,
        }));

        this.dataSource.data = items;
        this.totalItems = res?.data?.totalElements ?? items.length;
      },
      (error) => {
        console.error('Error fetching wedding functions:', error);
        this.toastr.error('Failed to load wedding functions', 'Error');
      }
    );
  }

   onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllFunctions(this.page, this.pageSize);
  }

  deleteFunction(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
    });
    
    const dialogInstance = dialogRef.componentInstance as ConfirmationDialogComponent;
    dialogInstance.message = 'Are you sure you want to delete this wedding function?';
    dialogInstance.confirmButtonText = 'Delete';
    dialogInstance.cancelButtonText = 'Cancel';

    dialogInstance.confirmed.subscribe((result: boolean) => {
      if (result) {
        this.weddingService.deleteWeddingFunction(id).subscribe(
          () => {
            this.toastr.success('Wedding function deleted successfully', 'Success');
            this.getAllFunctions(this.page, this.pageSize);
          },
          (error) => {
            console.error('Error deleting wedding function:', error);
            this.toastr.error('Failed to delete wedding function', 'Error');
          }
        );
      }
    });
  }
}
