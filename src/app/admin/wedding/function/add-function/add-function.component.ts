import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WeddingService } from '../../service/wedding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-function',
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
    CommonModule
  ],
  templateUrl: './add-function.component.html',
  styleUrl: './add-function.component.scss'
})
export class AddFunctionComponent implements OnInit {

  weddingFunctionForm!: FormGroup;
  weddingId = '';
  sides: any[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private weddingService: WeddingService,
    private router: Router,
    private aRoute: ActivatedRoute,
  ) {
    this.aRoute.params.subscribe(params => {
      this.weddingId = params['id'];
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadSides();
  }

  buildForm() {
    this.weddingFunctionForm = this.fb.group({
      functionName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      functionDate: ['', Validators.required],
      functionStartTime: ['', Validators.required],
      functionEndTime: ['', Validators.required],
      venueName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      venueAddress: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      sideId: ['', Validators.required],
      // sideName: ['', Validators.required],
      // sideDescription: ['', Validators.required],
    });
  }

  loadSides() {
    this.weddingService.getWeddingSides().subscribe(
      (res: any) => {
        this.sides = res?.data || [];
      },
      () => {
        this.toastr.error('Failed to load sides', 'Error');
      }
    );
  }

  onSideChange(event: any) {
    const selectedId = event.target.value;
    const side = this.sides.find((s: any) => s.id == selectedId);
    if (side) {
      this.weddingFunctionForm.patchValue({
        sideName: side.name || '',
        sideDescription: side.description || ''
      });
    }
  }

  onSubmit(): void {
    if (this.weddingFunctionForm.invalid) {
      this.weddingFunctionForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.weddingFunctionForm.value,
      weddingId: Number(this.weddingId)
    };

    this.weddingService.createWeddingFunction(payload).subscribe(
      () => {
        this.toastr.success('Wedding function created', 'Success');
        this.router.navigate(['/admin/wedding/wedding-functions', this.weddingId]);
      },
      (error) => {
        const msg = error.error?.message || 'OOPS Something Went Wrong';
        this.toastr.error(msg, 'Error');
      }
    );
  }

  get f() {
    return this.weddingFunctionForm.controls;
  }
}

