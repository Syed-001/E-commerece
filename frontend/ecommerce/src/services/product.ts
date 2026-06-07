import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../interfaces/IProduct';
import { BASE_URL } from '../utils/appconstants';

interface ProductApi {
  id: number;
  prodName: string;
  prodDesc: string;
  prodCat?: string;
  price: number;
  availableQty: number;
  imageURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl: string = BASE_URL + '/product';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<ProductApi[]>(`${this.baseUrl}/all`, { withCredentials: true })
      .pipe(map((items) => items.map((item) => this.toProduct(item))));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<ProductApi[]>(`${this.baseUrl}/all`, {
      params: { category },
      withCredentials: true
    }).pipe(map((items) => items.map((item) => this.toProduct(item))));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<ProductApi>(`${this.baseUrl}/id/${id}`, { withCredentials: true })
      .pipe(map((item) => this.toProduct(item)));
  }

  private toProduct(api: ProductApi): Product {
    return {
      productId: api.id,
      name: api.prodName,
      description: api.prodDesc ?? '',
      price: api.price,
      quantity: api.availableQty,
      imageUrl: api.imageURL
    };
  }
}
