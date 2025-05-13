import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiServiceService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getData(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`, { headers: this.applyHeaders() });
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

  updateStatus(endpoint: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${endpoint}`, {},{ headers: this.applyHeaders() });
  }


  deleteData(endpoint: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${endpoint}`, { headers: this.applyHeaders() });
  }

  private applyHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      //  Authorization: 'Bearer ' + localStorage.getItem('adminToken'),
    });
  }
}
