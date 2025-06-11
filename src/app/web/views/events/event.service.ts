import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiServiceService } from '../../../views/service/base-api-service.service';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  
  constructor(private baseApi: BaseApiServiceService) { }
  
    getEventDataWithUUId(eventID:string){
      return this.baseApi.getData(`api/admin/event/${eventID}/event-info`);
    }
}
