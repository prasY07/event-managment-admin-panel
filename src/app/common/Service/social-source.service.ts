import { Injectable } from '@angular/core';
// import { BaseApiServiceService } from 'src/app/baseservice/base-api-service.service';
import { BaseApiService } from 'src/app/baseservice/base-api.service';
// import { BaseApiServiceService } from 'src/app/admin/service/base-api-service.service';
// import { BaseApiServiceService } from '../../views/service/base-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class SocialSourceService {

 constructor(private baseApi: BaseApiService) { }
 
   getSocialMediaSources()
   {
      return this.baseApi.getData('social-media/list');
   }
}
