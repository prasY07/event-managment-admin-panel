import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { EventService } from '../service/event.service';
import { MatTableDataSource, MatTableModule  } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-event-user-list',
  imports: [RowComponent,
    ColComponent,
    // TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RouterLink,
    // IconDirective,
    // IconComponent,
    // CommonModule,
       MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './event-user-list.component.html',
  styleUrl: './event-user-list.component.scss'
})
export class EventUserListComponent implements OnInit {

  displayedColumns: string[] = ['position','name', 'email', 'registrationDate', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  totalItems = 0;
  pageSize = 1;
  page = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  users: any[] = [];

  eventId = '';

  constructor(
    private eventService: EventService,
    private aRoute: ActivatedRoute,
  ) {
    this.aRoute.params.subscribe(params => {
      this.eventId = params['id'];
    });
  }

  ngOnInit(): void {
    this.getAllEventUsers(this.page, this.pageSize);
  }



  getAllEventUsers(page: number, size: number): void {
    this.eventService.getEventsRegisterUser(page, this.eventId).subscribe(
      (res: any) => {
        this.dataSource.data = res.data.items;
        this.totalItems = res.data.totalElements;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

   onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllEventUsers(this.page, this.pageSize);
  }

}
