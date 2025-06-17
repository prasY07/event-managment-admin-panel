import { Injectable } from '@angular/core';
import { BaseApiServiceService } from '../../service/base-api-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

constructor(private baseApi: BaseApiServiceService) { }

  createEvent(data:object){
    return this.baseApi.submitData('admin/event/create',data);
  }

  updateEvent(data:object,id:string){
    return this.baseApi.updateData(`admin/event/${id}/update-event`,data);
  }

  getEventsWithPagination(pageNumber: number): Observable<any> {
    return this.baseApi.getDataWithParams('admin/event/list', {
      page: pageNumber,
      // size: pageSize
    });
  }

  getEvents(): Observable<any> {
    return this.baseApi.getData('admin/event/list');
  }

  getSingleEvent(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/event/${id}/event-information`);
  }

  getAllEventMemberType(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/event-member/${id}/list`);
  }

  getAllEventAccessType(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/event-access/${id}/list`);
  }

  createMemberAccess(data:object){
    return this.baseApi.submitData('admin/event-access/create-access',data);
  }


  uploadBanner(formData: FormData, eventId: string) {
    return this.baseApi.uploadImage(`admin/event/${eventId}/upload-banner`, formData);
  }

  getSelectedAccessList(id:string){
    return this.baseApi.getData(`admin/event-access/${id}/access-list`);
  }

  deleteMemberType(id:string)
  {
    return this.baseApi.deleteData(`admin/event-member/${id}/delete-member`);
  }

  deleteAccessType(id:string)
  {
    return this.baseApi.deleteData(`admin/event-access/${id}/delete-access-type`);
  }

  updateEntryFees(data:object,id:string)
  {
    return this.baseApi.updateData(`admin/event-member/${id}/update-fees`,data);
  }

  getAllEventUser(data:object,id:string)
  {
    return this.baseApi.getData(`admin/event-member/${id}/update-fees`);
  }

  
}


// interface EventInterface{
//   title: string,
//   email: string,
//   id: string,
// }