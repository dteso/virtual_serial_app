import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  options = {
    headers: { 'Content-Type': 'application/json' },
    params: {}
  }

  constructor(private http: HttpClient) { }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    this.options.params = params;
    return this.http.get(`${environment.api_url}/${path}`, this.options);
  }

  post(path: string, body: object = {}): Observable<any> {
    return this.http.post(`${environment.api_url}/${path}`, body, this.options);
  }
}
