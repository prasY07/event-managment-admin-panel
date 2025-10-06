import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../baseservice/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class WebEventService {

  constructor(private baseApi:BaseApiService ) { }

   getEventInformation(id:string):Observable<any>{
      return this.baseApi.getInformationWithoutToken(`web/event/${id}/information`);
    }

    registrationEvent(data:object):Observable<any>{
      return this.baseApi.postInformationWithoutToken(`web/event/user-registration`,data);
    }

    getAllEventMemberType(id:string):Observable<any>{
    return this.baseApi.getInformationWithoutToken(`web/event/${id}/member-list`);
  }

  sendOtpApi(data:object):Observable<any>{
    return this.baseApi.postInformationWithoutToken(`web/send-otp`,data);
  }

  resendOtpApi(data:object):Observable<any>{
    return this.baseApi.postInformationWithoutToken(`web/resend-otp`,data);
  }

}
