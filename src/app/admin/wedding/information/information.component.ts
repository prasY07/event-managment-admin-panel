import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective } from '@coreui/angular';
import { WeddingService } from '../service/wedding.service';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})
export class InformationComponent implements OnInit {
  weddingId: string = '';
  wedding: any = {};
  constructor(
    private weddingService: WeddingService,
    private aRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      this.weddingId = params['id'];
    });
    this.getWedding();
  }

  getWedding() {
    this.weddingService.getSingleWedding(this.weddingId).subscribe((data: any) => {
      this.wedding = data.data;
    });
  }


}

