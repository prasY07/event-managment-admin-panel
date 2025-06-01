import { Injectable } from '@angular/core';
import { BaseApiServiceService } from '../../views/service/base-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class SocialSourceService {

 constructor(private baseApi: BaseApiServiceService) { }
 
   getSocialMediaSources()
   {
      return this.baseApi.getData('social-media/list');
   }
}
