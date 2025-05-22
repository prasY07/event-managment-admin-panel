import { Component, OnInit } from '@angular/core';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  imports: [RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {

    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      console.log("before submit", this.userForm.value);

      this.userService.createUser(this.userForm.value)
        .subscribe(
          response => {
            this.toastr.success('New User add successfully.', 'Success');
            this.router.navigate(['/admin/users']);
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

  // Getter for accessing form controls
  get f() {
    return this.userForm.controls; // This allows you to use 'f.name' and 'f.email' in the template
  }

}
