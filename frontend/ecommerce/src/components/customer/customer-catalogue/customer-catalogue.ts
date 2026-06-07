import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/IProduct';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart';


@Component({
  selector: 'app-customer-catalogue',
  imports: [CommonModule],
  templateUrl: './customer-catalogue.html',
  styleUrl: './customer-catalogue.css',
})
export class CustomerCatalogue implements OnInit {
  products: Product[] = [];
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products. Is the backend running?';
        console.error(err);
      }
    });
  }

  addToCart(product: Product) {
    let currentUserId = '';
    if (typeof sessionStorage !== 'undefined') {
      currentUserId = sessionStorage.getItem('userId') || '';
    }

    if (!currentUserId) {
      alert("Please login to add items to your cart.");
      return; 
    }

    const request = {
      userId: currentUserId,
      productId: product.productId!,
      quantity: 1
    };

    this.cartService.addToCart(request).subscribe({
      next: () => {
        alert(`${product.name} successfully added to your cart!`);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add item to cart.');
      }
    });
  }
}