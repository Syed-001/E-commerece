import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private platformId = inject(PLATFORM_ID);

  constructor(private authService: AuthService, private router: Router) {}

  get isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return sessionStorage.getItem('userType') === '0';
  }

  get isCustomer(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return sessionStorage.getItem('userType') === '1';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}