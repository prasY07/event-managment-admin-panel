import { Injectable } from '@angular/core';
import { BaseApiService } from '../../baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {


  constructor(private baseApi: BaseApiService) { }
   
     getAllStates()
     {
        return this.baseApi.getData('country/list');
     }
}
