import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {

constructor(private baseApi: BaseApiService) { }

  createWedding(data: object){
    return this.baseApi.submitData('admin/wedding/create', data);
  }

  getWeddingsWithPagination(pageNumber: number): Observable<any> {
    return this.baseApi.getDataWithParams('admin/wedding/list', {
      page: pageNumber,
    });
  }

  getWeddingsWithFilter(pageNumber: number, filters: any): Observable<any> {
    const params: any = {
      page: pageNumber,
    };
    if (filters.title) params.title = filters.title;
    if (filters.status) params.eventStatus = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    return this.baseApi.getDataWithParams('admin/wedding/list', params);
  }

  getWeddingFunctions(pageNumber: number, weddingId: string): Observable<any> {
    return this.baseApi.getDataWithParams('admin/wedding/function/list', {
      page: pageNumber,
      weddingId
    });
  }

  getWeddingGuests(pageNumber: number, weddingId: string): Observable<any> {
    return this.baseApi.getDataWithParams(`wedding/registration/guest/list/${weddingId}`, {
      page: pageNumber
    });
  }

  createWeddingFunction(data: object): Observable<any> {
    return this.baseApi.submitData('admin/wedding/function/create', data);
  }

  getWeddingSides(): Observable<any> {
    return this.baseApi.getData('admin/wedding/sides');
  }

  getWeddings(): Observable<any> {
    return this.baseApi.getData('admin/wedding/list');
  }

  getSingleWedding(id:string):Observable<any>{
    return this.baseApi.getInformation(`wedding/${id}/information`);
  }

  getSingleWeddingInfo(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/wedding/${id}/wedding-information`);
  }

  getAllWeddingMemberType(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/wedding-member/${id}/list`);
  }

  getAllWeddingDays(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/wedding-service/${id}/day-list`);
  }

   getAllWeddingServices(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/wedding-service/${id}/service-list`);
  }

  getAllWeddingAccessType(id:string):Observable<any>{
    return this.baseApi.getInformation(`admin/wedding-access/${id}/list`);
  }

  createMemberAccess(data:object){
    return this.baseApi.submitData('admin/wedding-access/create-access',data);
  }

  assignDayServiceToMember(data:object){
    return this.baseApi.submitData('admin/wedding-service/assign-day-service-to-member',data);
  }

  uploadBanner(formData: FormData, weddingId: string) {
    return this.baseApi.uploadImage(`admin/wedding/${weddingId}/upload-banner`, formData);
  }

  uploadCard(formData: FormData, weddingId: string) {
    return this.baseApi.uploadImageWithAuth(`admin/wedding/${weddingId}/upload-card`, formData);
  }

  getSelectedAccessList(id:string){
    return this.baseApi.getData(`admin/wedding-access/${id}/access-list`);
  }

  deleteMemberType(id:string)
  {
    return this.baseApi.deleteData(`admin/wedding-member/${id}/delete-member`);
  }

  deleteAccessType(id:string)
  {
    return this.baseApi.deleteData(`admin/wedding-access/${id}/delete-access-type`);
  }

  updateEntryFees(data:object,id:string)
  {
    return this.baseApi.updateData(`admin/wedding-member/${id}/update-fees`,data);
  }

  getAllWeddingUser(data:object,id:string)
  {
    return this.baseApi.getData(`admin/wedding-member/${id}/update-fees`);
  }

  updateWeddingStatus(id: String): Observable<any> {
    console.log("updateWeddingStatus called with id:", id);
    return this.baseApi.updateStatus(`admin/wedding/${id}/update-status`,{});
  }

  deleteWeddingFunction(id: string): Observable<any> {
    // Try the explicit '/delete' endpoint first, fall back to DELETE on the resource path
    return this.baseApi.deleteData(`admin/wedding/function/${id}`);
    /* If backend expects DELETE on `/admin/wedding/function/{id}` instead of `/delete`,
       uncomment the fallback logic below to attempt the alternative endpoint when
       the first call returns a 404. The fallback is commented out to keep current
       behavior minimal and non-invasive.

    return this.baseApi.deleteData(`admin/wedding/function/${id}/delete`).pipe(
      catchError((err) => {
        if (err?.status === 404) {
          return this.baseApi.deleteData(`admin/wedding/function/${id}`);
        }
        throw err;
      })
    );

    */
  }

  getWeddingFunctionNotifications(weddingId: string): Observable<any> {
    return this.baseApi.getDataWithParams('admin/wedding/function/notification/list', {
      weddingId: weddingId
    });
  }

  createWeddingFunctionNotification(data: object): Observable<any> {
    return this.baseApi.submitData('admin/wedding/function/notification/create', data);
  }

  getWeddingFunctionNotification(id: string): Observable<any> {
    return this.baseApi.getData(`admin/wedding/function/notification/${id}`);
  }

  updateWeddingFunctionNotification(id: string, data: object): Observable<any> {
    return this.baseApi.updateData(`admin/wedding/function/notification/${id}/update`, data);
  }

  deleteWeddingFunctionNotification(id: string): Observable<any> {
    return this.baseApi.deleteData(`admin/wedding/function/notification/${id}`);
  }

  updateWeddingFunctionNotificationStatus(id: string, status: string): Observable<any> {
    return this.baseApi.updateStatus(`admin/wedding/function/notification/${id}/status?status=${status}`, {});
  }

  getWeddingFunction(id: string): Observable<any> {
    return this.baseApi.getData(`admin/wedding/function/${id}`);
  }

  updateWeddingFunction(id: string, data: object): Observable<any> {
    return this.baseApi.updateData(`admin/wedding/function/${id}/update`, data);
  }
  
}
