import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private baseApi: BaseApiService) { }

  login(data:object){
    return this.baseApi.submitData('admin/auth/login',data);
  }
}
