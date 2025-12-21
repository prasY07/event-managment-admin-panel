import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class WebWeddingService {

  constructor(private baseApi: BaseApiService) { }

  getWeddingInformation(id: string): Observable<any> {
    return this.baseApi.getInformationWithoutToken(`web/wedding/${id}/card`);
  }

  registerWeddingGuest(data: object): Observable<any> {
    return this.baseApi.postInformationWithoutToken(`web/wedding/user-registration`, data);
  }
}
