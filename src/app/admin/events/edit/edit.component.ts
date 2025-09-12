import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user/service/user.service';
import { EventService } from '../service/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';


@Component({
  selector: 'app-edit',
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
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit,OnDestroy {
  eventForm!: FormGroup;
  users: any = [];
  eventId: string = '';
  event: any = {};

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
    private router: Router,
    private aRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      this.eventId = params['id'];
    });
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
    this.getEvent();
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
      this.eventService.updateEvent(this.eventForm.value, this.eventId).subscribe(
        response => {
          this.toastr.success('Event Update successfully.', 'Success');
          this.router.navigate(['/admin/events']);
        },


        error => {
          let errorMsg = 'OOPS Something Went wrong';
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

  getEvent() {
    this.eventService.getSingleEvent(this.eventId).subscribe((data: any) => {
      this.event = data;
      console.log("single data",this.event);
      this.eventForm.patchValue({
        title: this.event.data.title,
        address: this.event.data.address,
        venue: this.event.data.venue,
        category: this.event.data.category,
        startDate: this.event.data.startDate,
        endDate: this.event.data.endDate,
        userId: this.event.data.user.id,
        description: this.event.data.description,           // <-- this sets Summernote content
        privacyPolicy: this.event.data.privacyPolicy ,
         registrationEndDate:this.event.data.lastRegDate,
         eventStartTime:this.event.data.eventStartTime,
         eventEndTime:this.event.data.eventEndTime,
        
      });


    });
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
