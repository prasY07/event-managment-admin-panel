import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective } from '@coreui/angular';
import { WeddingService } from '../service/wedding.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CommonModule,
    RouterLink
  ],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})
export class InformationComponent implements OnInit {
  weddingId: string = '';
  wedding: any = {};
  isLoading = true;

  constructor(
    private weddingService: WeddingService,
    private aRoute: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      this.weddingId = params['id'];
      if (this.weddingId) {
        this.getWedding();
      }
    });
  }

  getWedding() {
    this.isLoading = true;
    this.weddingService.getSingleWeddingInfo(this.weddingId).subscribe(
      (data: any) => {
        this.isLoading = false;
        const weddingData = data.data || {};
        // Map API field names to component field names
        this.wedding = {
          groomName: weddingData.groomName,
          brideName: weddingData.brideName,
          coupleName: weddingData.coupleName,
          weddingDate: weddingData.weddingDate,
          registrationStartDate: weddingData.redStartDate,
          registrationEndDate: weddingData.regEndDate,
          groomFatherName: weddingData.groomFatherName,
          groomMotherName: weddingData.groomMotherName,
          brideFatherName: weddingData.brideFatherName,
          brideMotherName: weddingData.brideMotherName,
          weddingCard: weddingData.weddingCard
        };
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading wedding info:', error);
        this.toastr.error('Failed to load wedding information', 'Error');
      }
    );
  }
}

