import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  cartCount = 0;
  private cartSub?: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to live cart count updates
    this.cartSub = this.cartService.cartItemCount.subscribe(count => {
      this.cartCount = count;
    });

    // Load initial cart count from backend if customer is logged in
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

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('userType') === '0';
    }
    return false;
  }

  get isCustomer(): boolean {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('userType') === '1';
    }
    return false;
  }

  logout() {
    this.authService.logout();
    this.cartService.updateCartCount(0);
    this.router.navigate(['/login']);
  }
}
