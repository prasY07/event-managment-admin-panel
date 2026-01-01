import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WeddingService } from '../../service/wedding.service';
import { CommonModule } from '@angular/common';
import { RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-function',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent],
  templateUrl: './update-function.component.html',
  styleUrls: ['./update-function.component.scss']
})
export class UpdateFunctionComponent implements OnInit {

  functionForm: FormGroup;
  functionId: string;
  weddingId: string = '';
  isSubmitting = false;
  originalData: any = null;

  constructor(
    private fb: FormBuilder,
    private weddingService: WeddingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.functionForm = this.fb.group({
      functionName: ['', Validators.required],
      functionDate: ['', Validators.required],
      functionStartTime: ['', Validators.required],
      functionEndTime: ['', Validators.required],
      venueName: ['', Validators.required],
    });
    this.functionId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.functionId) {
      this.toastr.error('Function ID not found', 'Error');
      this.router.navigate(['/admin/wedding']);
    }
    
    // Try to get weddingId from navigation extras state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['weddingId']) {
      this.weddingId = navigation.extras.state['weddingId'];
    }
  }

  ngOnInit(): void {
    this.weddingService.getWeddingFunction(this.functionId).subscribe(
      (res: any) => {
        // store full data so we can merge missing fields on submit
        this.originalData = res.data || {};
        this.functionForm.patchValue({
          functionName: this.originalData.functionName,
          functionDate: this.originalData.functionDate,
          functionStartTime: this.originalData.functionStartTime,
          functionEndTime: this.originalData.functionEndTime,
          venueName: this.originalData.venueName,
        });
        // If we don't have weddingId, try to extract it from the data
        if (!this.weddingId && this.originalData.weddingId) {
          this.weddingId = this.originalData.weddingId;
        }
      },
      (error) => {
        console.error('Error fetching wedding function:', error);
        this.toastr.error('Failed to load wedding function', 'Error');
      }
    );
  }

  onSubmit(): void {
    if (this.functionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValues = this.functionForm.value || {};
      const payload: any = {
        ...(this.originalData || {}),
        ...formValues,
      };

      // Ensure weddingId is present
      if (!payload.weddingId && this.weddingId) {
        payload.weddingId = this.weddingId;
      }

      // Normalize time inputs (append seconds if missing)
      const normalizeTime = (t: any) => {
        if (!t && t !== 0) return t;
        if (typeof t === 'string' && /^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
        return t;
      };

      payload.functionStartTime = normalizeTime(payload.functionStartTime);
      payload.functionEndTime = normalizeTime(payload.functionEndTime);

      this.weddingService.updateWeddingFunction(this.functionId, payload).subscribe(
        () => {
          this.isSubmitting = false;
          this.toastr.success('Wedding function updated successfully', 'Success');
          // Navigate back to wedding functions list - if we have weddingId, use it; otherwise go back
          if (this.weddingId) {
            this.router.navigate(['/admin/wedding/wedding-functions', this.weddingId]);
          } else {
            this.router.navigate(['/admin/wedding']);
          }
        },
        (error) => {
          this.isSubmitting = false;
          console.error('Error updating wedding function:', error);
          const msg = error?.error?.message || error?.message || 'Failed to update wedding function';
          this.toastr.error(msg, 'Error');
        }
      );
    }
  }

  onCancel(): void {
    if (this.weddingId) {
      this.router.navigate(['/admin/wedding/wedding-functions', this.weddingId]);
    } else {
      this.router.navigate(['/admin/wedding']);
    }
  }

}
