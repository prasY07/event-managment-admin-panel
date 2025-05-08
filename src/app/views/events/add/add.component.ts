import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user/service/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add',
  imports: [RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
  eventForm!: FormGroup;
  users:any = [];

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    // private eventService: EventS,
    private router: Router
  ) { 
    
  }
  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      venue: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      registrationFees: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
      category: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      location: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      userId: [''],
    });
    this.getUsers();
  }
  getUsers(){
    this.userService.getUsersList()
    .subscribe(
      (data: any) => {
        this.users = data.data;
        console.log("users",this.users);
      },
      error => {
        console.error('Error fetching users:', error);
        alert("No user found");
      }
    );
  }

  onSubmit(): void {

    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      console.log("before submit", this.eventForm.value);

      this.userService.createUser(this.eventForm.value)
        .subscribe(
          response => {
            this.toastr.success('New User add successfully.', 'Success');
            this.router.navigate(['/users']);
          },
          error => {
            let errorMsg = 'OOPS Something Went Wrong';
            if (error.error && error.error.message) {
              console.log("here", error.error.message);
              errorMsg = error.error.message; // If error response has a message field
            }
            this.toastr.error(errorMsg, 'Error');
          }
        );
    } else {
      alert('Please fill form');
    }

  }
}
