import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { CartItem } from '../../interfaces/ICart';
import { Order, OrderItem } from '../../interfaces/IOrder'; 

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit { 
  cartItems: CartItem[] = [];
  orderTotal: number = 0;
  isProcessing: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  userId: string = sessionStorage.getItem('userId') || ''; 

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadCheckoutData();
  }

  loadCheckoutData() {
    this.cartService.getCartByUserId(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.orderTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      error: (err) => this.errorMessage = "Could not load cart for checkout."
    });
  }

  confirmOrder() {
    if (this.cartItems.length === 0) return;

    this.isProcessing = true;

    const orderItems: OrderItem[] = this.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      productName: item.productName,
      price: item.price
    }));

    const newOrder: Order = {
      userId: this.userId,
      totalAmount: this.orderTotal,
      items: orderItems, 
      orderStatus: 'PENDING'
    };

    this.orderService.placeOrder(newOrder).subscribe({
      next: (res) => {
        this.successMessage = "Order placed successfully!";
        this.isProcessing = false;
        
        this.cartItems.forEach(item => this.cartService.deleteCartItem(item.cartId).subscribe());
        this.cartService.updateCartCount(0); 

        setTimeout(() => this.router.navigate(['/customer/catalogue']), 3000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Order failed. Please try again.";
        this.isProcessing = false;
      }
    });
  }
}