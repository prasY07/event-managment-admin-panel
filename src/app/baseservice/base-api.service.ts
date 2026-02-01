import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from '../admin/service/token.service';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private tokenService : TokenService
  ) { }

 

    login(endpoint: string, data: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data);
  }
  getData(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`, { headers: this.applyHeaders() });
  }

  getDataWithParams(endpoint: string, queryParams?: any): Observable<any> {
    let params = new HttpParams();
  
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          params = params.set(key, queryParams[key]);
        }
      });
    }
  
    console.log(`${this.apiUrl}/${endpoint}`);
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`, {
      headers: this.applyHeaders(),
      params: params
    });
  }
  

  getDataWithoutPagination(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`, { headers: this.applyHeaders() });
  }

  getInformation(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`, { headers: this.applyHeaders() });
  }

  submitData(endpoint: string, data: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data, { headers: this.applyHeaders() });
  }

  updateData(endpoint: string, data: object): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${endpoint}`, data, { headers: this.applyHeaders() });
  }

  updateStatus(endpoint: string, data: object): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${endpoint}`, data,{ headers: this.applyHeaders() });
  }

  deleteData(endpoint: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${endpoint}`, { headers: this.applyHeaders() });
  }

  uploadImage(endpoint: string, data: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data);
  }

  uploadImageWithAuth(endpoint: string, data: FormData): Observable<any> {
    // For FormData, only set Authorization header, let browser set Content-Type with boundary
    // Don't set Content-Type - browser will set it automatically with boundary for FormData
   console.log('Uploading image to endpoint:', `${this.apiUrl}/${endpoint}`);
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data, { headers: this.applyHeaders() });
  }

  // ------------------------------------------withoutToken----------------------------------------------------------

  getInformationWithoutToken(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  // webEventRegistrationForm(endpoint: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/${endpoint}`, );
  // }
  postInformationWithoutToken(endpoint: string, data: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data);
  }

  private applyHeaders(): HttpHeaders {
    return new HttpHeaders({
       'Authorization': 'Bearer ' + this.tokenService.getToken() || ''
    });
  }
}
