import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { WebEventService } from '../../services/webevent.service';


@Component({
  selector: 'app-registration',
  imports: [FormModule,ReactiveFormsModule,CommonModule ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent  implements OnInit{

  eventUserRegisterForm!: FormGroup;


   constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
     private eventService: WebEventService,
  ) {}

  ngOnInit()
  {
    this.eventUserRegisterForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          address: ['', Validators.required],
          pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
          eventSource: ['', Validators.required],
          gender: ['', Validators.required],
          memberType: ['', Validators.required],
          countryId:['',Validators.required],
          dob:['',Validators.required],
          phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        });
  }


  onSubmit()
  {

    if (this.eventUserRegisterForm.valid) {
      console.log("this.eventUserRegisterForm.value",this.eventUserRegisterForm.value);
      this.eventService.registrationEvent(this.eventUserRegisterForm.value).subscribe(
        response => {
          this.toastr.success('Event Registration successfully.', 'Success');
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
