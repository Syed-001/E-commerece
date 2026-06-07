import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order';
import { Order } from '../../interfaces/IOrder';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistory implements OnInit {
  orders: Order[] = [];
  errorMessage: string = '';
  userId: string = '';
  private platformId = inject(PLATFORM_ID);

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.userId = sessionStorage.getItem('userId') || '';

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrderHistory(this.userId).subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) => (b.orderId || 0) - (a.orderId || 0));
        this.cdr.detectChanges();
        
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load order history.';
      }
    });
  }

  cancelOrder(orderId: number | undefined) {
    if (!orderId || !confirm('Cancel this order?')) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => this.loadOrders(),
      error: () => this.errorMessage = 'Failed to cancel order.'
    });
  }
}