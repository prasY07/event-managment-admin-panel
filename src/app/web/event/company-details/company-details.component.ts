import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { WebEventService } from '../../services/webevent.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-details',
  imports: [FormModule,ReactiveFormsModule,CommonModule],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent implements OnInit {

  businessForm!: FormGroup;

  constructor(private fb: FormBuilder,
 private eventService: WebEventService,
     private toastr: ToastrService,
 

  ) {}

  ngOnInit(): void {
    this.businessForm = this.fb.group({
      fname: ['', [Validators.required, Validators.minLength(2)]],
      lname: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      gst: ['', [Validators.pattern(/^[0-9A-Z]{15}$/)]], // optional but pattern if entered
      companyAddress: ['', Validators.required],
      businessSummary: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // easy access to form controls in HTML
  get f() {
    return this.businessForm.controls;
  }

  onSubmit(): void {
    console.log("dasdas",this.businessForm.valid);
    if (this.businessForm.valid) {
        
      this.eventService.registorBusinessDetails(this.businessForm.value).subscribe(
        response => {
          this.toastr.success('Business registered successfully.', 'Success');
          this.businessForm.reset();
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
