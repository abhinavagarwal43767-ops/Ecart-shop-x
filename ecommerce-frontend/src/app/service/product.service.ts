import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../interceptors/api.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${API.baseUrl}/products`);
  }

  getProductById(id: number) {
    return this.http.get(`${API.baseUrl}/products/${id}`);
  }
}
