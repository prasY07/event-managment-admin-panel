import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { IconComponent, IconDirective, IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';

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
    IconComponent
  ],
  providers: [IconSetService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public cilCalendar: any;

  constructor(private iconSet: IconSetService) {
    // Register freeSet into iconSet
    this.iconSet.icons = { ...freeSet };

    // Assign only the specific icon you want
    this.cilCalendar = freeSet.cilCalendar;
  }

  ngOnInit(): void {
    console.log('cilCalendar:', this.cilCalendar); // This should log the path data
  }
}
