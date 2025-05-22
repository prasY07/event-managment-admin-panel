import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../service/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { UcfirstPipe } from '../../../common/pipe/ucfirst.pipe';
import { SocialSourceService } from '../service/social-source.service';

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
  eventUserRegisterForm!: FormGroup;
  eventId = '';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private eventService: EventService,
    private socialSourceService: SocialSourceService,
    private router: Router,
    private aRoute: ActivatedRoute,
  ) {
    this.aRoute.params.subscribe(params => {
      this.eventId = params['id'];
    });
  }
  ngOnInit(): void {
    this.loadMemberAccess();
    this.getSocialMediaPlateform();

    this.eventUserRegisterForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      state: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      eventSource: ['', Validators.required],
      gender: ['', Validators.required],
      memberType: ['', Validators.required],
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
        alert('No user found');
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
}
