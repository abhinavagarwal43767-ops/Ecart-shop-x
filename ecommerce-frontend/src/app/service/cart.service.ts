import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../interceptors/api.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  sendOrderConfirmation(data: any) {
    return this.http.post(`${API.baseUrl}/cart/confirm`, data);
  }

  addToCart(productId: string): Observable<any> {
    return this.http.post(
      `${API.baseUrl}/cart`,
      { productId, qty: 1 },
      this.getAuthHeaders()
    );
  }

  getCart(): Observable<any[]> {
    return this.http.get<any[]>(`${API.baseUrl}/cart`, this.getAuthHeaders());
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete(
      `${API.baseUrl}/cart/remove/${productId}`,
      this.getAuthHeaders()
    );
  }
}
