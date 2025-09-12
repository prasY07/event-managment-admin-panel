import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user/service/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../service/event.service';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';

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
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      venue: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      category: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
      privacyPolicy: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
      startDate: ['', [Validators.required, this.validateStartDate.bind(this)]],
      endDate: ['', [Validators.required, this.validateEndDate.bind(this)]],
      registrationEndDate: ['', [Validators.required, this.validateRegistrationDate.bind(this)]],
      eventStartTime: ['', [Validators.required]],
      eventEndTime: ['', [Validators.required]],

      userId: [''],
      eventMemberType: ['', [Validators.required]],
      eventAccessType: ['', [Validators.required]],
      eventServices:['', [Validators.required]],
    });

    this.getUsers();
    this.descriptionEditor = new Editor();
    this.privacyPolicyEditor = new Editor();


  }

  ngOnDestroy() {
    this.descriptionEditor.destroy();
    this.privacyPolicyEditor.destroy();
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
  if (!this.eventForm) return null;

  const startDate = new Date(control.value);
  const endDate = new Date(this.eventForm.get('endDate')?.value);

  if (startDate && endDate && startDate >= endDate) {
    return { invalidStartDate: 'Start date must be before the end date.' };
  }

  return null;
}

validateEndDate(control: AbstractControl): ValidationErrors | null {
  if (!this.eventForm) return null;

  const endDate = new Date(control.value);
  const startDate = new Date(this.eventForm.get('startDate')?.value);

  if (startDate && endDate && endDate < startDate) {
    return { invalidEndDate: 'End date must be after the start date.' };
  }

  return null;
}

validateRegistrationDate(control: AbstractControl): ValidationErrors | null {
  if (!this.eventForm) return null;

  const regDate = new Date(control.value);
  const startDate = new Date(this.eventForm.get('startDate')?.value);
  const endDate = new Date(this.eventForm.get('endDate')?.value);

  if (regDate && startDate && regDate >= startDate) {
    return { invalidRegistrationDate: 'Must be before event start date.' };
  }

  if (regDate && endDate && regDate >= endDate) {
    return { invalidRegistrationDate: 'Must be before event end date.' };
  }

  return null;
}

}
