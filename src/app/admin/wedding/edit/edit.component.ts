import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user/service/user.service';
import { WeddingService } from '../service/wedding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';


@Component({
  selector: 'app-edit',
  standalone: true,
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
       NgxEditorComponent, NgxEditorMenuComponent
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit,OnDestroy {
  weddingForm!: FormGroup;
  users: any = [];
  weddingId: string = '';
  wedding: any = {};

 descriptionEditor!: Editor;
  privacyPolicyEditor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private weddingService: WeddingService,
    private router: Router,
    private aRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      this.weddingId = params['id'];
    });
    this.weddingForm = this.fb.group({
      groomName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      brideName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      groomFatherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      groomMotherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      brideFatherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      brideMotherName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      weddingCard: ['', [Validators.required]],
      weddingDate: ['', [Validators.required, this.validateWeddingDate.bind(this)]],
      registrationStartDate: ['', [Validators.required, this.validateRegistrationStartDate.bind(this)]],
      registrationEndDate: ['', [Validators.required, this.validateRegistrationEndDate.bind(this)]],
    });

    this.getWedding();
  }

  ngOnDestroy() {
    // Remove editor destruction if not needed
  }

// ... existing code ...

  getWedding() {
    this.weddingService.getSingleWedding(this.weddingId).subscribe((data: any) => {
      this.wedding = data;
      this.weddingForm.patchValue({
        groomName: this.wedding.data.groomName,
        brideName: this.wedding.data.brideName,
        groomFatherName: this.wedding.data.groomFatherName,
        groomMotherName: this.wedding.data.groomMotherName,
        brideFatherName: this.wedding.data.brideFatherName,
        brideMotherName: this.wedding.data.brideMotherName,
        weddingCard: this.wedding.data.weddingCard,
        weddingDate: this.wedding.data.weddingDate,
        registrationStartDate: this.wedding.data.registrationStartDate,
        registrationEndDate: this.wedding.data.registrationEndDate,
      });
    });
  }

  validateWeddingDate(control: AbstractControl): ValidationErrors | null {
    if (!this.weddingForm) return null;
    const weddingDate = new Date(control.value);
    const registrationEndDate = new Date(this.weddingForm.get('registrationEndDate')?.value);
    
    if (weddingDate && registrationEndDate && registrationEndDate >= weddingDate) {
      return { invalidWeddingDate: 'Wedding date must be after registration end date.' };
    }
    return null;
  }

  validateRegistrationStartDate(control: AbstractControl): ValidationErrors | null {
    if (!this.weddingForm) return null;
    const regStartDate = new Date(control.value);
    const regEndDate = new Date(this.weddingForm.get('registrationEndDate')?.value);
    
    if (regStartDate && regEndDate && regStartDate >= regEndDate) {
      return { invalidRegistrationStartDate: 'Registration start date must be before registration end date.' };
    }
    return null;
  }

  validateRegistrationEndDate(control: AbstractControl): ValidationErrors | null {
    if (!this.weddingForm) return null;
    const regEndDate = new Date(control.value);
    const regStartDate = new Date(this.weddingForm.get('registrationStartDate')?.value);
    const weddingDate = new Date(this.weddingForm.get('weddingDate')?.value);
    
    if (regEndDate && regStartDate && regEndDate <= regStartDate) {
      return { invalidRegistrationEndDate: 'Registration end date must be after registration start date.' };
    }
    
    if (regEndDate && weddingDate && regEndDate >= weddingDate) {
      return { invalidRegistrationEndDate: 'Registration end date must be before wedding date.' };
    }
    return null;
  }


}
