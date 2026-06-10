import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
    this.router.navigate(['/login']);
  }
}
