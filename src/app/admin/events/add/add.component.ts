import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user/service/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../service/event.service';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add',
  standalone: true,  // Ensure this is a standalone component
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxEditorComponent, NgxEditorMenuComponent
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit , OnDestroy {
  eventForm!: FormGroup;
  users: any = [];
  descriptionEditor!: Editor;
  privacyPolicyEditor!: Editor;
  private registrationDateSubscriptions: Subscription[] = [];
  today: string = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Set today's date in YYYY-MM-DD format for date input min attribute and default values
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      venue: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      category: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
      privacyPolicy: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
      startDate: ['', [Validators.required, this.validateStartDate.bind(this)]],
      endDate: ['', [Validators.required, this.validateEndDate.bind(this)]],
      registrationStartDate: [this.today, [Validators.required, this.validateRegistrationStartDate.bind(this)]],
      registrationEndDate: [this.today, [Validators.required, this.validateRegistrationDate.bind(this)]],
      eventStartTime: ['', [Validators.required]],
      eventEndTime: ['', [Validators.required]],
      sponsoredBy : ['',[Validators.required,Validators.minLength(3), Validators.maxLength(50)]],
      userId: [''],
      isFoc: [''],
      eventMemberType: ['', [Validators.required]],
      eventAccessType: ['', [Validators.required]],
      eventServices:['', [Validators.required]],
    });

    this.getUsers();
    this.descriptionEditor = new Editor();
    this.privacyPolicyEditor = new Editor();

    // Trigger validation when registration dates change
    const regStartSub = this.eventForm.get('registrationStartDate')?.valueChanges.subscribe((startDateValue) => {
      const endDateValue = this.eventForm.get('registrationEndDate')?.value;
      
      // If start date becomes greater than end date, update end date to match start date
      if (startDateValue && endDateValue) {
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        if (startDate > endDate) {
          this.eventForm.get('registrationEndDate')?.setValue(startDateValue, { emitEvent: false });
        }
      }
      
      this.eventForm.get('registrationEndDate')?.updateValueAndValidity({ emitEvent: false });
    });
    if (regStartSub) this.registrationDateSubscriptions.push(regStartSub);

    const regEndSub = this.eventForm.get('registrationEndDate')?.valueChanges.subscribe((endDateValue) => {
      const startDateValue = this.eventForm.get('registrationStartDate')?.value;
      
      // If end date becomes less than start date, update end date to match start date
      if (startDateValue && endDateValue) {
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        if (endDate < startDate) {
          this.eventForm.get('registrationEndDate')?.setValue(startDateValue, { emitEvent: false });
        }
      }
      
      this.eventForm.get('registrationStartDate')?.updateValueAndValidity({ emitEvent: false });
    });
    if (regEndSub) this.registrationDateSubscriptions.push(regEndSub);

    // Also trigger validation when event dates change
    const startDateSub = this.eventForm.get('startDate')?.valueChanges.subscribe(() => {
      this.eventForm.get('registrationStartDate')?.updateValueAndValidity({ emitEvent: false });
      this.eventForm.get('registrationEndDate')?.updateValueAndValidity({ emitEvent: false });
    });
    if (startDateSub) this.registrationDateSubscriptions.push(startDateSub);

    const endDateSub = this.eventForm.get('endDate')?.valueChanges.subscribe(() => {
      this.eventForm.get('registrationStartDate')?.updateValueAndValidity({ emitEvent: false });
      this.eventForm.get('registrationEndDate')?.updateValueAndValidity({ emitEvent: false });
    });
    if (endDateSub) this.registrationDateSubscriptions.push(endDateSub);

  }

  ngOnDestroy() {
    this.descriptionEditor.destroy();
    this.privacyPolicyEditor.destroy();
    // Unsubscribe from valueChanges subscriptions
    this.registrationDateSubscriptions.forEach(sub => sub.unsubscribe());
  }

  // Getter for registration start date to use as min for end date
  get registrationStartDateMin(): string {
    const regStartDate = this.eventForm?.get('registrationStartDate')?.value;
    return regStartDate || this.today;
  }
  getUsers() {
    this.userService.getUsersList().subscribe(
      (data: any) => {
        this.users = data.data;
      },
      error => {
        console.error('Error fetching users:', error);
        alert('No user found');
      }
    );
  }

  onSubmit(): void {
    
    if (this.eventForm.valid) {
      console.log("this.eventForm.value",this.eventForm.value);
      this.eventService.createEvent(this.eventForm.value).subscribe(
        response => {
          this.toastr.success('New Event successfully.', 'Success');
          this.router.navigate(['/admin/events']);
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
      alert('Please fill form');
    }
  }



  validateStartDate(control: AbstractControl): ValidationErrors | null {
  if (!this.eventForm || !control.value) return null;

  const startDate = new Date(control.value);
  const endDateValue = this.eventForm.get('endDate')?.value;
  
  if (!endDateValue) return null; // Don't validate if end date is not set yet
  
  const endDate = new Date(endDateValue);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null; // Invalid dates
  
  if (startDate >= endDate) {
    return { invalidStartDate: 'Start date must be before the end date.' };
  }

  return null;
}

validateEndDate(control: AbstractControl): ValidationErrors | null {
  if (!this.eventForm || !control.value) return null;

  const endDate = new Date(control.value);
  const startDateValue = this.eventForm.get('startDate')?.value;
  
  if (!startDateValue) return null; // Don't validate if start date is not set yet
  
  const startDate = new Date(startDateValue);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null; // Invalid dates
  
  if (endDate < startDate) {
    return { invalidEndDate: 'End date must be after the start date.' };
  }

  return null;
}

validateRegistrationStartDate(control: AbstractControl): ValidationErrors | null {
  if (!this.eventForm || !control.value) return null;
  
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
  
  const regEndDateValue = this.eventForm.get('registrationEndDate')?.value;
  const startDateValue = this.eventForm.get('startDate')?.value;
  const endDateValue = this.eventForm.get('endDate')?.value;

  // Validate against registration end date
  if (regEndDateValue) {
    const regEndDate = new Date(regEndDateValue);
    if (!isNaN(regEndDate.getTime())) {
      // Compare dates only (ignore time)
      const regStartDateOnly = new Date(regStartDate);
      regStartDateOnly.setHours(0, 0, 0, 0);
      const regEndDateOnly = new Date(regEndDate);
      regEndDateOnly.setHours(0, 0, 0, 0);
      
      if (regStartDateOnly > regEndDateOnly) {
        return { invalidRegistrationStartDate: 'Registration start date must be less than or equal to registration end date.' };
      }
    }
  }

  // Validate against event start date
  if (startDateValue) {
    const startDate = new Date(startDateValue);
    if (!isNaN(startDate.getTime()) && regStartDate >= startDate) {
      return { invalidRegistrationStartDate: 'Registration start date must be before event start date.' };
    }
  }

  // Validate against event end date
  if (endDateValue) {
    const endDate = new Date(endDateValue);
    if (!isNaN(endDate.getTime()) && regStartDate >= endDate) {
      return { invalidRegistrationStartDate: 'Registration start date must be before event end date.' };
    }
  }

  return null;
}

validateRegistrationDate(control: AbstractControl): ValidationErrors | null {
  if (!this.eventForm || !control.value) return null;

  const regEndDate = new Date(control.value);
  if (isNaN(regEndDate.getTime())) return null; // Invalid date
  
  const regStartDateValue = this.eventForm.get('registrationStartDate')?.value;
  const startDateValue = this.eventForm.get('startDate')?.value;
  const endDateValue = this.eventForm.get('endDate')?.value;

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
        return { invalidRegistrationDate: 'Registration end date must be equal to or greater than registration start date.' };
      }
    }
  }

  // Validate against event start date
  if (startDateValue) {
    const startDate = new Date(startDateValue);
    if (!isNaN(startDate.getTime()) && regEndDate >= startDate) {
      return { invalidRegistrationDate: 'Registration end date must be before event start date.' };
    }
  }

  // Validate against event end date
  if (endDateValue) {
    const endDate = new Date(endDateValue);
    if (!isNaN(endDate.getTime()) && regEndDate >= endDate) {
      return { invalidRegistrationDate: 'Registration end date must be before event end date.' };
    }
  }

  return null;
}

}
