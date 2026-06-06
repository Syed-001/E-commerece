import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order';
import { Order } from '../../interfaces/IOrder';

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

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (typeof sessionStorage !== 'undefined') {
      this.userId = sessionStorage.getItem('userId') || '';
    }

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
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Failed to load order history.";
      }
    });
  }
}