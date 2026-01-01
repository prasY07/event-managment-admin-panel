import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WeddingService } from '../service/wedding.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-upload',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './card-upload.component.html',
  styleUrl: './card-upload.component.scss'
})
export class CardUploadComponent implements OnInit {
  @Input() weddingId: string = '';
  cardUpload!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private weddingService: WeddingService,
  ) {}

  ngOnInit(): void {
    this.cardUpload = this.fb.group({
      file: [null, [Validators.required, this.imageTypeValidator]]
    });
  }

  imageTypeValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (file && file.type) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        return { invalidImageType: true };
      }
    }
    return null;
  }

  closeModal() {
    const modalElement = document.getElementById('cardUploadModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.cardUpload.patchValue({ file });
      this.cardUpload.get('file')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.cardUpload.valid) {
      this.loading = true;
  
      const file = this.cardUpload.get('file')?.value;
      const formData = new FormData();
      formData.append('file', file);
      
      this.weddingService.uploadCard(formData, this.weddingId).subscribe(
        response => {
          this.toastr.success('Wedding card uploaded successfully.', 'Success');
          this.loading = false;
          this.closeModal();
          this.cardUpload.reset();
        },
        error => {
          const errorMsg = error.error?.message || 'OOPS Something Went Wrong';
          this.toastr.error(errorMsg, 'Error');
          this.loading = false;
        }
      );
    } else {
      this.toastr.error('Please select a valid image file.', 'Error');
    }
  }
}




