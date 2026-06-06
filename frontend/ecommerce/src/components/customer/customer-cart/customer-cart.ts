import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../interfaces/ICart';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-customer-cart',
  imports: [ CommonModule ],
  templateUrl: './customer-cart.html',
  styleUrl: './customer-cart.css',
})
export class CustomerCart implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  
  userId: string = sessionStorage.getItem('userId') || 'waris123';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartByUserId(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal(); 
        

        this.cartService.updateCartCount(this.cartItems.length);
      },
      error: (err) => console.error('Error loading cart', err)
    });
  }

  calculateTotal() {
    this.cartTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

 
  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity < 1) return; 
    
    const request = {
      userId: this.userId,
      productId: item.productId,
      quantity: newQuantity
    };

    this.cartService.updateCartItem(request).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error updating quantity', err)
    });
  }

  removeItem(cartId: number) {
    if(confirm('Are you sure you want to remove this item?')) {
      this.cartService.deleteCartItem(cartId).subscribe({
        next: () => this.loadCart(), 
        error: (err) => console.error('Error removing item', err)
      });
    }
  }
}
