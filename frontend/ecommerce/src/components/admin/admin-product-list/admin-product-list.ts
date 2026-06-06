import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';
import { Product } from '../../../interfaces/IProduct';

@Component({
  selector: 'app-admin-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-product-list.html',
  styleUrl: './admin-product-list.css',
})
export class AdminProductList implements OnInit {
  products: Product[] = [];
  successMessage: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error fetching products', err)
    });
  }

  deleteProduct(id: number | undefined) {

    if (id && confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.successMessage = 'Product deleted successfully!';
          this.loadProducts(); 
          
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => alert('Failed to delete product')
      });
    }
  }
}
