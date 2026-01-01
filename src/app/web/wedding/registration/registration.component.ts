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
})
export class WeddingRegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  onwardFile?: File | null = null;
  returnFile?: File | null = null;
  weddingId = '';
  coupleName: string | null = null;
  isSubmitting = false;

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
        departureCity: [''],
        destinationCity: [''],
        carrierName: [''],
        carrierNumber: [''],
        coPassengers: this.fb.array([])
      }),
      returnJourney: this.fb.group({
        mode: ['FLIGHT'],
        departureDate: [''],
        departureTime: [''],
        destinationCity: [''],
        carrierName: [''],
        carrierNumber: ['']
      })
    });

    // Ensure weddingId is present (snapshot fallback) and load couple name
    if (!this.weddingId) {
      const id = this.aRoute.snapshot.params['id'];
      if (id) this.weddingId = id;
    }

    this.loadWeddingDetails();
  }

  private loadWeddingDetails() {
    if (!this.weddingId) {
      // Try query param 'wedding-name' as a fallback
      this.coupleName = this.aRoute.snapshot.queryParamMap.get('wedding-name') || null;
      return;
    }

    this.weddingService.getWeddingDetails(this.weddingId).subscribe(
      (res: any) => {
        const payload = res?.data ?? res;
        if (!payload) {
          // fallback to query param if API didn't return details
          this.coupleName = this.aRoute.snapshot.queryParamMap.get('wedding-name') || null;
          return;
        }

        if (typeof payload === 'string') {
          // payload is likely an image URL, not details
          this.coupleName = this.aRoute.snapshot.queryParamMap.get('wedding-name') || null;
          return;
        }

        // Try common field names, fallback to groom + bride
        this.coupleName = payload.coupleName || payload.couple_name ||
          ((payload.groomName || payload.groom_name) && (payload.brideName || payload.bride_name)
            ? `${payload.groomName || payload.groom_name} & ${payload.brideName || payload.bride_name}`
            : (payload.groomName || payload.brideName || null));
      },
      (err: any) => {
        console.warn('Failed to load wedding details for registration page', err);
        this.coupleName = this.aRoute.snapshot.queryParamMap.get('wedding-name') || null;
      }
    );
  }

  get coPassengers(): FormArray {
    return this.registerForm.get('onwardJourney')!.get('coPassengers') as FormArray;
  }

  addCoPassenger() {
    this.coPassengers.push(this.fb.group({ name: [''], age: [null], relationship: [''] }));
  }

  removeCoPassenger(index: number) {
    this.coPassengers.removeAt(index);
  }

  onOnwardFileChange(event: any) {
    const f = event.target.files?.[0];
    if (f) this.onwardFile = f;
  }

  onReturnFileChange(event: any) {
    const f = event.target.files?.[0];
    if (f) this.returnFile = f;
  }

  submit() {
    if (!this.registerForm.valid) {
      this.toastr.error('Please fill required fields', 'Error');
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
      (res: any) => {
        this.isSubmitting = false;
        this.toastr.success('Registration successful', 'Success');
        this.registerForm.reset();
        setTimeout(() => {
          window.location.reload();
        }, 1000); 
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
