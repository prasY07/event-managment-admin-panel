import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiServiceService } from '../../service/base-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 
  constructor(private baseApi: BaseApiServiceService) { }

  createUser(data:object){
    return this.baseApi.submitData('api/admin/user/create',data);
  }

  updateUser(data:object,id:string){
    return this.baseApi.updateData(`api/admin/user/${id}/update`,data);
  }

  getUsers():Observable<userInterface>{
    return this.baseApi.getData('api/admin/user/user-list');
  }

  getUsersList():Observable<userInterface>{
    return this.baseApi.getData('api/admin/user/list');
  }

  getSingleUsers(id:string):Observable<userInterface>{
    return this.baseApi.getInformation(`api/admin/user/${id}/user-information`);
  }

  // updateStatus(id:string){
  //   return this.baseApi.updateStatus(`admin/user/${id}/update-status`);
  // }
}
interface userInterface{
  name: string,
  email: string,
  id: string,
}