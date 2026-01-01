import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeddingService } from '../service/wedding.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  weddingForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private weddingService: WeddingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.weddingForm = this.fb.group({
      groomName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      brideName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      groomFatherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      groomMotherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      brideFatherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      brideMotherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      coupleName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      weddingDate: ['', [Validators.required, this.validateWeddingDate.bind(this)]],
      registrationStartDate: ['', [Validators.required, this.validateRegistrationStartDate.bind(this)]],
      registrationEndDate: ['', [Validators.required, this.validateRegistrationEndDate.bind(this)]],
    });
  }

  onSubmit(): void {
    if (this.weddingForm.valid) {
      const weddingData = {
        groomName: this.weddingForm.get('groomName')?.value,
        brideName: this.weddingForm.get('brideName')?.value,
        groomFatherName: this.weddingForm.get('groomFatherName')?.value,
        groomMotherName: this.weddingForm.get('groomMotherName')?.value,
        brideFatherName: this.weddingForm.get('brideFatherName')?.value,
        brideMotherName: this.weddingForm.get('brideMotherName')?.value,
      coupleName: this.weddingForm.get('coupleName')?.value,
        weddingDate: this.weddingForm.get('weddingDate')?.value,
        registrationStartDate: this.weddingForm.get('registrationStartDate')?.value,
        registrationEndDate: this.weddingForm.get('registrationEndDate')?.value,
      };

      this.weddingService.createWedding(weddingData).subscribe(
        response => {
          this.toastr.success('Wedding created successfully.', 'Success');
          this.router.navigate(['/admin/wedding']);
        },
        error => {
          let errorMsg = 'OOPS Something Went Wrong';
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          }
          this.toastr.error(errorMsg, 'Error');
        }
      );
    } else {
      this.weddingForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }

  validateWeddingDate(control: AbstractControl): ValidationErrors | null {
    if (!this.weddingForm) return null;
    const weddingDate = new Date(control.value);
    const registrationEndDate = new Date(this.weddingForm.get('registrationEndDate')?.value);
    
    if (weddingDate && registrationEndDate && registrationEndDate >= weddingDate) {
      return { invalidWeddingDate: 'Wedding date must be after registration end date.' };
    }
    return null;
  }

  validateRegistrationStartDate(control: AbstractControl): ValidationErrors | null {
    if (!this.weddingForm) return null;
    const regStartDate = new Date(control.value);
    const regEndDate = new Date(this.weddingForm.get('registrationEndDate')?.value);
    
    if (regStartDate && regEndDate && regStartDate >= regEndDate) {
      return { invalidRegistrationStartDate: 'Registration start date must be before registration end date.' };
    }
    return null;
  }

  validateRegistrationEndDate(control: AbstractControl): ValidationErrors | null {
    if (!this.weddingForm) return null;
    const regEndDate = new Date(control.value);
    const regStartDate = new Date(this.weddingForm.get('registrationStartDate')?.value);
    const weddingDate = new Date(this.weddingForm.get('weddingDate')?.value);
    
    if (regEndDate && regStartDate && regEndDate <= regStartDate) {
      return { invalidRegistrationEndDate: 'Registration end date must be after registration start date.' };
    }
    
    if (regEndDate && weddingDate && regEndDate >= weddingDate) {
      return { invalidRegistrationEndDate: 'Registration end date must be before wedding date.' };
    }
    return null;
  }
}
