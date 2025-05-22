import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user/service/user.service';
import { EventService } from '../service/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { NgxSummernoteModule } from 'ngx-summernote';


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
    NgxSummernoteModule  // Ensure NgxSummernoteModule is here
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  eventForm!: FormGroup;
  users: any = [];
  eventId: string = '';
  event: any = {};


  summernoteConfig: any = {
    placeholder: 'Enter text...',
    tabsize: 2,
    height: '300px',
    toolbar: [
      ['style', ['style']], // Enables paragraph, h1, h2, etc.
      ['font', ['bold', 'italic', 'underline', 'strikethrough']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['insert', ['link']],
      ['view', ['codeview']]
    ],
    styleTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],  // Allow these in dropdown
    fontNames: ['Arial', 'Comic Sans MS', 'Courier New']
  };

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
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      privacyPolicy: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      userId: [''],
      eventMemberType: [''],
      eventAccessType: ['']
    });

    this.getUsers();
    this.getEvent();
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
      this.event = data;;
      this.eventForm.patchValue({
        title: this.event.data.title,
        address: this.event.data.address,
        venue: this.event.data.venue,
        category: this.event.data.category,
        startDate: this.event.data.startDate,
        endDate: this.event.data.endDate,
        userId: this.event.data.user.id,
        description: this.event.data.description,           // <-- this sets Summernote content
        privacyPolicy: this.event.data.privacyPolicy  
        
      });


    });
  }

}
