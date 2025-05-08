import { Component, OnInit } from '@angular/core';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent} from '@coreui/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {UserService} from '../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-update-user',
  imports: [RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent,ReactiveFormsModule,FormsModule,CommonModule],

  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent {
  userForm!: FormGroup;
  userId: string='';
  user:any = {};

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private aRoute: ActivatedRoute,
  ) { 
    
  }
 

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      this.userId = params['id'];
    });
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });



    this.userService.getSingleUsers(this.userId).subscribe((data:any) => {
      this.user = data;
      console.log("------------",this.user);
      this.userForm.get('name')?.setValue(this.user.data.name);
      this.userForm.get('email')?.setValue(this.user.data.email);


    });
  }
  onSubmit(): void {

    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      console.log("before submit",this.userForm.value);

     this.userService.updateUser(this.userForm.value,this.userId)
     .subscribe(
       response => {
       this.toastr.success('User update successfully.', 'Success');
         this.router.navigate(['/users']);
       //  this.isLoading = false;

       },
       error => {
        let errorMsg = 'OOPS Something Went Wrong';
          if (error.error && error.error.message) {
            console.log("here",error.error.message);
            errorMsg = error.error.message; // If error response has a message field
          }

         this.toastr.error(errorMsg, 'Error');
        //  this.isLoading = false;

       }
     );
    } else {
      alert('Please fill form');
      //  this.isLoading = false;

    }

  }

  // Getter for accessing form controls
  get f() {
    return this.userForm.controls; // This allows you to use 'f.name' and 'f.email' in the template
  }
}
