import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 
  constructor(private baseApi: BaseApiService) { }

  createUser(data:object){
    return this.baseApi.submitData('admin/user/create',data);
  }

  updateUser(data:object,id:string){
    return this.baseApi.updateData(`admin/user/${id}/update`,data);
  }

  getUsers():Observable<userInterface>{
    return this.baseApi.getData('admin/user/user-list');
  }

  getUsersList():Observable<userInterface>{
    return this.baseApi.getData('admin/user/list');
  }

  getSingleUsers(id:string):Observable<userInterface>{
    return this.baseApi.getInformation(`admin/user/${id}/user-information`);
  }

  updateStatus(id:string, data: object){
    return this.baseApi.updateStatus(`admin/user/${id}/update-status`,data);
  }
}
interface userInterface{
  name: string,
  email: string,
  id: string,
}