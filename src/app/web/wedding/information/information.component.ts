import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WebWeddingService } from '../../services/webwedding.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  // Only keep bannerImage — other fields are intentionally omitted
  bannerImage: string | null = null;
  weddingId: string = '';
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  isExpired: boolean = false;

  constructor(
    private weddingService: WebWeddingService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      this.weddingId = params['id'];
      this.getWedding();
    });
  }

  getWedding() {
    // this.isLoading = true;
    // this.hasError = false;
    // this.isExpired = false;

    this.weddingService.getWeddingInformation(this.weddingId).subscribe(
      (resp: any) => {
        
        console.log('Wedding information response:', resp);
      const startDate = new Date(resp.data.startDate);
    const endDate = new Date(resp.data.endDate);
    const today = new Date();

    // Remove time part (important!)
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    // 🔴 Registration not started
    if (today < startDate) {
      this.hasError = true;
      this.isExpired = true;
      this.errorMessage = 'Registration has not started yet.';
      this.isLoading = false;
      return;
    }

    // 🔴 Registration ended
    if (today > endDate) {
      this.hasError = true;
      this.isExpired = true;
      this.errorMessage = 'Registration has ended.';
      this.isLoading = false;
      return;
    }

    // ✅ Valid date range
    this.isExpired = false;
    this.hasError = false;
    this.isLoading = false;

        // Defensive handling for API shapes:
        // - { success:true, message:'Wedding Card', data: null }
        // - { success:true, message:'Wedding Card', data: 'http://.../image.png' }
        const payload = resp?.data ?? resp;

        if (payload == null) {
          // No image/card available
          this.bannerImage = null;
        } else if (typeof payload === 'string') {
          // API returned direct image URL string
          this.bannerImage = payload;
        } else {
          // payload is object. prefer payload.card if present
          const normalized = (payload.card ?? payload);
          // If normalized itself is a string, treat as image URL
          if (typeof normalized === 'string') {
            this.bannerImage = normalized;
          } else {
            this.bannerImage = normalized.bannerImage ?? normalized.image ?? normalized.data ?? null;
          }
        }

        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching wedding information:', error);
        this.hasError = true;
        this.errorMessage = error.error?.message || 'Failed to load wedding information';
        this.isLoading = false;
      }
    );
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
