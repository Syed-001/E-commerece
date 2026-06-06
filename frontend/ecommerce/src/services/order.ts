import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/IOrder';
import { BASE_URL } from '../utils/appconstants';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl: string = BASE_URL + "/order"; 

  constructor(private http: HttpClient) { }

  placeOrder(order: Order): Observable<any> {

    return this.http.post(`${this.baseUrl}/place`, order, { 
        responseType: 'text', 
        withCredentials: true });
  }


  getOrderHistory(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`, { withCredentials: true });
  }
}