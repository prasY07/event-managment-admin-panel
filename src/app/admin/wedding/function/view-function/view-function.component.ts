import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeddingService } from '../../service/wedding.service';
import { CommonModule } from '@angular/common';
import { RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-function',
  standalone: true,
  imports: [CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent],
  templateUrl: './view-function.component.html',
  styleUrls: ['./view-function.component.scss']
})
export class ViewFunctionComponent implements OnInit {

  functionData: any;
  functionId: string;
  weddingId: string = '';

  constructor(
    private weddingService: WeddingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.functionId = this.route.snapshot.paramMap.get('id')!;
    
    // Try to get weddingId from navigation extras state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['weddingId']) {
      this.weddingId = navigation.extras.state['weddingId'];
    }
  }

  ngOnInit(): void {
    this.weddingService.getWeddingFunction(this.functionId).subscribe(
      (res: any) => {
        this.functionData = res.data;
        // If we don't have weddingId, try to extract it from the data
        if (!this.weddingId && res.data.weddingId) {
          this.weddingId = res.data.weddingId;
        }
      },
      (error) => {
        console.error('Error fetching wedding function:', error);
        this.toastr.error('Failed to load wedding function', 'Error');
      }
    );
  }

  onGoBack(): void {
    if (this.weddingId) {
      this.router.navigate(['/admin/wedding/wedding-functions', this.weddingId]);
    } else {
      this.router.navigate(['/admin/wedding']);
    }
  }

}
