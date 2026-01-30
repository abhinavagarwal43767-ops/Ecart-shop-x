import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../interceptors/api.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${API.baseUrl}/categories`);
  }

  getProductsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${API.baseUrl}/categories/${categoryId}/products`);
  }
}
