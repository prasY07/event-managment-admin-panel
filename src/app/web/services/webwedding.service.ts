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

  /**
   * Fetch public wedding details (name, dates, etc.) without requiring auth.
   * Uses the public `wedding/{id}/information` endpoint when available.
   */
  getWeddingDetails(id: string): Observable<any> {
    return this.baseApi.getInformationWithoutToken(`wedding/${id}/information`);
  }

  registerWeddingGuest(data: object): Observable<any> {
    return this.baseApi.postInformationWithoutToken(`web/wedding/user-registration`, data);
  }

  /**
   * Register guest with guestData JSON and file uploads (onwardTicketFile, returnTicketFile).
   * Endpoint: wedding/registration/guest/save (requires Authorization header)
   * @param formData FormData containing 'guestData' JSON string and optional file fields
   */
  registerGuest(formData: FormData): Observable<any> {
    return this.baseApi.uploadImageWithAuth(`wedding/registration/guest/save`, formData);
  }
}
