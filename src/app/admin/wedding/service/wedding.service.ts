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

  getWeddingFunctions(pageNumber: number, weddingId: string): Observable<any> {
    return this.baseApi.getDataWithParams('admin/wedding/function/list', {
      page: pageNumber,
      weddingId
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
    return this.baseApi.deleteData(`admin/wedding/function/${id}/delete`);
  }

  getWeddingFunction(id: string): Observable<any> {
    return this.baseApi.getData(`admin/wedding/function/${id}`);
  }

  updateWeddingFunction(id: string, data: object): Observable<any> {
    return this.baseApi.updateData(`admin/wedding/function/${id}/update`, data);
  }
  
}
