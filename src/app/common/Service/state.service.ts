import { Injectable } from '@angular/core';
import { BaseApiServiceService } from '../../views/service/base-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

   constructor(private baseApi: BaseApiServiceService) { }
   
     getAllStates()
     {
        return this.baseApi.getData('social-media/list');
     }
}
