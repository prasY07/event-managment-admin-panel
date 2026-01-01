import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WeddingService } from '../../service/wedding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-edit',
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
  templateUrl: './notification-edit.component.html',
  styleUrl: './notification-edit.component.scss'
})
export class NotificationEditComponent implements OnInit {

  notificationForm!: FormGroup;
  notificationId = '';
  weddingId = '';
  functionId = '';
  isSubmitting = false;
  isLoading = true;
  originalData: any = {};

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private weddingService: WeddingService,
    private router: Router,
    private aRoute: ActivatedRoute,
  ) {
    this.aRoute.params.subscribe(params => {
      this.notificationId = params['id'];
      this.weddingId = params['weddingId'];
      this.functionId = params['functionId'];
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadNotification();
  }

  buildForm() {
    this.notificationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      notificationDate: ['', Validators.required],
      notificationTime: ['', Validators.required],
    });
  }

  loadNotification(): void {
    this.isLoading = true;
    this.weddingService.getWeddingFunctionNotification(this.notificationId).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.originalData = res.data || {};
        this.populateForm(this.originalData);
      },
      (error) => {
        this.isLoading = false;
        this.toastr.error('Failed to load notification', 'Error');
        console.error('Error loading notification:', error);
        this.router.navigate(['/admin/wedding/notification-list', this.weddingId, this.functionId]);
      }
    );
  }

  populateForm(data: any): void {
    this.notificationForm.patchValue({
      title: data.title || '',
      message: data.message || '',
      notificationDate: data.notificationDate || '',
      notificationTime: data.notificationTime || '',
    });
  }

  onSubmit(): void {
    if (this.notificationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = {
        ...this.originalData,
        ...this.notificationForm.value,
      };

      // Normalize time if needed
      if (typeof formData.notificationTime === 'string' && /^\d{2}:\d{2}$/.test(formData.notificationTime)) {
        formData.notificationTime = `${formData.notificationTime}:00`;
      }

      this.weddingService.updateWeddingFunctionNotification(this.notificationId, formData).subscribe(
        (res: any) => {
          this.isSubmitting = false;
          this.toastr.success('Notification updated successfully', 'Success');
          this.router.navigate(['/admin/wedding/notification-list', this.weddingId, this.functionId]);
        },
        (error) => {
          this.isSubmitting = false;
          this.toastr.error('Failed to update notification', 'Error');
          console.error('Error updating notification:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/wedding/notification-list', this.weddingId, this.functionId]);
  }

}
