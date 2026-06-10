import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Navbar } from '../navbar/navbar';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'mini-ecomm-frontend';
  cartCount = 0;
  private cartSub?: Subscription;

  constructor(private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.cartItemCount.subscribe(count => {
      this.cartCount = count;
      this.cdr.detectChanges();
    });

    // Load initial cart count if customer is logged in
    if (this.isCustomer) {
      const userId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('userId') || '' : '';
      if (userId) {
        this.cartService.getCartByUserId(userId).subscribe({
          next: (items) => this.cartService.updateCartCount(items.length),
          error: () => {}
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  get isCustomer(): boolean {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('userType') === '1';
    }
    return false;
  }
}
