import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebWeddingService } from '../../services/webwedding.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wedding-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class WeddingRegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  onwardFile?: File | null = null;
  returnFile?: File | null = null;
  weddingId = '';
  coupleName: string | null = null;
  isSubmitting = false;
  onwardFileError = '';
  returnFileError = '';
  currentStep = 1;
  totalSteps = 3;

  constructor(
    private fb: FormBuilder,
    private weddingService: WebWeddingService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {
    this.aRoute.params.subscribe(p => this.weddingId = p['id']);
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['MALE', Validators.required],
      onwardJourney: this.fb.group({
        mode: ['FLIGHT'],
        arrivalDate: [''],
        arrivalTime: [''],
        departureCity: ['', Validators.required],
        destinationCity: ['', Validators.required],
        carrierName: [''],
        carrierNumber: [''],
        coPassengers: this.fb.array([]) // This is the coPassengers FormArray
      }),
      returnJourney: this.fb.group({
        mode: ['FLIGHT'],
        departureDate: [''],
        departureTime: [''],
        destinationCity: ['', Validators.required],
        carrierName: [''],
        carrierNumber: ['']
      })
    });

    this.loadWeddingDetails();
  }

  private loadWeddingDetails() {
    if (!this.weddingId) {
      this.coupleName = this.aRoute.snapshot.queryParamMap.get('wedding-name') || null;
      return;
    }

    this.weddingService.getWeddingDetails(this.weddingId).subscribe(
      (res: any) => {
        const payload = res?.data ?? res;
        if (!payload) return;

        this.coupleName = payload.coupleName || payload.couple_name ||
          ((payload.groomName && payload.brideName) ? `${payload.groomName} & ${payload.brideName}` : payload.groomName || payload.brideName || null);
      },
      (err: any) => {
        console.warn('Failed to load wedding details', err);
        this.coupleName = this.aRoute.snapshot.queryParamMap.get('wedding-name') || null;
      }
    );
  }

  get coPassengers(): FormArray {
    return this.registerForm.get('onwardJourney.coPassengers') as FormArray;
  }

  getCoPassengersArray(parent: string): FormArray {
    return this.registerForm.get(`${parent}.coPassengers`) as FormArray;
  }

  createCoPassenger(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      age: [null, Validators.required],
      relationship: ['', Validators.required]
    });
  }

  addCoPassenger() {
    const coPassenger = this.createCoPassenger();
    this.coPassengers.push(coPassenger);
    // Mark as untouched and pristine so errors don't show immediately
    coPassenger.markAsUntouched();
    coPassenger.markAsPristine();
  }

  removeCoPassenger(index: number) {
    this.coPassengers.removeAt(index);
  }

  onOnwardFileChange(event: any) {
    const f = event.target.files?.[0];
    if (f) {
      this.onwardFile = f;
      this.onwardFileError = '';
    }
  }

  onReturnFileChange(event: any) {
    const f = event.target.files?.[0];
    if (f) {
      this.returnFile = f;
      this.returnFileError = '';
    }
  }

  /**
   * Check if a form control is invalid and has been touched
   * Shows error state only after user interaction
   */
  isInvalid(controlName: string, parent: string = ''): boolean {
    const control = parent 
      ? this.registerForm.get(`${parent}.${controlName}`) 
      : this.registerForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isStepValid(step: number): boolean {
    switch(step) {
      case 1:
        return this.registerForm.get('fullName')?.valid === true &&
               this.registerForm.get('mobileNumber')?.valid === true &&
               this.registerForm.get('email')?.valid === true &&
               this.registerForm.get('gender')?.valid === true;
      case 2:
        return this.registerForm.get('onwardJourney.departureCity')?.valid === true &&
               this.registerForm.get('onwardJourney.destinationCity')?.valid === true;
      case 3:
        return this.registerForm.get('returnJourney.destinationCity')?.valid === true;
      default:
        return false;
    }
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    } else {
      this.registerForm.markAllAsTouched();
      if (this.currentStep === 1) {
        this.toastr.warning('Please fill all required personal information fields', 'Incomplete');
      } else if (this.currentStep === 2) {
        this.toastr.warning('Please fill all required onward journey fields', 'Incomplete');
      } else if (this.currentStep === 3) {
        this.toastr.warning('Please fill all required return journey fields', 'Incomplete');
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps && step <= this.currentStep + 1) {
      this.currentStep = step;
    }
  }

  /**
   * Check if a co-passenger field is invalid and has been touched
   * Shows error state only after user interaction
   */
  isCoPassengerFieldInvalid(control: any, fieldName: string): boolean {
    const field = control.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Highlight invalid fields
      this.toastr.error('Please fill required fields', 'Error');
      return;
    }

    const onwardMode = this.registerForm.get('onwardJourney.mode')?.value;
    const returnMode = this.registerForm.get('returnJourney.mode')?.value;

    // Only require ticket file if mode is not ROAD
    if (onwardMode !== 'ROAD' && !this.onwardFile) {
      this.onwardFileError = 'Onward ticket file is required';
      this.toastr.error('Onward ticket file is required', 'Error');
      return;
    }

    if (returnMode !== 'ROAD' && !this.returnFile) {
      this.returnFileError = 'Return ticket file is required';
      this.toastr.error('Return ticket file is required', 'Error');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formValue = this.registerForm.value;

    const guestData: any = {
      weddingId: parseInt(this.weddingId, 10),
      fullName: formValue.fullName,
      mobileNumber: formValue.mobileNumber,
      email: formValue.email,
      gender: formValue.gender,
      onwardJourney: formValue.onwardJourney,
      returnJourney: formValue.returnJourney
    };

    const formData = new FormData();
    formData.append('guestData', JSON.stringify(guestData));
    if (this.onwardFile) formData.append('onwardTicketFile', this.onwardFile, this.onwardFile.name);
    if (this.returnFile) formData.append('returnTicketFile', this.returnFile, this.returnFile.name);

    this.weddingService.registerGuest(formData).subscribe(
      () => {
        this.toastr.success('Registration successful', 'Success');
        // Refresh the page after a short delay to show success message
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      (err: any) => {
        this.isSubmitting = false;
        console.error(err);
        const msg = err?.error?.message || 'Registration failed';
        this.toastr.error(msg, 'Error');
      }
    );
  }
}