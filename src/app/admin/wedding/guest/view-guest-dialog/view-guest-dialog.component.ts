import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-view-guest-dialog',
  templateUrl: './view-guest-dialog.component.html',
  styleUrls: ['./view-guest-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent
  ],
})
export class ViewGuestDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ViewGuestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public guest: any
  ) {
    console.log('Guest data in dialog:', guest);
    console.log('Onward Journey:', this.onwardJourney);
    console.log('Return Journey:', this.returnJourney);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  get onwardJourney() {
    // Handle both direct property and nested structure
    const journey = this.guest?.onwardJourney || this.guest?.onward_journey || {};
    // If it's a string, try to parse it
    if (typeof journey === 'string') {
      try {
        return JSON.parse(journey);
      } catch (e) {
        return {};
      }
    }
    return journey;
  }

  get returnJourney() {
    // Handle both direct property and nested structure
    const journey = this.guest?.returnJourney || this.guest?.return_journey || {};
    // If it's a string, try to parse it
    if (typeof journey === 'string') {
      try {
        return JSON.parse(journey);
      } catch (e) {
        return {};
      }
    }
    return journey;
  }
}

