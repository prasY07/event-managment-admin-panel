import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user/service/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../service/event.service';

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
    NgxSummernoteModule  // Ensure NgxSummernoteModule is here
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  eventForm!: FormGroup;
  users: any = [];
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
    private router: Router
  ) {}

  ngOnInit(): void {
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
      eventMemberType: ['', [Validators.required]],
      eventAccessType: ['', [Validators.required]]
    });

    this.getUsers();
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
}
