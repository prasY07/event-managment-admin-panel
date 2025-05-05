import { Component } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-add',
  imports: [RowComponent,ColComponent,CardComponent,
      CardHeaderComponent,
      CardBodyComponent,],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

}
