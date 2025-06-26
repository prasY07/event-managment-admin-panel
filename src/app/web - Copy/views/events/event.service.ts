import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../baseservice/base-api.service';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  
  constructor(private baseApi: BaseApiService) { }
  
    getEventDataWithUUId(eventID:string){
      return this.baseApi.getData(`api/admin/event/${eventID}/event-info`);
    }
}
