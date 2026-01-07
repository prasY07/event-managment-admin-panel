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
    console.log('Guest data in dialog:', JSON.stringify(guest, null, 2));
    console.log('Onward Journey:', this.onwardJourney);
    console.log('Return Journey:', this.returnJourney);
    console.log('Onward Journey keys:', Object.keys(this.onwardJourney));
    console.log('Return Journey keys:', Object.keys(this.returnJourney));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  get onwardJourney() {
    if (!this.guest) return {};
    
    // Try multiple possible property names
    let journey = this.guest.onwardJourney || 
                  this.guest.onward_journey || 
                  this.guest.onwardJourneyData ||
                  this.guest['onwardJourney'] ||
                  {};
    
    // If it's a string, try to parse it
    if (typeof journey === 'string' && journey.trim()) {
      try {
        journey = JSON.parse(journey);
      } catch (e) {
        console.warn('Failed to parse onwardJourney string:', e);
        return {};
      }
    }
    
    // Ensure it's an object
    return journey && typeof journey === 'object' ? journey : {};
  }

  get returnJourney() {
    if (!this.guest) return {};
    
    // Try multiple possible property names
    let journey = this.guest.returnJourney || 
                  this.guest.return_journey || 
                  this.guest.returnJourneyData ||
                  this.guest['returnJourney'] ||
                  {};
    
    // If it's a string, try to parse it
    if (typeof journey === 'string' && journey.trim()) {
      try {
        journey = JSON.parse(journey);
      } catch (e) {
        console.warn('Failed to parse returnJourney string:', e);
        return {};
      }
    }
    
    // Ensure it's an object
    return journey && typeof journey === 'object' ? journey : {};
  }

  hasOnwardJourney(): boolean {
    const journey = this.onwardJourney;
    return journey && typeof journey === 'object' && Object.keys(journey).length > 0;
  }

  hasReturnJourney(): boolean {
    const journey = this.returnJourney;
    return journey && typeof journey === 'object' && Object.keys(journey).length > 0;
  }
}

