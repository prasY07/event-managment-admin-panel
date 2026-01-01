import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WeddingService } from '../../service/wedding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-function',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
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
  isSubmitting = false;

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
  }

  buildForm() {
    this.weddingFunctionForm = this.fb.group({
      functionName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      functionDate: ['', Validators.required],
      functionStartTime: ['', Validators.required],
      functionEndTime: ['', Validators.required],
      venueName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    });
  }

  onSubmit(): void {
    if (this.weddingFunctionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = {
        ...this.weddingFunctionForm.value,
        weddingId: this.weddingId
      };
      
      this.weddingService.createWeddingFunction(formData).subscribe(
        (res: any) => {
          this.toastr.success('Wedding function created successfully', 'Success');
          this.router.navigate(['/admin/wedding/wedding-functions', this.weddingId]);
        },
        (error) => {
          this.isSubmitting = false;
          this.toastr.error('Failed to create wedding function', 'Error');
          console.error('Error creating wedding function:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/wedding/wedding-functions', this.weddingId]);
  }

}
