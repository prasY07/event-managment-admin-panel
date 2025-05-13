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
    return this.baseApi.updateData(`api/admin/event/${id}/update-event`,data);
  }

  getEvents():Observable<any>{
    return this.baseApi.getData('api/admin/event/list');
  }

  getSingleEvent(id:string):Observable<any>{
    return this.baseApi.getInformation(`api/admin/event/${id}/event-information`);
  }

  getAllEventMemberType(id:string):Observable<any>{
    return this.baseApi.getInformation(`api/admin/event-member/${id}/list`);
  }

  getAllEventAccessType(id:string):Observable<any>{
    return this.baseApi.getInformation(`api/admin/event-access/${id}/list`);
  }

  createMemberAccess(data:object){
    return this.baseApi.submitData('api/admin/event-access/create-access',data);
  }

  getSelectedAccessList(id:string){
    return this.baseApi.getData(`api/admin/event-access/${id}/access-list`);
  }

  deleteMemberType(id:string)
  {
    return this.baseApi.deleteData(`api/admin/event-member/${id}/delete-member`);
  }

  deleteAccessType(id:string)
  {
    return this.baseApi.deleteData(`api/admin/event-access/${id}/delete-access-type`);
  }

}


// interface EventInterface{
//   title: string,
//   email: string,
//   id: string,
// }