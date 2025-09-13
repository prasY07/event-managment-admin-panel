import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private baseApi:BaseApiService ) { }

   getEventInformation(id:string):Observable<any>{
      return this.baseApi.getInformation(`admin/web/${id}/event-information`);
    }
}
