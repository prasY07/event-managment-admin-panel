import { Injectable } from '@angular/core';
import { BaseApiService } from '../../baseservice/base-api.service';
// import { BaseApiServiceService } from 'src/app/baseservice/base-api-service.service';
// import { BaseApiServiceService } from 'src/app/admin/service/base-api-service.service';
// import { BaseApiServiceService } from '../../views/service/base-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class SocialSourceService {

 constructor(private baseApi: BaseApiService) { }
 
   getSocialMediaSources()
   {
      return this.baseApi.getInformationWithoutToken('common/social-media/list');
   }
}
