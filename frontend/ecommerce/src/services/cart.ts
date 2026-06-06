import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CartItem, CartRequest } from '../interfaces/ICart';
import { BASE_URL } from '../utils/appconstants';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl: string = BASE_URL + "/cart"; 
  
  public cartItemCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  getCartByUserId(userId: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.baseUrl}/${userId}`, { withCredentials: true });
  }

  addToCart(cartRequest: CartRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/addProd`, cartRequest, { withCredentials: true });
  }

  updateCartItem(cartRequest: CartRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, cartRequest, { withCredentials: true });
  }

  deleteCartItem(cartId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteProd/${cartId}`, { withCredentials: true });
  }

  updateCartCount(count: number) {
    this.cartItemCount.next(count);
  }
}