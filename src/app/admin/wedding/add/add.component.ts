import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeddingService } from '../service/wedding.service';
import { Subscription } from 'rxjs';

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
export class AddComponent implements OnInit, OnDestroy {
  weddingForm!: FormGroup;
  private registrationDateSubscriptions: Subscription[] = [];
  today: string = '';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private weddingService: WeddingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Set today's date in YYYY-MM-DD format for date input min attribute and default values
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    
    this.weddingForm = this.fb.group({
      groomName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      brideName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      groomFatherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      groomMotherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      brideFatherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      brideMotherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      coupleName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      weddingDate: ['', [Validators.required, this.validateWeddingDate.bind(this)]],
      registrationStartDate: [this.today, [Validators.required, this.validateRegistrationStartDate.bind(this)]],
      registrationEndDate: [this.today, [Validators.required, this.validateRegistrationEndDate.bind(this)]],
    });

    // Trigger validation when registration dates or wedding date change
    const regStartSub = this.weddingForm.get('registrationStartDate')?.valueChanges.subscribe((startDateValue) => {
      const endDateValue = this.weddingForm.get('registrationEndDate')?.value;
      
      // If start date becomes greater than end date, update end date to match start date
      if (startDateValue && endDateValue) {
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        if (startDate > endDate) {
          this.weddingForm.get('registrationEndDate')?.setValue(startDateValue, { emitEvent: false });
        }
      }
      
      this.weddingForm.get('registrationEndDate')?.updateValueAndValidity({ emitEvent: false });
    });
    if (regStartSub) this.registrationDateSubscriptions.push(regStartSub);

    const regEndSub = this.weddingForm.get('registrationEndDate')?.valueChanges.subscribe((endDateValue) => {
      const startDateValue = this.weddingForm.get('registrationStartDate')?.value;
      
      // If end date becomes less than start date, update end date to match start date
      if (startDateValue && endDateValue) {
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        if (endDate < startDate) {
          this.weddingForm.get('registrationEndDate')?.setValue(startDateValue, { emitEvent: false });
        }
      }
      
      this.weddingForm.get('registrationStartDate')?.updateValueAndValidity({ emitEvent: false });
      this.weddingForm.get('weddingDate')?.updateValueAndValidity({ emitEvent: false });
    });
    if (regEndSub) this.registrationDateSubscriptions.push(regEndSub);

    const weddingDateSub = this.weddingForm.get('weddingDate')?.valueChanges.subscribe(() => {
      this.weddingForm.get('registrationEndDate')?.updateValueAndValidity({ emitEvent: false });
    });
    if (weddingDateSub) this.registrationDateSubscriptions.push(weddingDateSub);
  }

  ngOnDestroy(): void {
    // Unsubscribe from valueChanges subscriptions
    this.registrationDateSubscriptions.forEach(sub => sub.unsubscribe());
  }

  // Getter for registration start date to use as min for end date
  get registrationStartDateMin(): string {
    const regStartDate = this.weddingForm?.get('registrationStartDate')?.value;
    return regStartDate || this.today;
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
    if (!this.weddingForm || !control.value) return null;
    
    const weddingDate = new Date(control.value);
    if (isNaN(weddingDate.getTime())) return null; // Invalid date
    
    const registrationEndDateValue = this.weddingForm.get('registrationEndDate')?.value;
    
    if (!registrationEndDateValue) return null; // Don't validate if registration end date is not set yet
    
    const registrationEndDate = new Date(registrationEndDateValue);
    if (isNaN(registrationEndDate.getTime())) return null; // Invalid date
    
    if (registrationEndDate >= weddingDate) {
      return { invalidWeddingDate: 'Wedding date must be after registration end date.' };
    }
    return null;
  }

  validateRegistrationStartDate(control: AbstractControl): ValidationErrors | null {
    if (!this.weddingForm || !control.value) return null;
    
    const regStartDate = new Date(control.value);
    if (isNaN(regStartDate.getTime())) return null; // Invalid date
    
    // Check if registration start date is >= today (ignore time, compare dates only)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const regStartDateOnly = new Date(regStartDate);
    regStartDateOnly.setHours(0, 0, 0, 0);
    
    if (regStartDateOnly < today) {
      return { invalidRegistrationStartDate: 'Registration start date must be today or a future date.' };
    }
    
    const regEndDateValue = this.weddingForm.get('registrationEndDate')?.value;
    
    if (!regEndDateValue) return null; // Don't validate if registration end date is not set yet
    
    const regEndDate = new Date(regEndDateValue);
    if (isNaN(regEndDate.getTime())) return null; // Invalid date
    
    // Compare dates only (ignore time) - reuse regStartDateOnly from above
    const regEndDateOnly = new Date(regEndDate);
    regEndDateOnly.setHours(0, 0, 0, 0);
    
    if (regStartDateOnly > regEndDateOnly) {
      return { invalidRegistrationStartDate: 'Registration start date must be less than or equal to registration end date.' };
    }
    return null;
  }

  validateRegistrationEndDate(control: AbstractControl): ValidationErrors | null {
    if (!this.weddingForm || !control.value) return null;
    
    const regEndDate = new Date(control.value);
    if (isNaN(regEndDate.getTime())) return null; // Invalid date
    
    const regStartDateValue = this.weddingForm.get('registrationStartDate')?.value;
    const weddingDateValue = this.weddingForm.get('weddingDate')?.value;
    
    // Validate against registration start date
    if (regStartDateValue) {
      const regStartDate = new Date(regStartDateValue);
      if (!isNaN(regStartDate.getTime())) {
        // Compare dates only (ignore time)
        const regStartDateOnly = new Date(regStartDate);
        regStartDateOnly.setHours(0, 0, 0, 0);
        const regEndDateOnly = new Date(regEndDate);
        regEndDateOnly.setHours(0, 0, 0, 0);
        
        if (regEndDateOnly < regStartDateOnly) {
          return { invalidRegistrationEndDate: 'Registration end date must be equal to or greater than registration start date.' };
        }
      }
    }
    
    // Validate against wedding date
    if (weddingDateValue) {
      const weddingDate = new Date(weddingDateValue);
      if (!isNaN(weddingDate.getTime()) && regEndDate >= weddingDate) {
        return { invalidRegistrationEndDate: 'Registration end date must be before wedding date.' };
      }
    }
    
    return null;
  }
}
