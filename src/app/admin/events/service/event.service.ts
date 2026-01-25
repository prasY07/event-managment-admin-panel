import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

constructor(private baseApi: BaseApiService) { }

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

  getEventsWithFilter(pageNumber: number, filters: any): Observable<any> {
    const params: any = {
      page: pageNumber,
    };
    // Only add non-empty filter values
    if (filters.title && filters.title.trim()) params.title = filters.title.trim();
    if (filters.status && filters.status.trim()) params.eventStatus = filters.status.trim();
    if (filters.startDate && filters.startDate.trim()) params.startDate = filters.startDate.trim();
    if (filters.endDate && filters.endDate.trim()) params.endDate = filters.endDate.trim();
    return this.baseApi.getDataWithParams('admin/event/list', params);
  }

   getEventsRegisterUser(pageNumber: number,id: String): Observable<any> {
    return this.baseApi.getDataWithParams(`admin/event-register/${id}/list`, {
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

  getAllEventDays(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/event-service/${id}/day-list`);
  }

   getAllEventServices(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/event-service/${id}/service-list`);
  }

  getAllEventAccessType(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/event-access/${id}/list`);
  }

  createMemberAccess(data:object){
    return this.baseApi.submitData('admin/event-access/create-access',data);
  }

  assignDayServiceToMember(data:object){
    return this.baseApi.submitData('admin/event-service/assign-day-service-to-member',data);
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

  updateEventStatus(id: String): Observable<any> {
    console.log("updateEventStatus called with id:", id);
    return this.baseApi.updateStatus(`admin/event/${id}/update-status`,{});
  }
  
}


// interface EventInterface{
//   title: string,
//   email: string,
//   id: string,
// }