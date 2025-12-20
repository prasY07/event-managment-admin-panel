import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ConfirmationDialogComponent {

  @Input() message: string = '';
  @Input() confirmButtonText: string = 'Confirm';
  @Input() cancelButtonText: string = 'Cancel';
  @Output() confirmed = new EventEmitter<boolean>();

  public data: { message: string } = { message: '' };

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
  ) { }

  onConfirm(): void {
    this.confirmed.emit(true);
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.confirmed.emit(false);
    this.dialogRef.close(false);
  }

}
