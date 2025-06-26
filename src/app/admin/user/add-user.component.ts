import { Component, OnInit } from '@angular/core';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './service/user.service';
import { Router } from '@angular/router';
import { CountryService } from '../../common/Service/country.service';

const allowedRoles = ['EVENT_MANAGER', 'INDIVIDUAL'];

@Component({
  selector: 'app-add-user',
  imports: [RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-user.component.html',
  // styleUrl: './add-user.component.scss'
})

export class AddUserComponent implements OnInit {
  userForm!: FormGroup;

  allCountry : any = [];
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private countryService : CountryService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$'),Validators.pattern('^[6-9][0-9]{9}$') ]],
      role: ['', Validators.required],
      countryCode:['',Validators.required],
    });

    this.getAllCountry();
  }

  onSubmit(): void {

    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const selectedRole = formValue.role;

      if (!allowedRoles.includes(selectedRole)) {
        alert('Invalid role selected!');
        return; // stop submission
      }
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


  getAllCountry()
  {
this.countryService.getAllCountry().subscribe(
      (data: any) => {
        this.allCountry = data.data;
        console.log("allCountry", this.allCountry);
      },
      error => {
        console.error('Error fetching users:', error);
        alert('No user found');
      }
    );
  }
}
