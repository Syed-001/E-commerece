import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { CartItem } from '../../interfaces/ICart';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  cartItems: CartItem[] = [];
  orderTotal: number = 0;
  userId: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isProcessing: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (typeof sessionStorage !== 'undefined') {
      this.userId = sessionStorage.getItem('userId') || '';
    }

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.getCartByUserId(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.orderTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load cart for checkout.';
        this.cdr.detectChanges();
      }
    });
  }

  confirmOrder() {
    if (this.cartItems.length === 0) return;

    this.isProcessing = true;
    this.errorMessage = '';

    this.orderService.createOrder(this.userId).subscribe({
      next: () => {
        this.successMessage = 'Order placed successfully!';
        this.cartService.updateCartCount(0);
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/customer/orders']), 2000);
      },
      error: () => {
        this.errorMessage = 'Failed to place order. Please try again.';
        this.isProcessing = false;
        this.cdr.detectChanges();
      }
    });
  }
}