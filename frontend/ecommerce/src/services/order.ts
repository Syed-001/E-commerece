import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/IOrder';
import { BASE_URL } from '../utils/appconstants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl: string = BASE_URL + '/order';

  constructor(private http: HttpClient) { }

  createOrder(userId: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/order`, { userId }, { withCredentials: true });
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}`, null, { withCredentials: true });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/order`, { withCredentials: true });
  }

  getOrderHistory(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`, { withCredentials: true });
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`, { withCredentials: true });
  }
}
