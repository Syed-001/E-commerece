import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductApiRequest } from '../interfaces/IProduct';
import { BASE_URL } from '../utils/appconstants';

interface ProductApi {
  id: number;
  prodName: string;
  prodDesc: string;
  prodCat?: string;
  make?: string;
  price: number;
  availableQty: number;
  uom?: string;
  prodRating?: number;
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

  addProduct(product: ProductApiRequest): Observable<Product> {
    return this.http.post<ProductApi>(`${this.baseUrl}/add`, product, { withCredentials: true })
      .pipe(map((item) => this.toProduct(item)));
  }

  updateProduct(id: number, product: ProductApiRequest): Observable<Product> {
    return this.http.put<ProductApi>(`${this.baseUrl}/id/${id}`, product, { withCredentials: true })
      .pipe(map((item) => this.toProduct(item)));
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  toApiRequest(product: Product): ProductApiRequest {
    return {
      prodName: product.name,
      prodDesc: product.description,
      prodCat: product.category ?? '',
      make: product.make ?? '',
      availableQty: product.quantity,
      price: product.price,
      uom: product.uom ?? 'unit',
      prodRating: product.rating ?? 0,
      imageURL: product.imageUrl ?? ''
    };
  }

  toProduct(api: ProductApi): Product {
    return {
      productId: api.id,
      name: api.prodName,
      description: api.prodDesc ?? '',
      category: api.prodCat ?? '',
      make: api.make ?? '',
      price: api.price,
      quantity: api.availableQty,
      uom: api.uom ?? '',
      rating: api.prodRating ?? 0,
      imageUrl: api.imageURL
    };
  }
}
