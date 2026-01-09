import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WeddingService } from '../service/wedding.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bulk-guest-upload',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './bulk-guest-upload.component.html',
  styleUrl: './bulk-guest-upload.component.scss'
})
export class BulkGuestUploadComponent implements OnInit {
  @Input() weddingId: string = '';
  uploadForm!: FormGroup;
  loading = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private weddingService: WeddingService,
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      file: [null, [Validators.required, this.excelTypeValidator]]
    });
  }

  excelTypeValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (file && file.type) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/vnd.ms-excel.sheet.macroEnabled.12' // .xlsm
      ];
      if (!allowedTypes.includes(file.type)) {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  closeModal() {
    const modalElement = document.getElementById('bulkGuestUploadModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
    // Reset form
    this.uploadForm.reset();
    this.selectedFile = null;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check file extension as fallback
      const fileName = file.name.toLowerCase();
      const validExtensions = ['.xlsx', '.xls', '.xlsm'];
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      
      if (!hasValidExtension) {
        this.toastr.error('Please select a valid Excel file (.xlsx, .xls, .xlsm)', 'Invalid File');
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
      this.uploadForm.patchValue({ file });
      this.uploadForm.get('file')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      this.loading = true;
  
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      
      this.weddingService.bulkUploadGuests(this.weddingId, formData).subscribe(
        response => {
          this.toastr.success('Guests uploaded successfully.', 'Success');
          this.loading = false;
          this.closeModal();
        },
        error => {
          const errorMsg = error.error?.message || error.error?.error || 'Failed to upload guests. Please check the file format.';
          this.toastr.error(errorMsg, 'Error');
          this.loading = false;
        }
      );
    } else {
      if (!this.selectedFile) {
        this.toastr.error('Please select an Excel file to upload.', 'Error');
      } else {
        this.toastr.error('Please select a valid Excel file.', 'Error');
      }
    }
  }
}

