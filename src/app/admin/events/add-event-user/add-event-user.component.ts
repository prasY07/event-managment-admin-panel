import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../service/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { UcfirstPipe } from '../../../common/pipe/ucfirst.pipe';
import { SocialSourceService } from '../../../common/Service/social-source.service';
import { StateService } from '../../../common/Service/state.service';
import { CountryService } from '../../../common/Service/country.service';

@Component({
  selector: 'app-add-event-user',
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
    UcfirstPipe
  ],
  templateUrl: './add-event-user.component.html',
  styleUrl: './add-event-user.component.scss'
})
export class AddEventUserComponent implements OnInit {

  socialMediaPlateForm: any = [];
  memberTypes: any[] = [];
  socialSources:any[] = [];
  states:any[] = [];
  allCountry : any = [];
  
  eventUserRegisterForm!: FormGroup;
  eventId = '';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private eventService: EventService,
    private stateService: StateService,
    private socialSourceService: SocialSourceService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private countryService : CountryService,
  ) {
    this.aRoute.params.subscribe(params => {
      this.eventId = params['id'];
    });
  }
  ngOnInit(): void {
    this.loadMemberAccess();
    this.getSocialMediaPlateform();
    this.loadStates();
    this.getAllCountry();

    this.eventUserRegisterForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      eventSource: ['', Validators.required],
      gender: ['', Validators.required],
      memberType: ['', Validators.required],
      countryId:['',Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });

  }

  onSubmit(): void {
    
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

  loadMemberAccess() {
    this.eventService.getAllEventMemberType(this.eventId)
      .subscribe(
        (data: any) => {
          this.memberTypes = data.data;
          console.log("member", this.memberTypes);
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );
  }

  loadStates() {
    this.stateService.getAllStates()
      .subscribe(
        (data: any) => {
          this.states = data.data;
          console.log("states", this.states);
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );
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

  get f() {
  return this.eventUserRegisterForm.controls;
}
}
