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
  sides: any[] = [];


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
      venueAddress: ['', Validators.required],
      sideId: ['', Validators.required],
      sideName: [''],
      sideAddress: ['']
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
        this.originalData = res.data || {};

        this.functionForm.patchValue({
          functionName: this.originalData.functionName,
          functionDate: this.originalData.functionDate
            ? this.originalData.functionDate.split('T')[0]
            : '',
          functionStartTime: this.originalData.functionStartTime?.substring(0, 5),
          functionEndTime: this.originalData.functionEndTime?.substring(0, 5),
          venueName: this.originalData.venueName,
          venueAddress: this.originalData.venueAddress ?? '',
          sideId: this.originalData.sideId ?? '',
          sideName: this.originalData.sideName ?? '',
          sideAddress: this.originalData.sideDescription ?? '',
        });

        if (!this.weddingId && this.originalData.weddingId) {
          this.weddingId = this.originalData.weddingId;
        }
      },
      () => {
        this.toastr.error('Failed to load wedding function', 'Error');
      }
    );

    this.loadSides();
    this.functionForm.get('sideId')?.valueChanges.subscribe(sideId => {
      const side = this.sides.find(s => s.id === Number(sideId));
      if (side) {
        this.functionForm.patchValue(
          { sideName: side.sideName },
          { emitEvent: false }
        );
      }
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

  onSubmit(): void {
    if (this.functionForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const payload = {
      weddingId: this.weddingId,
      functionName: this.functionForm.value.functionName,
      functionDate: this.functionForm.value.functionDate,
      functionStartTime: `${this.functionForm.value.functionStartTime}:00`,
      functionEndTime: `${this.functionForm.value.functionEndTime}:00`,
      venueName: this.functionForm.value.venueName,
      venueAddress: this.functionForm.value.venueAddress,
      sideId: Number(this.functionForm.value.sideId),
      sideName: this.functionForm.value.sideName,
      sideAddress: this.functionForm.value.sideAddress
    };

    this.weddingService.updateWeddingFunction(this.functionId, payload).subscribe(
      () => {
        this.isSubmitting = false;
        this.toastr.success('Wedding function updated successfully', 'Success');

        if (this.weddingId) {
            this.router.navigate(['/admin/wedding/wedding-functions', this.weddingId]);
        } else {
          this.router.navigate(['/admin/wedding']);
        }
        
      },
      (error) => {
        this.isSubmitting = false;
        this.toastr.error(
          error?.error?.message || 'Failed to update wedding function',
          'Error'
        );
      }
    );
  }


  onCancel(): void {
    if (this.weddingId) {
      this.router.navigate(['/admin/wedding/wedding-functions', this.weddingId]);
    } else {
      this.router.navigate(['/admin/wedding']);
    }
  }

}
