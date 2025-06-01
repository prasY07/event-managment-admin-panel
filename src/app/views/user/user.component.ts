import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { IconComponent, IconDirective, IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { UserService } from './service/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  providers: [IconSetService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public cilCalendar: any;
  public cilPencil: any;
  users: any[] = [];

  constructor(private iconSet: IconSetService,
    private userService:UserService,
    private toastr: ToastrService,
    
  ) {
    this.iconSet.icons = { ...freeSet };
    this.cilCalendar = freeSet.cilCalendar;
    this.cilPencil = freeSet.cilPencil;
  }

  ngOnInit(): void {
    this.loadusers();
  }

  loadusers() {
    this.userService.getUsers()
      .subscribe(
        (data: any) => {
          this.users = data.data.items;
          console.log(this.users);
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );

  }

}
