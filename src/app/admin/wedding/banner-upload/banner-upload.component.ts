import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WeddingService } from '../service/wedding.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-banner-upload',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './banner-upload.component.html',
  styleUrl: './banner-upload.component.scss'
})
export class BannerUploadComponent implements OnInit {
  @Input() weddingId: string = '';
  bannerUpload!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private weddingService: WeddingService,
  ) {}

  ngOnInit(): void {
    this.bannerUpload = this.fb.group({
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
    const modalElement = document.getElementById('imageUploadModal');
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
    console.log("file",file);
    if (file) {
      this.bannerUpload.patchValue({ file });
      this.bannerUpload.get('file')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    console.log("test");
    if (this.bannerUpload.valid) {
      this.loading = true;
  
      const file = this.bannerUpload.get('file')?.value;
      const formData = new FormData();
      formData.append('file', file);
      
      console.log("file",file);
      this.weddingService.uploadBanner(formData, this.weddingId).subscribe(
        response => {
          this.toastr.success('Banner uploaded successfully.', 'Success');
          this.loading = false;
          this.closeModal();
        },
        error => {
          const errorMsg = error.error?.message || 'OOPS Something Went Wrong';
          this.toastr.error(errorMsg, 'Error');
          this.loading = false;
        }
      );
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  
  
}




