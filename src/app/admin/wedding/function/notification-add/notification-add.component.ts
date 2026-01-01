import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WeddingService } from '../../service/wedding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-add',
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
  templateUrl: './notification-add.component.html',
  styleUrl: './notification-add.component.scss'
})
export class NotificationAddComponent implements OnInit {

  notificationForm!: FormGroup;
  weddingId = '';
  functionId = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private weddingService: WeddingService,
    private router: Router,
    private aRoute: ActivatedRoute,
  ) {
    this.aRoute.params.subscribe(params => {
      this.weddingId = params['weddingId'];
      this.functionId = params['functionId'];
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.notificationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      notificationDate: ['', Validators.required],
      notificationTime: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.notificationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = {
        ...this.notificationForm.value,
        weddingId: this.weddingId,
        weddingFunctionId: this.functionId,
      };

      // Normalize time if needed
      if (typeof formData.notificationTime === 'string' && /^\d{2}:\d{2}$/.test(formData.notificationTime)) {
        formData.notificationTime = `${formData.notificationTime}:00`;
      }

      this.weddingService.createWeddingFunctionNotification(formData).subscribe(
        (res: any) => {
          this.isSubmitting = false;
          this.toastr.success('Notification created successfully', 'Success');
          this.router.navigate(['/admin/wedding/notification-list', this.weddingId, this.functionId]);
        },
        (error) => {
          this.isSubmitting = false;
          this.toastr.error('Failed to create notification', 'Error');
          console.error('Error creating notification:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/wedding/notification-list', this.weddingId, this.functionId]);
  }

}
