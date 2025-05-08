import { Injectable } from '@angular/core';
import { BaseApiServiceService } from '../../service/base-api-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

constructor(private baseApi: BaseApiServiceService) { }

  createEvent(data:object){
    return this.baseApi.submitData('api/admin/event/create',data);
  }

  updateEvent(data:object,id:string){
    return this.baseApi.updateData(`api/admin/event/${id}/update`,data);
  }

  getEvents():Observable<any>{
    return this.baseApi.getData('api/admin/event/list');
  }

  getSingleEvent(id:string):Observable<any>{
    return this.baseApi.getInformation(`api/admin/event/${id}/event-information`);
  }
}


// interface EventInterface{
//   title: string,
//   email: string,
//   id: string,
// }