import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { IconComponent, IconDirective, IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { UserService } from './service/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { UserstatusPipe } from '../pipes/userstatus.pipe';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterLink,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    IconDirective,
    IconComponent,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    UserstatusPipe,
  ],
  providers: [IconSetService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public cilCalendar: any;
  public cilPencil: any;
  users: any[] = [];

  displayedColumns: string[] = ['position','name', 'email', 'status', 'role', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  totalItems = 0;
  pageSize = 10;
  page = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private iconSet: IconSetService,
    private userService:UserService,
    private toastr: ToastrService,
    
  ) {
    this.iconSet.icons = { ...freeSet };
    this.cilCalendar = freeSet.cilCalendar;
    this.cilPencil = freeSet.cilPencil;
  }

  ngOnInit(): void {
    this.loadusers(this.page, this.pageSize);
  }

  loadusers(page: number, size: number) {
    this.userService.getUsers()
      .subscribe(
        (data: any) => {
          this.users = data.data.items;
        this.dataSource.data = data.data.items;
        this.totalItems = data.data.totalElements;
          console.log(this.users);
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );

  }

  
  onPageChange(user: PageEvent): void {
    this.page = user.pageIndex;
    this.pageSize = user.pageSize;
    this.loadusers(this.page, this.pageSize);
  }


onStatusChange(id: number, newStatus: string): void {
  const data = {
    status: newStatus
  };

  this.userService.updateStatus(id.toString(), data).subscribe(
    (response: any) => {
      this.toastr.success('User status updated successfully');
      this.loadusers(this.page, this.pageSize);
    },
    (error: any) => {
      console.error('Error updating user status:', error);
      this.toastr.error('Failed to update user status');
    }
  );
}

}
