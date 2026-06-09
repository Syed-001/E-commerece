import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  filteredProducts: Product[] = [];
  errorMessage: string = '';
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [];
  addingProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.categories = [...new Set(data.map(p => p.category ?? '').filter(c => c !== ''))];
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products. Is the backend running?';
        console.error(err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    const cat = this.selectedCategory.toLowerCase();
    this.filteredProducts = this.products.filter(p => {
      const matchesTerm = !term ||
        p.name.toLowerCase().includes(term) ||
        (p.category ?? '').toLowerCase().includes(term) ||
        (p.make ?? '').toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term);
      const matchesCat = !cat || (p.category ?? '').toLowerCase() === cat;
      return matchesTerm && matchesCat;
    });
    this.cdr.detectChanges();
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  onCategoryFilter(event: Event): void {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.applyFilter();
  }

  addToCart(product: Product) {
    let currentUserId = '';
    if (typeof sessionStorage !== 'undefined') {
      currentUserId = sessionStorage.getItem('userId') || '';
    }

    if (!currentUserId) {
      alert('Please login to add items to your cart.');
      return;
    }

    this.addingProductId = product.productId!;

    const request = {
      userId: currentUserId,
      productId: product.productId!,
      quantity: 1
    };

    this.cartService.addToCart(request).subscribe({
      next: () => {
        this.addingProductId = null;
        // Refresh cart count
        this.cartService.getCartByUserId(currentUserId).subscribe({
          next: (items) => this.cartService.updateCartCount(items.length),
          error: () => {}
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.addingProductId = null;
        alert('Failed to add item to cart.');
        this.cdr.detectChanges();
      }
    });
  }
}
