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
    this.isLoading = true;
    this.hasError = false;
    this.isExpired = false;

    this.weddingService.getWeddingInformation(this.weddingId).subscribe(
      (resp: any) => {
        
        if (resp?.isExpired == true) {
          // isExpired is true, so show the card and register link
          this.isExpired = false;
        } else {
          this.isExpired = true;
          this.hasError = true;
          this.errorMessage = 'This wedding URL has expired. The link is no longer valid.';
          this.isLoading = false;
          return;
        }

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
