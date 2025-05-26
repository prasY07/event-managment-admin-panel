import { Injectable } from '@angular/core';
import { BaseApiServiceService } from '../../service/base-api-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

constructor(private baseApi: BaseApiServiceService) { }

  createEvent(data:object){
    return this.baseApi.submitData('event/create',data);
  }

  updateEvent(data:object,id:string){
    return this.baseApi.updateData(`event/${id}/update-event`,data);
  }

  // getEvents(pageNumber: number): Observable<any> {
  //   return this.baseApi.getDataWithParams('event/list', {
  //     page: pageNumber,
  //     // size: pageSize
  //   });
  // }

  getEvents(): Observable<any> {
    return this.baseApi.getData('event/list');
  }

  getSingleEvent(id:string):Observable<any>{
    return this.baseApi.getInformation(`event/${id}/event-information`);
  }

  getAllEventMemberType(id:string):Observable<any>{
    return this.baseApi.getInformation(`event-member/${id}/list`);
  }

  getAllEventAccessType(id:string):Observable<any>{
    return this.baseApi.getInformation(`event-access/${id}/list`);
  }

  createMemberAccess(data:object){
    return this.baseApi.submitData('event-access/create-access',data);
  }

  // uploadBanner(formData: FormData,id:string){
  //   return this.baseApi.submitData(`event/${id}/upload-banner`,formData);
  // }

  uploadBanner(formData: FormData, eventId: string) {
    return this.baseApi.uploadImage(`event/${eventId}/upload-banner`, formData);
  }

  getSelectedAccessList(id:string){
    return this.baseApi.getData(`event-access/${id}/access-list`);
  }

  deleteMemberType(id:string)
  {
    return this.baseApi.deleteData(`event-member/${id}/delete-member`);
  }

  deleteAccessType(id:string)
  {
    return this.baseApi.deleteData(`event-access/${id}/delete-access-type`);
  }

  updateEntryFees(data:object,id:string)
  {
    return this.baseApi.updateData(`event-member/${id}/update-fees`,data);
  }

  
}


// interface EventInterface{
//   title: string,
//   email: string,
//   id: string,
// }