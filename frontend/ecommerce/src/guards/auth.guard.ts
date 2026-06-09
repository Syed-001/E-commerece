import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (typeof sessionStorage !== 'undefined') {
    const userType = sessionStorage.getItem('userType');
    if (userType === '0') return true;
  }
  router.navigate(['/login']);
  return false;
};

export const customerGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (typeof sessionStorage !== 'undefined') {
    const userType = sessionStorage.getItem('userType');
    if (userType === '1') return true;
  }
  router.navigate(['/login']);
  return false;
};

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (typeof sessionStorage !== 'undefined') {
    const userType = sessionStorage.getItem('userType');
    if (userType !== null) return true;
  }
  router.navigate(['/login']);
  return false;
};
