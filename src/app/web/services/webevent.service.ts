import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class WebEventService {

  constructor(private baseApi:BaseApiService ) { }

   getEventInformation(id:string):Observable<any>{
      return this.baseApi.getInformationWithoutToken(`web/event/${id}/information`);
    }

    registrationEvent(data:object):Observable<any>{
      return this.baseApi.getInformationWithoutToken(`web/event/information`);
    }

}
