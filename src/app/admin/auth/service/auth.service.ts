import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private baseApi: BaseApiService) { }

  login(data:object){
    return this.baseApi.login('admin/auth/login',data);
  }
}
