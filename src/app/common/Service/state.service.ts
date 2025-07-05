import { Injectable } from '@angular/core';
import { BaseApiService } from '../../baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

   constructor(private baseApi: BaseApiService) { }
   
     getAllStates()
     {
        return this.baseApi.getData('common/social-media/list');
     }
}
