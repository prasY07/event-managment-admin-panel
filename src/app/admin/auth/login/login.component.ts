import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { TokenService } from '../../service/token.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService : AuthService,
    private tokenService: TokenService
  ) { }


 ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email, // must be a valid email
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),  // at least 8 chars
          Validators.maxLength(20), // max 20 chars
          // Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).+$')
          // must contain 1 uppercase, 1 lowercase, 1 number, 1 special char
        ],
      ],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
       this.authService.login(this.loginForm.value).subscribe(
        response => {
          // localStorage.setItem("token",response.data.token);
          this.tokenService.setToken(response.data.token);
          this.toastr.success('Login successfully.', 'Success');
          this.router.navigate(['/admin/dashboard']);
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
      this.loginForm.markAllAsTouched();
    }
  }

}
