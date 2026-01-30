import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../interceptors/api.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) { }

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${API.baseUrl}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${API.baseUrl}/auth/register`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${API.baseUrl}/auth/logout`, {});
  }

  sendMessage(data: { name: string; email: string; message: string }): Observable<any> {
    return this.http.post(`${API.baseUrl}/auth/send-email`, data);
  }
}
