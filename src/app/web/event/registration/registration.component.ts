import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { WebEventService } from '../../services/webevent.service';
import { CountryService } from '../../../common/Service/country.service';
import { SocialSourceService } from '../../../common/Service/social-source.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-registration',
  imports: [FormModule,ReactiveFormsModule,CommonModule ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent  implements OnInit{
  allCountry : any = [];
  allSocialSource : any = [];
  memberTypes : any = [];
  eventUserRegisterForm!: FormGroup;
  emailOtpSended : boolean = false;
  emailVerified : boolean = false;
  mobileOtpSended : boolean = false;
  mobileVerified : boolean = false;
  socialSources:any[] = [];
  eventId = '';
  event: any = {};


   constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
     private eventService: WebEventService,
     private countryService : CountryService,
     private socialSourceService:SocialSourceService ,
    private aRoute: ActivatedRoute,

  ) {
      this.aRoute.params.subscribe(params => {
        this.eventId = params['id'];
      });

  }

  ngOnInit()
  {
    this.eventUserRegisterForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          emailOtp: ['', Validators.required],
          mobileOtp: ['', Validators.required],
          address: ['', Validators.required],
          pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
          eventSource: ['', Validators.required],
          gender: ['', Validators.required],
          memberType: ['', Validators.required],
          countryId:['',Validators.required],
          dob:['',Validators.required],
          phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        });
        this.getAllCountry();
        this.loadMemberList();
        this.getSocialMediaPlateform();
        this.getEvent();
  }

  getEvent() {
    this.eventService.getEventInformation(this.eventId).subscribe((data: any) => {
      this.event = data.data;
      
    });
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
        alert('No Counntry code found');
      }
    );
  }


    getSocialMediaPlateform() {
    this.socialSourceService.getSocialMediaSources().subscribe(
      (data: any) => {
        this.socialSources = data.data;
        console.log("social",this.socialSources);
      },
      error => {
        console.error('Error fetching users:', error);
        alert('social media source not found');
      }
    );
  }

    loadMemberList(){
    this.eventService.getAllEventMemberType(this.eventId)
    .subscribe(
      (data: any) => {
        this.memberTypes = data.data;
        console.log("member",this.memberTypes);
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onSubmit()
  {

    if (this.eventUserRegisterForm.valid) {
      const formValue = this.eventUserRegisterForm.value;

        const payload = {
    name: formValue.name,
    email: formValue.email,
    memberTypeId: formValue.memberType, // assuming this is the ID
    gender: formValue.gender,
    heardSourceId: formValue.eventSource, // assuming eventSource is an ID
    phoneNumber: formValue.phoneNumber,
    countryId: formValue.countryId,
    eventId: this.eventId, // you should assign this somewhere in the component
    address: formValue.address,
    zipcode: formValue.pincode,
    eventRegistrationAddedBy: 'USER' // or 'ADMIN' or enum value expected by backend
  };

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

  sendOtp()
  {

    this.emailOtpSended = true;
    alert('Email OTP sent successfully');
  }

    sendPhoneOtp()
  {

    this.mobileOtpSended = true;
    alert('Email OTP sent successfully');
  }

  resendOtp(type:string,key:string)
  {

  }
}
